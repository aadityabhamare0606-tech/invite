// Measures, on the rendered page, whether any actual hero GLYPH touches the
// car art. The wrapper-based check in probe-trial-light.js includes the
// HeroTitle wrapper's 150px bottom padding, which is empty space - it can
// overlap the car without a single letter touching it, and over-reporting
// that as a collision is exactly the kind of false alarm this exists to stop.
const { spawn } = require('child_process');
const os = require('os');
const path = require('path');

const VW = +(process.env.VW || 1440);
const VH = +(process.env.VH || 900);
const port = 9400 + (process.pid % 400);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const proc = spawn(chrome, [
  '--headless=new', `--remote-debugging-port=${port}`, `--window-size=${VW},${VH}`,
  '--disable-gpu', '--no-first-run', '--hide-scrollbars',
  '--user-data-dir=' + path.join(os.tmpdir(), `hero-glyph-${process.pid}`), 'about:blank',
], { stdio: 'ignore' });

(async () => {
  let wsUrl = null;
  for (let i = 0; i < 60 && !wsUrl; i++) {
    await sleep(250);
    try {
      const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const t = tabs.find((x) => x.type === 'page');
      if (t) wsUrl = t.webSocketDebuggerUrl;
    } catch { /* not up yet */ }
  }
  if (!wsUrl) { proc.kill(); process.exit(1); }
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => { ws.addEventListener('open', res, { once: true }); ws.addEventListener('error', rej, { once: true }); });
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(JSON.stringify(m.error))) : p.resolve(m.result); }
  });
  const send = (method, params) => new Promise((resolve, reject) => {
    const myId = ++id; pending.set(myId, { resolve, reject }); ws.send(JSON.stringify({ id: myId, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: VW, height: VH, deviceScaleFactor: 1, mobile: VW < 700 });
  await send('Page.navigate', { url: `http://127.0.0.1:${process.env.PORT || 8907}/demos/trial/index.html` });
  await sleep(5000);

  const r = await send('Runtime.evaluate', {
    expression: `(() => {
      const names = [...document.querySelectorAll('.hero-title-step')];
      const last = names[names.length - 1].getBoundingClientRect();
      const first = names[0].getBoundingClientRect();
      const car = document.querySelector('img[src*="56.png"]').closest('div.absolute').getBoundingClientRect();
      const hero = document.querySelector('.hero-floating-heart')
        ? null : null;
      // actual glyph boxes, not the padded wrapper
      const all = names.map(n => { const r = n.getBoundingClientRect(); return { text: n.textContent.trim(), top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height) }; });
      return {
        lines: all,
        carTop: Math.round(car.top), carBottom: Math.round(car.bottom), carW: Math.round(car.width),
        glyphOverlapWithCar: Math.round(last.bottom - car.top),  // >0 means glyphs over the art
        topOfFirstLine: Math.round(first.top),
        heroHeight: Math.round(document.querySelector('div[class*="md:h-[1280px]"]')?.getBoundingClientRect().height || 0),
      };
    })()`, returnByValue: true,
  });
  console.log(JSON.stringify(r.result.value, null, 2));
  ws.close(); proc.kill(); process.exit(0);
})().catch((e) => { console.error(e.message); proc.kill(); process.exit(1); });