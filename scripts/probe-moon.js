// Measures the hero moon, screenshots the hero, and writes the box coordinates so
// sample-moon.py can decide whether the crescent is actually painted.
//
// This exists because of a specific and otherwise-undetectable failure. The
// moon's eight colours were moved out of stop-color attributes and into :root,
// applied as stop-color in CSS. That is the right thing to do for the design
// system - a stop-color attribute is a hex literal wearing a hat - but it
// introduces a way for the moon to fail that nothing else on the page can fail
// in: if a stop-color rule does not apply, the stop falls back to its initial
// value, black. A black crescent on a #0C091B-to-#15102B sky is not a broken
// image. It decodes, it occupies a correct box, it reports no console error,
// and it is invisible. The car could not do this. Neither could the emblem.
//
// So the moon needs its own proof, and the proof has to be a pixel one.
//
// This script only reports geometry and the resolved computed styles. The
// verdict is sample-moon.py's, because deciding "is that a moon" from numbers
// is the same job sample-car.py already does properly.
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const URL_ = process.argv[2] || 'http://127.0.0.1:8907/demos/trial/index.html';
const OUT = process.env.SHOT || 'C:\\Users\\aadit\\AppData\\Local\\Temp\\opencode\\shots\\hero-moon.png';
const META = OUT.replace(/\.png$/, '.box.json');
const PORT = 9344;
const PROFILE = 'C:\\Users\\aadit\\AppData\\Local\\Temp\\opencode\\chrome-profile-moon';
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
  await ev(ws, `window.scrollTo(0, 0); true`);
  await sleep(2500);

  const box = await ev(ws, `(() => {
    const m = document.querySelector('.hero-moon');
    if (!m) return { present: false };
    const svg = m.querySelector('svg');
    const r = m.getBoundingClientRect();
    const cs = getComputedStyle(m);
    const stops = [...m.querySelectorAll('stop')].map(s => {
      const g = getComputedStyle(s);
      return { offset: s.getAttribute('offset'), stopColor: g.stopColor };
    });
    const lit = m.querySelector('circle[mask]');
    const dark = m.querySelector('circle:not([mask])[fill^="url"]');
    return {
      present: true,
      viewport: [innerWidth, innerHeight],
      scrollY: Math.round(scrollY),
      box: { left: Math.round(r.left), top: Math.round(r.top),
             w: Math.round(r.width), h: Math.round(r.height) },
      opacity: cs.opacity,
      zIndex: cs.zIndex,
      display: cs.display,
      visibility: cs.visibility,
      filter: getComputedStyle(svg).filter,
      /* the whole point: are the token values actually reaching the stops? */
      stops: stops,
      /* the mask is what makes it a crescent rather than a disc. If the mask
         failed, the lit circle would cover the earthshine circle and the moon
         would render as a full gold disc - still "painted", still a moon-shaped
         box, but a different moon. getBBox on the mask path proves the mask
         exists and is non-degenerate. */
      maskPathLength: (() => {
        const p = m.querySelector('#hMoonMask path');
        if (!p) return null;
        return Math.round(p.getTotalLength());
      })(),
      litFill: lit ? lit.getAttribute('fill') : null,
      litMask: lit ? lit.getAttribute('mask') : null,
      darkFill: dark ? dark.getAttribute('fill') : null,
      cratersFill: (() => { const g = m.querySelector('.craters');
        return g ? getComputedStyle(g).fill : null; })(),
      rimStroke: (() => { const c = m.querySelector('.rim');
        return c ? getComputedStyle(c).stroke : null; })()
    };
  })()`);
  if (!box.present) { console.log(JSON.stringify(box, null, 2)); throw new Error('no .hero-moon in the DOM'); }

  const shot = await rpc(ws, 'Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(OUT, Buffer.from(shot.data, 'base64'));
  fs.writeFileSync(META, JSON.stringify(box, null, 2));
  console.log(JSON.stringify(box, null, 2));
  console.log('\nwrote ' + OUT + '  and ' + META);
  ws.close(); chrome.kill(); await sleep(600);
  process.exit(0);
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
