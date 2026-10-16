// Ask the page what actually paints at a given viewport point, rather than
// inferring it from a screenshot.
//
// A screenshot says "there is warm gold at (215,574)". It does not say which
// layer put it there, and on this hero the candidates are many: a five-stop
// gradient, a radial glow field, a 24px moon, two hill ridges, a car
// photograph, twenty drifting hearts, and four different text-shadows. Each
// was ruled out by a control run in turn - hiding the car changed nothing,
// hiding the hearts changed nothing - and both controls cost a full sweep.
// document.elementsFromPoint answers it in one shot.
//
// It returns the whole hit-test stack, innermost first, so the list is the
// layer order rather than a single guess: the first entry that actually paints
// an opaque-enough pixel is the one that put the colour there. Elements that
// only overlap geometrically (pointer-events:none decoration) still appear,
// which is the point - they are exactly the ones a hit test would otherwise
// skip and which are the ones doing the damage.
//
// Usage: node probe-what-paints.js <x,y> [x,y ...]
//   VW, VH   viewport, default 430x932
//   WAIT     ms after the cover opens, default 6000
const { spawn } = require('child_process');
const path = require('path');
const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const URL_ = process.env.URL || 'http://127.0.0.1:8907/demos/trial/index.html';
const POINTS = process.argv.slice(2).filter(a => /^\d+,\d+$/.test(a));
const PORT = 9353;
const PROFILE = 'C:\\Users\\aadit\\AppData\\Local\\Temp\\opencode\\chrome-profile-whatpaints';
const W = +(process.env.VW || 430);
const H = +(process.env.VH || 932);
const WAIT = +(process.env.WAIT || 6000);
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
const POINTS_JS = JSON.stringify(POINTS.map(p => p.split(',').map(Number)));

(async () => {
  if (!POINTS.length) throw new Error('give at least one x,y point');
  fs_rm();
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
  await sleep(WAIT);

  const out = await ev(ws, `(() => {
    const pts = ${POINTS_JS};
    // elementsFromPoint alone is not enough here, and that is the whole point
    // of this tool. It honours pointer-events, so every decorative layer on
    // this hero - the car, the hills, the glow field - is absent from the
    // answer, and those are the layers that actually put colour under the type.
    // So the hit-test stack is unioned with a rect-containment scan of the
    // hero's own subtree, which catches pointer-events:none and returns them
    // in DOM order. Duplicates are collapsed, hit-tested entries first, since
    // those are the ones a reader would naturally blame.
    const hero = document.getElementById('hero');
    const inRect = [];
    hero.querySelectorAll('*').forEach(el => {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      const r = el.getBoundingClientRect();
      if (r.width < 0.5 || r.height < 0.5) return;
      inRect.push(el);
    });
    const describe = el => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        sel: el.tagName.toLowerCase()
           + (el.id ? '#' + el.id : '')
           + (el.className && el.className.baseVal !== undefined
              ? '.' + (el.className.baseVal || '(svg)').trim().split(/\\s+/).join('.')
              : (typeof el.className === 'string' && el.className.trim()
                 ? '.' + el.className.trim().split(/\\s+/).slice(0, 3).join('.') : '')),
        color: cs.color,
        background: cs.backgroundColor,
        backgroundImage: cs.backgroundImage === 'none' ? null : cs.backgroundImage.slice(0, 90),
        opacity: cs.opacity,
        filter: cs.filter === 'none' ? null : cs.filter,
        textShadow: cs.textShadow === 'none' ? null : cs.textShadow,
        pointerEvents: cs.pointerEvents,
        // a layer that draws something at all, as opposed to being a bare
        // wrapper: only these can be the reason a pixel is the colour it is
        paints: cs.visibility !== 'hidden' && cs.display !== 'none'
          && !/rgba\\(0, 0, 0, 0\\)|transparent/.test(cs.backgroundColor)
          || cs.backgroundImage !== 'none'
          || cs.textShadow !== 'none'
          || (el.tagName === 'IMG' || el.tagName === 'svg'),
        box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)],
        src: el.currentSrc ? el.currentSrc.split('/').pop() : null
      };
    };
    return pts.map(([x, y]) => {
      const hit = document.elementsFromPoint(x, y);
      const scan = inRect.filter(el => {
        const r = el.getBoundingClientRect();
        return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
      });
      const seen = new Set();
      const stack = [];
      for (const el of hit.concat(scan)) {
        if (seen.has(el)) continue;
        seen.add(el);
        stack.push(describe(el));
      }
      return { x, y, stack };
    });
  })()`);

  // written with fs rather than printed: this shell mangles multi-line console
  // output into runs of "NaN", and a layer stack is exactly the kind of output
  // where one mangled line costs the whole diagnosis
  const OUT = 'C:\\Users\\aadit\\AppData\\Local\\Temp\\opencode\\shots\\what-paints.json';
  require('fs').writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log('wrote %s  %d point(s), %d layer(s) at the first'
              % (OUT, out.length, out[0] ? out[0].stack.length : 0));
  ws.close(); chrome.kill(); await sleep(600);
  process.exit(0);
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });

function fs_rm() {
  try { require('fs').rmSync(PROFILE, { recursive: true, force: true }); } catch (_) {}
}
