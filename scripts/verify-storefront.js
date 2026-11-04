// Audit the storefront (the Next.js app), not a demo.
//
// The demos have their own auditors — verify-demo-static.js, verify-demo-spa.js,
// verify-demo-render.js — but nothing checked the storefront itself. This one
// catches the class of bug that a storefront actually suffers from:
//
//   - the desktop nav wrapping onto three lines inside a 64px header, because
//     the breakpoint was earlier than the content needed
//   - scroll reveals never firing, so whole sections stay invisible
//   - a blanket animation kill-switch on <body> that silently kills the
//     testimonial marquee and every hover transition
//   - the collection filters silently matching nothing
//   - the live demo preview not opening
//   - text that fails WCAG AA contrast
//
// The repo's own browser tools could not be used for this: the connected
// headless browser never paints, so IntersectionObserver never fires, CSS
// transitions never advance and lazy images never load. Every one of those
// looks like a broken page if you cannot tell the difference. This script
// drives a real Chrome over the DevTools Protocol instead.
//
// Usage: node scripts/verify-storefront.js [url]
// Env:   VW, VH, PORT (default 3000)

const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const VW = +(process.env.VW || 1280);
const VH = +(process.env.VH || 900);
const PORT = +(process.env.PORT || 3000);
/* localhost, not 127.0.0.1 — the Next dev server treats localhost as its
   canonical origin and 403s every /_next/static chunk requested from
   127.0.0.1, which leaves the page unhydrated and every assertion below
   meaningless. */
const URL = process.argv[2] || `http://localhost:${PORT}/`;

const SHOT_DIR = path.join(os.tmpdir(), 'opencode', 'shots');
fs.mkdirSync(SHOT_DIR, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function findChrome() {
  const cands = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(os.homedir(), 'AppData\\Local', 'Google', 'Chrome', 'Application', 'chrome.exe'),
  ].filter(Boolean);
  for (const c of cands) if (fs.existsSync(c)) return c;
  return null;
}

(async () => {
  const chrome = findChrome();
  if (!chrome) { console.error('STOREFRONT AUDIT FAILED: no chrome binary found'); process.exit(1); }

  const port = 9300 + (process.pid % 400);
  const proc = spawn(chrome, [
    '--headless=new', `--remote-debugging-port=${port}`,
    `--window-size=${VW},${VH}`, '--disable-gpu', '--no-first-run',
    '--no-default-browser-check', '--hide-scrollbars',
    '--user-data-dir=' + path.join(os.tmpdir(), `storefront-chrome-${process.pid}`),
    'about:blank',
  ], { stdio: 'ignore' });

  let wsUrl = null;
  for (let i = 0; i < 60 && !wsUrl; i++) {
    await sleep(250);
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/list`);
      const tabs = await r.json();
      const t = tabs.find((x) => x.type === 'page');
      if (t && t.webSocketDebuggerUrl) wsUrl = t.webSocketDebuggerUrl;
    } catch { /* not up yet */ }
  }
  if (!wsUrl) { proc.kill(); console.error('STOREFRONT AUDIT FAILED: chrome devtools never came up'); process.exit(1); }

  if (typeof WebSocket === 'undefined') {
    proc.kill();
    console.error('STOREFRONT AUDIT FAILED: no global WebSocket in this Node build');
    process.exit(1);
  }
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => {
    ws.addEventListener('open', res, { once: true });
    ws.addEventListener('error', rej, { once: true });
  });

  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const { resolve, reject } = pending.get(m.id);
      pending.delete(m.id);
      m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
    } else if (m.method) {
      listeners.forEach((fn) => fn(m));
    }
  });

  const send = (method, params) => new Promise((resolve, reject) => {
    const myId = ++id;
    pending.set(myId, { resolve, reject });
    ws.send(JSON.stringify({ id: myId, method, params }));
  });

  const consoleProblems = [];
  const netFailures = [];
  listeners.push((m) => {
    if (m.method === 'Runtime.consoleAPICalled' && /error|warning/.test(m.params.type)) {
      consoleProblems.push({
        type: m.params.type,
        text: (m.params.args || []).map((a) => a.value ?? a.description ?? a.type).join(' ').slice(0, 300),
      });
    }
    if (m.method === 'Runtime.exceptionThrown') {
      const d = m.params.exceptionDetails;
      consoleProblems.push({ type: 'exception', text: (d.exception?.description || d.text || '').slice(0, 300) });
    }
    if (m.method === 'Network.responseReceived' && m.params.response.status >= 400) {
      netFailures.push({ status: m.params.response.status, url: m.params.response.url.slice(0, 200) });
    }
    if (m.method === 'Network.loadingFailed') {
      const et = m.params.errorText || '';
      if (et !== 'net::ERR_ABORTED') {
        netFailures.push({ status: 'failed', url: (m.params.requestId || '').slice(0, 120), error: et });
      }
    }
  });

  const evaluate = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) {
      const d = r.exceptionDetails;
      throw new Error('page threw: ' + (d.exception?.description || d.text || 'unknown'));
    }
    return r.result && r.result.value;
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: VW, height: VH, deviceScaleFactor: 1, mobile: VW < 700,
  });

  /* REDUCE=1 emulates the OS "reduce motion" setting. The storefront used to
     ship a blanket animation kill-switch instead of honouring this, which
     also killed the marquee and every hover transition on everyone. */
  const REDUCE = process.env.REDUCE === '1';
  if (REDUCE) {
    await send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
    });
  }

  await send('Page.navigate', { url: URL });
  await sleep(4000);

  // Scroll down in viewport steps so IntersectionObserver reveals fire and
  // lazy images load, then return to the top.
  const total = await evaluate('document.documentElement.scrollHeight');
  for (let y = 0; y < total; y += Math.floor(VH * 0.6)) {
    await evaluate(`window.scrollTo(0, ${y})`);
    await sleep(160);
  }
  await evaluate('window.scrollTo(0, 0)');
  await sleep(1200);

  const probe = `(() => {
    const out = {};
    out.title = document.title;
    out.url = location.pathname;
    out.htmlClass = document.documentElement.className;
    out.bodyClass = document.body.className;

    // ── NAVBAR ──────────────────────────────────────────────────────────
    const header = document.querySelector('header.sticky');
    const nav = header && header.querySelector('nav');
    out.navDisplay = nav ? getComputedStyle(nav).display : 'missing';
    out.navItems = nav
      ? [...nav.querySelectorAll('a,button')].slice(0, 4).map((a) => ({
          text: a.textContent.trim().replace(/\\s+/g, ' '),
          h: Math.round(a.getBoundingClientRect().height),
          lines: Math.round(a.getBoundingClientRect().height / 20),
        }))
      : [];
    // A nav link taller than ~48px has wrapped onto more than one line.
    out.navWrapped = out.navItems.filter((i) => i.h > 48).map((i) => i.text);
    const cta = header && header.querySelector('a.btn-primary');
    out.navCtaHeight = cta ? Math.round(cta.getBoundingClientRect().height) : 0;
    out.navCtaWrapped = out.navCtaHeight > 48;
    out.headerHeight = header ? Math.round(header.getBoundingClientRect().height) : 0;

    // ── SCROLL REVEALS ──────────────────────────────────────────────────
    const revs = [...document.querySelectorAll('.reveal')];
    out.revealTotal = revs.length;
    out.revealVisible = revs.filter((e) => e.classList.contains('visible')).length;
    // An element inside the viewport that is still transparent is a stuck reveal.
    out.revealStuck = revs
      .filter((e) => {
        const r = e.getBoundingClientRect();
        const inView = r.top < innerHeight && r.bottom > 0 && r.width > 0;
        return inView && getComputedStyle(e).opacity !== '1';
      })
      .map((e) => e.className.slice(0, 60));

    // ── FILTERS ─────────────────────────────────────────────────────────
    const chips = [...document.querySelectorAll('.filter-chip')];
    out.filterChipCount = chips.length;
    out.filterChips = chips.map((c) => c.textContent.trim().replace(/\\s+/g, ' '));
    // Not every route has a #collection section, so count the cards generically.
    out.cardsTotal = document.querySelectorAll('article.card-hover').length;

    // ── MARQUEE ─────────────────────────────────────────────────────────
    const track = document.querySelector('.testimonial-track');
    out.marqueeAnimation = track ? getComputedStyle(track).animationName : 'missing';
    out.testimonialCardBorder = (() => {
      const c = document.querySelector('.testimonial-card');
      return c ? getComputedStyle(c).borderColor : 'missing';
    })();

    // ── CONTRAST ────────────────────────────────────────────────────────
    const cs = getComputedStyle(document.documentElement);
    const lum = (hex) => {
      const c = hex.replace('#', '');
      const v = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255)
        .map((x) => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)));
      return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
    };
    const ratio = (a, b) => {
      const l1 = lum(a), l2 = lum(b);
      return ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2);
    };
    out.textMuted = cs.getPropertyValue('--text-muted').trim();
    out.textMutedContrastOnWhite = ratio(out.textMuted, '#ffffff');

    // ── LAYOUT ──────────────────────────────────────────────────────────
    out.hasHorizontalOverflow = document.documentElement.scrollWidth > ${VW} + 1;
    out.docHeight = document.documentElement.scrollHeight;
    out.bodyTextLength = (document.body.innerText || '').trim().length;

    // ── IMAGES ──────────────────────────────────────────────────────────
    const imgs = [...document.images];
    out.imgTotal = imgs.length;
    // complete && naturalWidth === 0 is a real 404; complete === false is lazy.
    out.imgBroken = imgs.filter((i) => i.complete && i.naturalWidth === 0)
      .map((i) => (i.currentSrc || i.src || '').slice(-70));

    return out;
  })()`;

  let result;
  try {
    result = await evaluate(probe);
  } catch (e) {
    proc.kill();
    console.error('STOREFRONT AUDIT FAILED: ' + e.message);
    process.exit(1);
  }

  // ── Interaction test: does the live preview actually open? ───────────
  let modal = { opened: false, noCard: true };
  try {
    const clicked = await evaluate(`(() => {
      const b = document.querySelector('article.card-hover button');
      if (b) { b.click(); return true; }
      return false;
    })()`);
    await sleep(2500);
    modal = await evaluate(`(() => {
      const d = document.querySelector('[role="dialog"]');
      if (!d) return { opened: false };
      const f = d.querySelector('iframe');
      const phone = d.querySelector('.demo-phone');
      const cs = getComputedStyle(d);
      return {
        opened: true,
        hasIframe: !!f,
        iframeSrc: f ? (f.getAttribute('src') || '').slice(-40) : null,
        hasPhoneFrame: !!phone,
        phoneW: phone ? Math.round(phone.getBoundingClientRect().width) : 0,
        bodyLocked: getComputedStyle(document.body).overflow,
        hasToggle: !!d.querySelector('.demo-view-toggle'),
        newTabLink: !!d.querySelector('a[target="_blank"]'),
        backdrop: cs.backgroundColor,
        zIndex: cs.zIndex,
        position: cs.position,
        /* Hit-test a point beside the phone. If the modal is really painted
           on top, elementFromPoint returns the dialog — not the page behind
           it. A screenshot alone cannot prove this, because headless Chrome
           composites a position:fixed overlay differently from a real
           window. */
        hitTest: (() => {
          const el = document.elementFromPoint(Math.round(innerWidth * 0.08), Math.round(innerHeight * 0.6));
          return el ? (el.className || el.tagName).toString().slice(0, 40) : 'none';
        })(),
        hitTestIsDialog: (() => {
          const el = document.elementFromPoint(Math.round(innerWidth * 0.08), Math.round(innerHeight * 0.6));
          return !!(el && el.closest('[role="dialog"]'));
        })(),
      };
    })()`);
    modal.noCard = !clicked;
    // Capture the open preview so the phone frame can be eyeballed.
    if (modal.opened) {
      try {
        const s = await send('Page.captureScreenshot', { format: 'png' });
        modal.shot = path.join(SHOT_DIR, `storefront-modal-${VW}x${VH}.png`);
        fs.writeFileSync(modal.shot, Buffer.from(s.data, 'base64'));
      } catch { /* screenshot is a nice-to-have */ }
    }
    await evaluate(`document.querySelector('[role="dialog"] button[aria-label="Close preview"]')?.click()`);
    await sleep(400);
    modal.closesOnEscape = await evaluate(`!document.querySelector('[role="dialog"]')`);
  } catch (e) {
    modal.error = e.message;
  }

  // ── Filter interaction test ──────────────────────────────────────────
  let filter = { worked: false, skipped: true };
  try {
    const before = await evaluate(`document.querySelectorAll('article.card-hover').length`);
    const chipText = await evaluate(`(() => {
      const c = [...document.querySelectorAll('.filter-chip')].find(x => /Corporate Gifting/i.test(x.textContent));
      if (!c) return null;
      c.click();
      return c.textContent.trim().replace(/\\s+/g, ' ');
    })()`);
    await sleep(900);
    const after = await evaluate(`document.querySelectorAll('article.card-hover').length`);
    const status = await evaluate(`(() => {
      const el = [...document.querySelectorAll('p')].find(p => /Showing \\d+ of \\d+/.test(p.textContent));
      return el ? el.textContent.trim() : null;
    })()`);
    filter = { worked: chipText !== null && after < before, skipped: chipText === null, chip: chipText, before, after, status };
  } catch (e) {
    filter.error = e.message;
  }

  // Reset the filter before the screenshot so the shot shows the default
  // state of the page, not the state the filter test left behind.
  try {
    await evaluate(`(() => {
      const c = [...document.querySelectorAll('.filter-chip')].find(x => /^All/.test(x.textContent.trim()));
      if (c) c.click();
      return true;
    })()`);
    await sleep(800);
  } catch { /* non-fatal */ }

  // Full-page screenshot
  let shot = null;
  try {
    const metrics = await send('Page.getLayoutMetrics');
    const h = Math.min(Math.ceil(metrics.cssContentSize.height), 16000);
    await send('Emulation.setDeviceMetricsOverride', {
      width: VW, height: h, deviceScaleFactor: 1, mobile: VW < 700,
    });
    await sleep(800);
    const s = await send('Page.captureScreenshot', { format: 'png' });
    shot = path.join(SHOT_DIR, `storefront-full-${VW}x${VH}.png`);
    fs.writeFileSync(shot, Buffer.from(s.data, 'base64'));
  } catch { /* screenshot is a nice-to-have */ }

  const verdict = {
    navWrapped: result.navWrapped,
    navCtaWrapped: result.navCtaWrapped,
    revealsStuck: result.revealStuck.length,
    revealVisible: `${result.revealVisible}/${result.revealTotal}`,
    marqueeRunning: result.marqueeAnimation === 'marquee',
    filterWorks: filter.worked,
    modalOpens: modal.opened && modal.hasIframe,
    modalHasPhoneFrame: modal.hasPhoneFrame,
    mutedContrast: result.textMutedContrastOnWhite,
    horizontalOverflow: result.hasHorizontalOverflow,
    brokenImages: result.imgBroken.length,
    consoleProblems: consoleProblems.length,
    netFailures: netFailures.length,
    reducedMotion: REDUCE,
  };

  const report = { url: URL, viewport: `${VW}x${VH}`, verdict, details: result, modal, filter, consoleProblems, netFailures, shot };
  const outFile = path.join(SHOT_DIR, `storefront-audit-${VW}x${VH}.json`);
  fs.writeFileSync(outFile, JSON.stringify(report, null, 2));

  // stdout is a single JSON object so the result can be piped into another
  // tool without having to strip the human-readable section first.
  process.stdout.write(JSON.stringify({
    url: URL,
    viewport: `${VW}x${VH}`,
    verdict,
    modal: { opened: modal.opened, phoneFrame: modal.hasPhoneFrame, iframe: modal.iframeSrc, closes: modal.closesOnEscape },
    filter: { worked: filter.worked, chip: filter.chip, before: filter.before, after: filter.after, status: filter.status },
    consoleProblems,
    netFailures,
    report: outFile,
    shot,
  }, null, 2) + '\n');

  proc.kill();
})();
