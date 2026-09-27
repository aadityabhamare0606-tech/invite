// Proves the <picture> fallback is real: block the WebP at the network layer,
// reload, and confirm the browser lands on ganesh.svg and still paints.
const { spawn } = require('child_process');
const fs = require('fs');
const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const URL_ = process.argv[2] || 'http://127.0.0.1:8907/demos/trial/index.html';
const PORT = 9339;
const PROFILE = 'C:\\Users\\aadit\\AppData\\Local\\Temp\\opencode\\chrome-profile-fb';
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
  await rpc(ws, 'Runtime.enable'); await rpc(ws, 'Page.enable'); await rpc(ws, 'Network.enable');
  await rpc(ws, 'Emulation.setDeviceMetricsOverride', { width: 430, height: 932, deviceScaleFactor: 1, mobile: true });

  // block the webp so the <source> cannot win
  await rpc(ws, 'Network.setBlockedURLs', { urls: ['*ganesh.webp*'] });
  await rpc(ws, 'Page.navigate', { url: URL_ });
  await sleep(6000);

  const r = await ev(ws, `(() => {
    const img = document.querySelector('.ic-ganesh img');
    const src = document.querySelector('.ic-ganesh source');
    const box = img.getBoundingClientRect();
    return {
      webpBlocked: true,
      sourceType: src ? src.getAttribute('type') : null,
      imgSrcAttr: img.getAttribute('src'),
      currentSrc: img.currentSrc,
      complete: img.complete,
      natural: img.naturalWidth + 'x' + img.naturalHeight,
      box: Math.round(box.width) + 'x' + Math.round(box.height),
      painted: img.getBoundingClientRect().width > 0
    };
  })()`);
  console.log(JSON.stringify(r, null, 2));
  const okFallback = /ganesh\.svg$/.test(r.currentSrc) && r.natural === '1248x1248' && r.painted;
  console.log(okFallback
    ? '\nFALLBACK OK: with the WebP blocked the browser loaded ganesh.svg and painted it.'
    : '\nFALLBACK BROKEN: expected ganesh.svg / 1248x1248, got ' + r.currentSrc + ' / ' + r.natural);
  ws.close(); chrome.kill(); await sleep(600);
  process.exit(okFallback ? 0 : 1);
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
