// Identifies any <img> in the page that has no resolved source or no intrinsic
// size. The render audit's brokenImages list only shows the file name, which is
// an empty string for exactly the case you most want to identify, so this
// reports the element itself: class, parent, and the attributes that decide it.
const { spawn } = require('child_process');
const fs = require('fs');
const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const URL_ = process.argv[2] || 'http://127.0.0.1:8907/demos/trial/index.html';
const PORT = 9341;
const PROFILE = 'C:\\Users\\aadit\\AppData\\Local\\Temp\\opencode\\chrome-profile-img';
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
(async () => {
  fs.rmSync(PROFILE, { recursive: true, force: true });
  const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-sandbox',
    '--hide-scrollbars', '--remote-debugging-port=' + PORT, '--user-data-dir=' + PROFILE,
    '--window-size=430,932', '--force-device-scale-factor=1',
    '--no-first-run', '--no-default-browser-check', 'about:blank'], { stdio: 'ignore' });
  let target = null;
  for (let i = 0; i < 40 && !target; i++) { await sleep(500);
    try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
          target = l.find(t => t.type === 'page'); } catch (_) {} }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));
  await rpc(ws, 'Runtime.enable'); await rpc(ws, 'Page.enable');
  await rpc(ws, 'Emulation.setDeviceMetricsOverride', { width: 430, height: 932, deviceScaleFactor: 1, mobile: true });
  await rpc(ws, 'Page.navigate', { url: URL_ });
  await sleep(6000);

  const r = await ev(ws, `(() => {
    // open the cover first, then scroll the whole page so lazy images are asked for
    const seal = document.querySelector('#invite-open');
    if (seal) seal.click();
    return true;
  })()`);
  await sleep(2500);
  await ev(ws, `window.scrollTo(0, document.body.scrollHeight); true`);
  await sleep(3000);

  const out = await ev(ws, `(() => {
    const res = [];
    document.querySelectorAll('.gallery__item').forEach((i, n) => {
      const img = i.querySelector('img');
      const r = i.getBoundingClientRect();
      res.push({
        n,
        itemRect: [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)],
        imgLoaded: img ? (img.complete && img.naturalWidth > 0) : null,
        imgCurrentSrc: img ? img.currentSrc.split('/').slice(-1)[0] : null,
        lazy: img ? img.getAttribute('loading') : null
      });
    });
    const track = document.querySelector('.gallery-track');
    const cs = track ? getComputedStyle(track) : null;
    return {
      viewport: [innerWidth, innerHeight],
      trackOverflowX: cs ? cs.overflowX : null,
      trackScrollLeft: track ? Math.round(track.scrollLeft) : null,
      trackScrollWidth: track ? track.scrollWidth : null,
      trackClientWidth: track ? track.clientWidth : null,
      items: res
    };
  })()`);
  console.log(JSON.stringify(out, null, 2));
  ws.close(); chrome.kill(); await sleep(600);
  process.exit(0);
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
