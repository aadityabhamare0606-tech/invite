// Ground-truth text contrast for the hero, sampled across the whole entrance
// animation rather than at one settled frame.
//
// Why not just read the tokens and multiply, which is what
// scripts/check-contrast.py does: that approach has to guess WHERE on the
// gradient each line lands, and it guesses by testing the lightest stop of the
// whole section. That is conservative in the right direction and wrong often
// enough to be useless. The hero runs #0C091B at the top to #844B50 at the
// horizon. A line at the vertical centre lands on plum and has acres of
// contrast; the scroll cue is pinned to the bottom. Only one of those is a
// problem, and token arithmetic cannot tell them apart - it reports both as the
// same number. It reported the scroll cue at 3.16:1; measured, it is 6.50:1.
//
// So this measures instead of modelling. Two frames of the same layout:
//
//   frame A  text as-is
//   frame B  every text colour set to transparent, nothing else touched
//
//   A minus B, pixel by pixel, is exactly the glyph coverage. No layout has
//   moved, so every glyph pixel in A has its true background at the same
// coordinates in B. Nothing is modelled: not the gradient, not the car, not the
// hills, not the hearts, not the wine bloom. The hills are why this is worth
// doing - a name crossing a ridge reads against #442B43 on one line and #1B142B
// on the next, and no single token pair describes that.
//
// color:transparent rather than display:none, because display:none would drop
// the box and reflow the page, and the two frames would no longer share a
// coordinate system.
//
// The sweep over time is the other half. The hero runs a 5.2s entrance: the
// eyebrow leads, the names arrive letter by letter on staggered delays, and
// .hero-glow lands on both names at 4900ms and 5160ms. A single frame of the
// settled page said 5.14:1 for the ampersand; a frame 2.3s earlier said 2.17:1,
// because a blurred gold text-shadow stacks on itself and mid-animation the
// glyph edge sits inside more of it. A guest watches the whole sequence, so the
// settled frame is only the last sample, not the answer.
//
// Usage: node probe-text-contrast.js [url]
//   VW, VH    viewport, default 430x932
//   SWEEPS    seconds after the cover opens, comma separated
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const URL_ = process.argv[2] || 'http://127.0.0.1:8907/demos/trial/index.html';
const DIR = 'C:\\Users\\aadit\\AppData\\Local\\Temp\\opencode\\shots';
const GEO = path.join(DIR, 'hero-contrast.geo.json');
const PORT = 9347;
const PROFILE = 'C:\\Users\\aadit\\AppData\\Local\\Temp\\opencode\\chrome-profile-contrast';
const W = +(process.env.VW || 430);
const H = +(process.env.VH || 932);
const sleep = ms => new Promise(r => setTimeout(r, ms));
let id = 0;
function rpc(ws, method, params) {
  return new Promise((res, rej) => {
    const mid = ++id;
    const onMsg = ev => { const m = JSON.parse(ev.data);
      if (m.id === mid) { ws.removeEventListener('message', onMsg);
        m.error ? rej(new Error(method + ': ' + JSON.stringify(m.error))) : res(m.result); } };
    ws.addEventListener('message', onMsg);
    ws.send(JSON.stringify({ id: mid, method, params: params || {} }));
    setTimeout(() => rej(new Error(method + ': timeout')), 30000);
  });
}
async function ev(ws, e) {
  const r = await rpc(ws, 'Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
  return r.result.value;
}

/* Runs worth measuring, with no layout disturbed. */
const COLLECT = `(() => {
  const hero = document.getElementById('hero');
  const out = [];
  hero.querySelectorAll('*').forEach(el => {
    // direct text only: an element whose own text nodes are empty inherits its
    // box from a child and would double-count that child's glyphs
    const own = [...el.childNodes]
      .filter(n => n.nodeType === 3 && n.textContent.trim().length)
      .map(n => n.textContent.trim()).join(' ');
    if (!own) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') return;
    if (+cs.opacity === 0) return;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    if (r.bottom < 0 || r.top > innerHeight) return;   // off screen: not measurable
    const px = parseFloat(cs.fontSize);
    const bold = (parseInt(cs.fontWeight, 10) || 400) >= 700;
    // a text-shadow that lightens toward the text's own hue costs contrast
    // rather than buying it, so the direction is classified up front
    let shadowDarkens = null;
    if (cs.textShadow !== 'none') {
      const m = cs.textShadow.match(/rgba?\\(([^)]+)\\)/g) || [];
      if (m.length) {
        const sh = m[0].match(/[\\d.]+/g).map(Number);
        const fg = cs.color.match(/[\\d.]+/g).map(Number);
        const lin = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
        const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
        shadowDarkens = sh.length >= 3 && lum(sh[0], sh[1], sh[2]) < lum(fg[0], fg[1], fg[2]);
      }
    }
    out.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.className && el.className.baseVal !== undefined)
             ? (el.className.baseVal || '(svg)') : (el.className || ''),
      text: own.slice(0, 40),
      color: cs.color,
      // the element's own opacity multiplies its text against whatever is
      // behind it, so the sampled background is pre-composited with it below
      opacity: +cs.opacity,
      fontSize: px,
      // WCAG "large text": >=24px, or >=18.66px when bold
      large: px >= 24 || (bold && px >= 18.66),
      textShadow: cs.textShadow !== 'none' ? cs.textShadow : null,
      shadowDarkens: shadowDarkens,
      box: { x: Math.round(r.left), y: Math.round(r.top),
             w: Math.round(r.width), h: Math.round(r.height) }
    });
  });
  return { viewport: [innerWidth, innerHeight], targets: out };
})()`;

/* The two frames are 220ms apart, and the hero's decoration does not hold
   still in 220ms. Twenty hearts drift on infinite Web Animations - buildHearts
   starts each with iterations:Infinity and a 7-12s duration, translating up to
   190px - so a heart sitting on the WED line in frame A is somewhere else in
   frame B. The difference mask then reads that motion as glyph coverage and
   the arithmetic produces pixels that cannot exist: a gold glyph composited
   over rgb(73,61,88) is always a blend BETWEEN the two, never darker than
   both, so a reported "glyph" of rgb(39,24,56) under that background is a
   moving heart, not a letter.

   So the decoration is frozen before each pair is shot - paused where it is,
   not hidden. A heart drifting behind a name is part of the background a guest
   reads against; hiding it would measure a page that does not exist. One-shot
   hero animations are finished rather than paused, so the car's entrance cannot
   smear across the gap either. Text runs are left alone: the point of the sweep
   is to watch the entrance, and freezing the letters would report the settled
   page seven times.

   document.getAnimations() returns CSS transitions alongside keyframes, and
   the names arrive on transitions, so the __tcText tag set in COLLECT is what
   keeps this from freezing the very thing being measured. */
const FREEZE = `(() => {
  let paused = 0, finished = 0, text = 0;
  document.getAnimations().forEach(a => {
    const el = a.effect && a.effect.target;
    if (!el || !el.closest || !el.closest('#hero')) return;
    if (el.__tcText) { text++; return; }
    const t = a.effect.getTiming ? a.effect.getTiming() : null;
    if (t && t.iterations === Infinity) { a.pause(); paused++; }
    else { a.finish(); finished++; }
  });
  return { paused: paused, finished: finished, textLeftRunning: text };
})()`;

(async () => {
  fs.rmSync(PROFILE, { recursive: true, force: true });
  fs.mkdirSync(DIR, { recursive: true });
  const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-sandbox',
    '--hide-scrollbars', '--remote-debugging-port=' + PORT, '--user-data-dir=' + PROFILE,
    '--window-size=' + W + ',' + H, '--force-device-scale-factor=1',
    '--no-first-run', '--no-default-browser-check', 'about:blank'], { stdio: 'ignore' });
  let target = null;
  for (let i = 0; i < 40 && !target; i++) { await sleep(500);
    try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
          target = l.find(t => t.type === 'page'); } catch (_) {} }
  if (!target) throw new Error('Chrome never came up');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));
  await rpc(ws, 'Runtime.enable'); await rpc(ws, 'Page.enable');
  await rpc(ws, 'Emulation.setDeviceMetricsOverride',
            { width: W, height: H, deviceScaleFactor: 1, mobile: W < 700 });
  await rpc(ws, 'Page.navigate', { url: URL_ });
  await sleep(5000);
  await ev(ws, `(() => { const s = document.querySelector('#invite-open'); if (s) s.click(); return true; })()`);
  await ev(ws, `window.scrollTo(0, 0); true`);

  const SWEEPS = (process.env.SWEEPS || '0.35,0.9,1.8,3.0,4.5,6.0,8.0')
    .split(',').map(Number);
  const frames = [];
  const t0 = Date.now();
  for (const at of SWEEPS) {
    // hold each sample until its nominal time, so the sweep tracks real elapsed
    // time rather than the sum of the capture work
    const wait = at * 1000 - (Date.now() - t0);
    if (wait > 0) await sleep(wait);

    // COLLECT first, because it is what tags the text runs, and the freeze pass
    // needs those tags to know which animations to leave running. The tags
    // persist on the elements, so the first sweep needs the ordering and the
    // later ones are simply idempotent.
    const geo = await ev(ws, COLLECT);
    const frozen = await ev(ws, FREEZE);
    /* EXTRA_CSS is the control experiment. Set it to hide a suspected
       background layer and re-run: if a failure's worst pixel changes, the
       layer was the cause, and the token arithmetic never stood a chance. It
       is applied to BOTH frames, so it removes the layer from the page rather
       than from the measurement, and the difference mask stays valid. */
    if (process.env.EXTRA_CSS) {
      await ev(ws, `(() => {
        let s = document.getElementById('__contrast_extra');
        if (!s) { s = document.createElement('style'); s.id = '__contrast_extra'; document.head.appendChild(s); }
        s.textContent = ${JSON.stringify(process.env.EXTRA_CSS)};
        return true;
      })()`);
      await sleep(200);
    }
    const tag = String(at).replace('.', '_');
    const fa = path.join(DIR, 'hero-contrast.' + tag + '.png');
    const fb = path.join(DIR, 'hero-contrast.' + tag + '.text.png');
    const a = await rpc(ws, 'Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(fa, Buffer.from(a.data, 'base64'));

    await ev(ws, `(() => {
      let s = document.getElementById('__contrast_kill');
      if (!s) { s = document.createElement('style'); s.id = '__contrast_kill'; document.head.appendChild(s); }
      s.textContent = '#hero, #hero * { color: transparent !important; ' +
        '-webkit-text-fill-color: transparent !important; }';
      return true;
    })()`);
    await sleep(220);
    const b = await rpc(ws, 'Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(fb, Buffer.from(b.data, 'base64'));
    await ev(ws, `(() => { const s = document.getElementById('__contrast_kill'); if (s) s.remove(); return true; })()`);
    await sleep(140);

    frames.push({ at, a: fa, b: fb, geo, frozen });
    console.log('  t=%.2fs  %d run(s)  frozen %d infinite, finished %d, %d text anim left running  %s'
      % (at, geo.targets.length, frozen.paused, frozen.finished,
         frozen.textLeftRunning, path.basename(fa)));
  }

  fs.writeFileSync(GEO, JSON.stringify({ viewport: [W, H], sweeps: SWEEPS, frames }, null, 2));
  console.log('\nwrote ' + GEO);
  ws.close(); chrome.kill(); await sleep(600);
  process.exit(0);
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
