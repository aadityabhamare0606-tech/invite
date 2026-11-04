// Screenshot a demo at a given scroll position.
// Usage: node scripts/shoot-demo.js <demoPath> <outName> [scrollY] [width] [height]
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const demo = process.argv[2] || '/demos/demo-1/index.html';
const outName = process.argv[3] || 'demo';
const scrollY = +(process.argv[4] || 0);
const VW = +(process.argv[5] || 900);
const VH = +(process.argv[6] || 1200);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const SHOT_DIR = path.join(os.tmpdir(), 'opencode', 'shots');
fs.mkdirSync(SHOT_DIR, { recursive: true });

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
  if (!chrome) { console.error('no chrome'); process.exit(1); }
  const port = 9700 + (process.pid % 200);
  const proc = spawn(chrome, [
    '--headless=new', `--remote-debugging-port=${port}`,
    `--window-size=${VW},${VH}`, '--disable-gpu', '--no-first-run',
    '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required',
    '--user-data-dir=' + path.join(os.tmpdir(), `shoot-${process.pid}`),
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
  await send('Page.navigate', { url: `http://localhost:3000${demo}` });
  await sleep(4500);
  if (scrollY) {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${scrollY})` });
    await sleep(1800);
  }
  const s = await send('Page.captureScreenshot', { format: 'png' });
  const out = path.join(SHOT_DIR, `${outName}.png`);
  fs.writeFileSync(out, Buffer.from(s.data, 'base64'));
  console.log(out);
  proc.kill();
})();
