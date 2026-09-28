// Reports the browser's own view of an image's intrinsic size, next to what the
// file header says. These can disagree: a WebP written as a 1-frame animation,
// or carrying a density hint, makes naturalWidth something other than the
// pixel width in the file, and then the browser upscales on a 3x screen while
// the file on disk looks fine.
const { spawn } = require('child_process');
const fs = require('fs');
const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9347;
const PROFILE = 'C:\\Users\\aadit\\AppData\\Local\\Temp\\opencode\\chrome-profile-intr';
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
    '--remote-debugging-port=' + PORT, '--user-data-dir=' + PROFILE,
    '--window-size=800,600', '--force-device-scale-factor=1',
    '--no-first-run', '--no-default-browser-check', 'about:blank'], { stdio: 'ignore' });
  let target = null;
  for (let i = 0; i < 40 && !target; i++) { await sleep(500);
    try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
          target = l.find(t => t.type === 'page'); } catch (_) {} }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));
  await rpc(ws, 'Runtime.enable'); await rpc(ws, 'Page.enable');

  // a blank page on the same origin, so relative srcs resolve against the server
  await rpc(ws, 'Page.navigate', { url: 'http://127.0.0.1:8907/demos/trial/' });
  await sleep(2000);

  const files = process.argv.slice(2);
  if (!files.length) { console.error('usage: node probe-intrinsic.js <src> [src...]'); process.exit(2); }
  const r = await ev(ws, `(async () => {
    const out = [];
    for (const src of ${JSON.stringify(files)}) {
      const img = new Image();
      img.src = src;
      try { await img.decode(); } catch (e) { out.push({ src, error: String(e) }); continue; }
      out.push({
        src,
        natural: img.naturalWidth + 'x' + img.naturalHeight,
        /* the effective density the browser is applying. 96 means 1 CSS px per
           image px. Anything else means naturalWidth has been rescaled and the
           effective resolution differs from the file's. */
        densityGuess: null,
        renderedAt100: (() => { img.style.width = '100px'; document.body.appendChild(img);
                                 const q = img.getBoundingClientRect();
                                 const h = q.height; img.remove(); return Math.round(q.width * 10) / 10 + 'x' + Math.round(h * 10) / 10; })()
      });
    }
    return out;
  })()`);
  console.log(JSON.stringify(r, null, 2));
  ws.close(); chrome.kill(); await sleep(600);
  process.exit(0);
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
