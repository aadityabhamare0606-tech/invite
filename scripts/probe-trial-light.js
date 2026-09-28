// Measures the five changes made to the web-2 trial demo, on the rendered
// page rather than in the source. Every one of them can look right in JSX and
// still be wrong once the browser lays it out, and three of the five are
// about light-versus-dark, which is exactly the thing that cannot be read off
// a stylesheet.
//
//   1. hero      - taller section, real gaps between the three lines, and the
//                  absolutely-positioned car not left behind on top of them.
//   2. celebrations - the band actually light, each of the three cards a
//                  different light blue, three distinct background motifs.
//   3. card text - contrast of real glyph pixels against the real painted
//                  card, on BOTH faces of the flip.
//   4. "meet the / Bride & Groom" gone from the rendered text.
//   5. date reveal present, above the venue, showing the right date.
//
// The card flip is the reason FACE exists. These cards turn over about two
// seconds after they reveal and then stay turned, so by the time any probe
// gets around to measuring, the front is hidden by backface-visibility and
// the back is showing. A first version of this script cropped the FRONT
// face's heading box after the flip had already happened and reported
// 2.31:1 - it was measuring the back face's rules and dates, not the heading
// it thought it was. Both faces are real, both are read by a guest, so both
// get measured, and the flip is pinned with injected CSS rather than raced.
//
// Usage: VW=430 VH=932 FACE=front node scripts/probe-trial-light.js
// Writes: $TMP/opencode/shots/trial-light-<FACE>-<VW>x<VH>.json
//         $TMP/opencode/shots/trial-card-<FACE>-<n>-<VW>x<VH>.png

const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const VW = +(process.env.VW || 430);
const VH = +(process.env.VH || 932);
const FACE = process.env.FACE === 'back' ? 'back' : 'front';
const PORT = +(process.env.PORT || 8907);
const URL = `http://127.0.0.1:${PORT}/demos/trial/index.html`;
const OUT = path.join(os.tmpdir(), 'opencode', 'shots');
fs.mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function findChrome() {
  const cands = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(os.homedir(), 'AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'),
  ].filter(Boolean);
  for (const c of cands) if (fs.existsSync(c)) return c;
  return null;
}

// Pin one face of the flip and kill the animation that drives it.
const FACE_CSS = {
  front: `
    .event-card-inner { animation: none !important; transform: none !important; }
    .event-card-back  { visibility: hidden !important; }
  `,
  back: `
    .event-card-inner { animation: none !important; transform: rotateY(180deg) !important; }
    .event-card-front { visibility: hidden !important; }
  `,
};

(async () => {
  const chrome = findChrome();
  if (!chrome) { console.error('PROBE FAILED: no chrome'); process.exit(1); }

  const port = 9400 + (process.pid % 400);
  const proc = spawn(chrome, [
    '--headless=new', `--remote-debugging-port=${port}`,
    `--window-size=${VW},${VH}`, '--disable-gpu', '--no-first-run',
    '--no-default-browser-check', '--hide-scrollbars',
    '--user-data-dir=' + path.join(os.tmpdir(), `trial-light-${process.pid}`),
    'about:blank',
  ], { stdio: 'ignore' });

  let wsUrl = null;
  for (let i = 0; i < 60 && !wsUrl; i++) {
    await sleep(250);
    try {
      const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const t = tabs.find((x) => x.type === 'page');
      if (t && t.webSocketDebuggerUrl) wsUrl = t.webSocketDebuggerUrl;
    } catch { /* not up yet */ }
  }
  if (!wsUrl) { proc.kill(); console.error('PROBE FAILED: no devtools'); process.exit(1); }

  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => {
    ws.addEventListener('open', res, { once: true });
    ws.addEventListener('error', rej, { once: true });
  });

  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const { resolve, reject } = pending.get(m.id);
      pending.delete(m.id);
      m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
    }
  });
  const send = (method, params) => new Promise((resolve, reject) => {
    const myId = ++id;
    pending.set(myId, { resolve, reject });
    ws.send(JSON.stringify({ id: myId, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: VW, height: VH, deviceScaleFactor: 1, mobile: VW < 700 });
  await send('Page.navigate', { url: URL });
  await sleep(6000);

  // Scroll through so every IntersectionObserver reveal has fired and every
  // lazy image has loaded, then pin the face we want to measure.
  const total = (await send('Runtime.evaluate', { expression: 'document.documentElement.scrollHeight', returnByValue: true })).result.value;
  for (let y = 0; y < total; y += Math.floor(VH * 0.7)) {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` });
    await sleep(200);
  }
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
  await sleep(800);
  await send('Runtime.evaluate', {
    expression: `(() => {
      let s = document.getElementById('probe-face-css');
      if (!s) { s = document.createElement('style'); s.id = 'probe-face-css'; document.head.appendChild(s); }
      s.textContent = ${JSON.stringify(FACE_CSS[FACE])};
      return true;
    })()`,
    returnByValue: true,
  });
  await sleep(400);

  const probe = `(() => {
    const out = {};
    const body = document.body.innerText || '';
    out.face = ${JSON.stringify(FACE)};

    // ── 4. the removed block ────────────────────────────────────────
    out.meetThePhrase = /meet the/i.test(body) ? 'STILL PRESENT' : 'gone';
    out.brideGroomHeading = /Bride\\s*&\\s*Groom/i.test(body) ? 'STILL PRESENT' : 'gone';

    // ── 1. hero ─────────────────────────────────────────────────────
    const names = [...document.querySelectorAll('.hero-title-step')];
    out.heroNameCount = names.length;
    out.heroNameTexts = names.map(n => n.textContent.trim());
    const heroBox = (() => {
      const wrap = names[0]?.parentElement?.parentElement;
      if (!wrap) return null;
      const r = wrap.getBoundingClientRect();
      return { top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height) };
    })();
    out.heroTextBlock = heroBox;
    out.heroSectionH = Math.round(document.querySelector('section, div')?.getBoundingClientRect().height || 0);
    const heroRoot = document.querySelector('.hero-floating-heart')?.closest('div[class*="h-[1180px]"], div');
    out.heroRootH = heroRoot ? Math.round(heroRoot.getBoundingClientRect().height) : null;

    const car = document.querySelector('img[src*="56.png"]')?.closest('div.absolute');
    if (car) {
      const r = car.getBoundingClientRect();
      out.carBox = { top: Math.round(r.top), bottom: Math.round(r.bottom) };
      if (heroBox) {
        out.overlapPx = Math.round(heroBox.bottom - r.top);
        out.typeClearsCar = heroBox.bottom <= r.top;
      }
    }
    out.heroGaps = names.slice(1).map((n, i) =>
      Math.round(n.getBoundingClientRect().top - names[i].getBoundingClientRect().bottom));

    // ── 2. the celebrations band and its three cards ─────────────────
    const band = document.querySelector('.celebrations-block');
    out.bandExists = !!band;
    if (band) {
      const cs = getComputedStyle(band);
      const b = cs.backgroundColor.match(/[\\d.]+/g).slice(0, 3).map(Number);
      out.bandBg = b;
      out.bandIsLight = b.every(v => v > 200);
      out.bandIsNotWhite = b.some((v, i) => v < [255,255,255][i] - 4);
      // skin/peach would be red clearly above blue
      out.bandIsSkinTone = (b[0] - b[2]) > 12;
      out.bandLatticeLayers = (cs.backgroundImage.match(/repeating-linear-gradient/g) || []).length;
      out.bandBloomLayers = (cs.backgroundImage.match(/radial-gradient/g) || []).length;
    }

    const cards = [...document.querySelectorAll('.event-card')];
    out.cardCount = cards.length;
    out.cards = cards.map((c) => {
      const cs = getComputedStyle(c);
      // Parse rgb()/rgba() only. A bare /\\d+/ grab takes the gradient ANGLE
      // first - "linear-gradient(155deg, rgb(216,235,233) ...)" yields
      // [155,216,235] - which made every card look like a dark colour and
      // reported the three grounds as 1.7 apart when they are 13 apart.
      const stops = (cs.backgroundImage.match(/rgba?\\([^)]+\\)/g) || []).map(
        (s) => s.match(/[\\d.]+/g).slice(0, 3).map(Number));
      const r = c.getBoundingClientRect();
      return {
        name: c.getAttribute('data-name'),
        stops,
        w: Math.round(r.width), h: Math.round(r.height),
        allStopsLight: stops.length > 0 && stops.every((s) => s.every((v) => v > 170)),
      };
    });

    // separation measured on the DARKER stop of each card, which is the
    // worst case for the text sitting on it
    const dark = out.cards.map(c => c.stops[1] || c.stops[0]);
    out.cardSeparation = [];
    for (let i = 0; i < dark.length; i++) for (let j = i + 1; j < dark.length; j++) {
      if (!dark[i] || !dark[j]) continue;
      const a = dark[i], b = dark[j];
      out.cardSeparation.push({
        pair: out.cards[i].name + ' vs ' + out.cards[j].name,
        delta: +((Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]) + Math.abs(a[2]-b[2])) / 3).toFixed(1),
        verdict: 'distinct' ,
      });
    }
    for (const s of out.cardSeparation) s.verdict = s.delta >= 8 ? 'distinct' : 'TOO SIMILAR';
    out.allCardsDistinct = out.cardSeparation.every(s => s.verdict === 'distinct');

    out.patternIds = [...document.querySelectorAll('.event-card svg pattern')].map(p => p.id);
    out.patternIdsUnique = new Set(out.patternIds).size === out.patternIds.length;
    out.patternsHaveGeometry = [...document.querySelectorAll('.event-card svg pattern')].map(
      p => p.children.length);

    // ── 3. the text on the face we are measuring ────────────────────
    const sel = out.face === 'back' ? '.event-card-back' : '.event-card-front';
    out.cardText = [];
    cards.forEach((c, ci) => {
      const face = c.querySelector(sel);
      if (!face) return;
      const items = [...face.querySelectorAll('h3, p, span')].filter((e) => {
        const t = (e.textContent || '').trim();
        return t && t !== '✦' && e.getBoundingClientRect().height > 4;
      });
      items.forEach((e, ii) => {
        const r = e.getBoundingClientRect();
        const cs = getComputedStyle(e);
        out.cardText.push({
          card: c.getAttribute('data-name'),
          idx: ii,
          text: (e.textContent || '').trim().slice(0, 42),
          color: cs.color,
          font: cs.fontFamily.split(',')[0].replace(/["']/g, ''),
          size: cs.fontSize,
          box: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
          visible: r.width > 0 && r.height > 0,
          overflowsCard: r.width > c.getBoundingClientRect().width - 12,
        });
      });
    });

    // ── 5. the date reveal ──────────────────────────────────────────
    const dr = document.querySelector('.date-reveal');
    out.dateRevealExists = !!dr;
    if (dr) {
      out.dateRevealText = (dr.innerText || '').replace(/\\n+/g, ' | ').trim();
      const venue = document.querySelector('.venue-section');
      if (venue) {
        const a = dr.getBoundingClientRect(), b = venue.getBoundingClientRect();
        out.dateAboveVenue = b.top > a.top;
        out.boxGapPx = Math.round(b.top - a.bottom);
      }
      out.dateRevealLabel = dr.getAttribute('aria-label');
      const g = dr.querySelector('p.font-gotu');
      out.dateFont = g ? { family: getComputedStyle(g).fontFamily.split(',')[0].replace(/["']/g,''), size: getComputedStyle(g).fontSize } : null;
    }
    return out;
  })()`;

  let r;
  try {
    r = await send('Runtime.evaluate', { expression: probe, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  } catch (e) {
    proc.kill();
    console.error('PROBE FAILED: ' + e.message);
    process.exit(1);
  }
  const data = r.result.value;

  // Crop each measured text run. captureBeyondViewport with page-space clip is
  // required: the cards sit thousands of pixels down the document and the
  // viewport is only VH tall.
  let n = 0;
  for (const ct of data.cardText) {
    if (!ct.box.w || !ct.box.h) continue;
    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: Math.max(0, ct.box.x), y: Math.max(0, ct.box.y), width: ct.box.w, height: ct.box.h, scale: 1 },
      captureBeyondViewport: true,
    }).catch(() => null);
    if (!shot) continue;
    const name = `trial-card-${FACE}-${String(n).padStart(2, '0')}-${VW}x${VH}.png`;
    fs.writeFileSync(path.join(OUT, name), Buffer.from(shot.data, 'base64'));
    ct.shot = name;
    n++;
  }

  fs.writeFileSync(path.join(OUT, `trial-light-${FACE}-${VW}x${VH}.json`), JSON.stringify(data, null, 2));
  console.log(JSON.stringify(data, null, 2));
  ws.close(); proc.kill();
  process.exit(0);
})().catch((e) => { console.error('PROBE FAILED: ' + e.message); process.exit(1); });
