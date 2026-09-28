// Measures the hero car, screenshots the hero, and writes the box coordinates so
// sample-car.py can decide whether pixels were actually painted.
//
// The emblem probe could answer "is artwork painted" against a flat known
// ground, because the cover is one colour. The car cannot: it sits on the
// photographic hero ground at 30% opacity with a warm glow behind it, and the
// car itself is dark. So the decision has to be made against the pixels
// immediately around the box, not against a constant. This script only reports
// geometry; the verdict is sample-car.py's.
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const URL_ = process.argv[2] || 'http://127.0.0.1:8907/demos/trial/index.html';
const OUT = process.env.SHOT || 'C:\\Users\\aadit\\AppData\\Local\\Temp\\opencode\\shots\\hero-car.png';
const META = OUT.replace(/\.png$/, '.box.json');
const PORT = 9343;
const PROFILE = 'C:\\Users\\aadit\\AppData\\Local\\Temp\\opencode\\chrome-profile-car';
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
(async () => {
  fs.rmSync(PROFILE, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
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
  await sleep(3000);
  /* back to the very top: the hero is the first section under the cover */
  await ev(ws, `window.scrollTo(0, 0); true`);
  await sleep(3000);   /* let the car finish its 1.9s arrival */

  const box = await ev(ws, `(() => {
    const c = document.querySelector('.hero-car');
    const img = c ? c.querySelector('img') : null;
    if (!c) return { present: false };
    const r = c.getBoundingClientRect();
    const cs = getComputedStyle(c);
    const host = getComputedStyle(document.getElementById('hero'));
    return {
      present: true,
      present2: true,
      viewport: [innerWidth, innerHeight],
      scrollY: Math.round(scrollY),
      box: { left: Math.round(r.left), top: Math.round(r.top),
             w: Math.round(r.width), h: Math.round(r.height) },
      opacity: cs.opacity,
      zIndex: cs.zIndex,
      imgOk: img ? (img.complete && img.naturalWidth > 0) : null,
      /* naturalWidth on an image chosen by a srcset width descriptor is
         density-corrected, not the file's pixel width: sizes="70vw" on a 430px
         phone resolves to 301px, and a 900w candidate then reports
         naturalWidth 301, i.e. 900/3. That is ~3x density - correct for a 3x
         screen, not an upscale. Reading it next to the file's 900px width makes
         it look like the image came back small, so the effective density is
         reported here rather than leaving the two numbers to be compared. */
      imgNatural: img ? img.naturalWidth + 'x' + img.naturalHeight : null,
      imgSrcset: img ? img.getAttribute('srcset') : null,
      imgSizes: img ? img.getAttribute('sizes') : null,
      imgChosen: img ? img.currentSrc.split('/').slice(-1)[0] : null,
      imgRect: img ? (() => { const q = img.getBoundingClientRect();
        return { left: Math.round(q.left), top: Math.round(q.top),
                 w: Math.round(q.width), h: Math.round(q.height) }; })() : null,
      heroBg: host.backgroundColor
    };
  })()`);
  if (!box.present) { console.log(JSON.stringify(box, null, 2)); throw new Error('no .hero-car in the DOM'); }
  /* the top slice of the hero is the darkest, least busy part of the frame and
     is what the car has to be distinguishable from */
  const shot = await rpc(ws, 'Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(OUT, Buffer.from(shot.data, 'base64'));
  fs.writeFileSync(META, JSON.stringify(box, null, 2));
  console.log(JSON.stringify(box, null, 2));
  console.log('\nwrote ' + OUT + '  and ' + META);
  ws.close(); chrome.kill(); await sleep(600);
  process.exit(0);
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
