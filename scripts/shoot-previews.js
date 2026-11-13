// Regenerate the storefront's design previews from the live demos.
//
// Why this exists: the preview .webp files were screenshots taken from much
// older builds of the demos. demo-1's preview showed a pink "Lantern Dreams"
// hero with six tiled "© OurMoments" watermarks; the live demo is now a
// completely different navy mandap hero with no watermark at all. Once the
// storefront can open a design in a live preview, a visitor sees the stale
// picture next to the real thing and stops trusting the picture.
//
// Captures run at 4:5 (portrait) because that is what a guest actually sees
// — every one of these designs is opened on a phone. Previews with entry
// gates are captured after opening so the card shows the experience inside.
//
// Output: public/assets/demos/<name>.webp
//
// Usage: node scripts/shoot-previews.js [--review] [--opened]

const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'demos');
const REVIEW = process.argv.includes('--review');
const OPENED_ONLY = process.argv.includes('--opened');
const MEMORIES_ONLY = process.argv.includes('--memories-only');

const W = 900;
const H = 1125; // 4:5

/* Each entry: where the demo lives, what to call the preview, and optional
   actions needed to reach the experience shown in the storefront card. */
const TARGETS = [
  { src: '/demos/demo-1/index.html', out: 'demo-1', click: '.gate-open-btn', afterOpen: true },
  { src: '/demos/demo-16/index.html', out: 'demo-16', click: '#env-outer', afterOpen: true },
  { src: '/demos/moonlit-palace/index.html', out: 'wedding-invite-7-501', click: '[aria-label="Open Vivaan and Anaya\'s wedding invitation"]', afterOpen: true },
  { src: '/demos/trial/index.html', out: 'trial', click: '[aria-label="Open your wedding invitation"]', afterOpen: true },
  { src: '/demos/rajwada-royale/index.html', out: 'demo-3', click: '.rj-pre-tap', afterOpen: true },
  { src: '/demos/demo-15-mountain/index.html', out: 'demo-15-mountain-502', click: '#igEnter', scroll: 700, afterOpen: true },
  { src: '/demos/save-the-date-1/index.html', out: 'save-the-date-1', click: '#preloader', afterOpen: true },
  { src: '/demos/save-the-date-mountain/index.html', out: 'save-the-date-mountain', click: '#preloader', scroll: 700, afterOpen: true },
  { src: '/demos/demo-10/index.html', out: 'proposal-preview-1', hide: '.om-watermark' },
  { src: '/demos/demo-12/index.html', out: 'proposal-preview-3' },
  { src: '/demos/demo-13/index.html', out: 'proposal-preview-4', click: '[aria-label="Open the memory jar"]', afterOpen: true },
  { src: '/demos/proposal-journey/index.html', out: 'proposal-preview-6' },
  { src: '/demos/floating-hearts/index.html', out: 'proposal-preview-7', click: '[aria-label="Start"]', afterOpen: true },
  { src: '/demos/memories-family-story/index.html', out: 'memories-family-story', scroll: 520 },
  { src: '/demos/memories-family-story-3/index.html', out: 'memories-family-story-3', scroll: 300 },
  { src: '/demos/memories-time-capsule/index.html', out: 'memories-time-capsule', scroll: 340 },
  { src: '/demos/memories-time-capsule-3/index.html', out: 'memories-time-capsule-3', click: '#open', afterOpen: true },
  { src: '/demos/memories-wedding-memories/index.html', out: 'memories-wedding-memories', scroll: 800, click: '#reelPlay', afterOpen: true },
  { src: '/demos/memories-wedding-memories-3/index.html', out: 'memories-wedding-memories-3', click: '#heroOpen', afterOpen: true },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function findChrome() {
  const cands = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(os.homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'Application', 'chrome.exe'),
  ].filter(Boolean);
  for (const c of cands) if (fs.existsSync(c)) return c;
  return null;
}

(async () => {
  const chrome = findChrome();
  if (!chrome) { console.error('PREVIEW SHOOT FAILED: no chrome binary found'); process.exit(1); }

  const port = 9600 + (process.pid % 300);
  const proc = spawn(chrome, [
    '--headless=new', `--remote-debugging-port=${port}`,
    `--window-size=${W},${H}`, '--disable-gpu', '--no-first-run',
    '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required',
    '--user-data-dir=' + path.join(os.tmpdir(), `prev-${process.pid}`),
    'about:blank',
  ], { stdio: 'ignore' });

  let wsUrl = null;
  for (let i = 0; i < 60 && !wsUrl; i++) {
    await sleep(250);
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/list`);
      const t = (await r.json()).find((x) => x.type === 'page');
      if (t && t.webSocketDebuggerUrl) wsUrl = t.webSocketDebuggerUrl;
    } catch { /* not up yet */ }
  }
  if (!wsUrl) { proc.kill(); console.error('PREVIEW SHOOT FAILED: chrome never came up'); process.exit(1); }

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
  const evaluate = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) return null;
    return r.result && r.result.value;
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: true });

  /* A blank page is used as the WebP encoder. Chrome can encode WebP through
     a canvas; there is no WebP encoder in .NET or in Node without a native
     dependency. */
  await send('Page.navigate', { url: 'about:blank' });
  await sleep(400);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const reviewDir = path.join(os.tmpdir(), 'opencode', 'shots', 'previews');
  fs.mkdirSync(reviewDir, { recursive: true });

  const results = [];

  const selectedTargets = MEMORIES_ONLY
    ? TARGETS.filter((t) => t.src.includes('/demos/memories-'))
    : TARGETS;
  const targets = OPENED_ONLY ? selectedTargets.filter((t) => t.afterOpen) : selectedTargets;

  for (const t of targets) {
    try {
      await send('Page.navigate', { url: `http://localhost:3000${t.src}` });
      await sleep(4200);
      if (t.scroll) {
        await evaluate(`window.scrollTo(0, ${t.scroll})`);
        await sleep(1500);
      }
      if (t.hide) {
        /* Some demos stamp the brand across the whole viewport as a
           watermark. On the delivered invite that protects the design; on a
           storefront preview it is just noise repeated six times across the
           product picture. Hide it for the capture only — the live demo in
           the preview modal keeps it. */
        await evaluate(`(() => {
          const style = document.createElement('style');
          style.textContent = ${JSON.stringify(t.hide)} + ' { display: none !important; }';
          document.head.appendChild(style);
          return true;
        })()`);
        await sleep(400);
      }
      if (t.click) {
        const clicked = await evaluate(`(() => {
          const el = document.querySelector(${JSON.stringify(t.click)});
          if (el) el.click();
          return !!el;
        })()`);
        if (!clicked) throw new Error(`open control not found: ${t.click}`);
        await sleep(t.afterOpen ? 4200 : 2600);
      }

      const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      const pngBase64 = shot.data;

      if (REVIEW) {
        fs.writeFileSync(path.join(reviewDir, `${t.out}.png`), Buffer.from(pngBase64, 'base64'));
        results.push({ out: t.out, ok: true, review: path.join(reviewDir, `${t.out}.png`) });
        continue;
      }

      /* PNG -> WebP through a canvas in the blank page. */
      const webp = await evaluate(`(async () => {
        const img = new Image();
        img.src = 'data:image/png;base64,${pngBase64}';
        await img.decode();
        const c = document.createElement('canvas');
        c.width = ${W}; c.height = ${H};
        const g = c.getContext('2d');
        g.drawImage(img, 0, 0, ${W}, ${H});
        return c.toDataURL('image/webp', 0.86).split(',')[1];
      })()`);

      if (!webp) throw new Error('webp encode failed');
      const file = path.join(OUT_DIR, `${t.out}.webp`);
      fs.writeFileSync(file, Buffer.from(webp, 'base64'));
      results.push({ out: t.out, ok: true, bytes: fs.statSync(file).size });
    } catch (e) {
      results.push({ out: t.out, ok: false, error: e.message });
    }
  }

  console.log(JSON.stringify(results, null, 2));
  const failed = results.filter((r) => !r.ok);
  if (failed.length) {
    console.error(`${failed.length} preview(s) failed`);
    process.exitCode = 1;
  }
  proc.kill();
})();
