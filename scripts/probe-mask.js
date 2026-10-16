// Rasterises a crescent mask path and reports its actual thickness profile.
//
// Why: the hero moon's mask is
//     M100,14 A86,86 0 0 1 100,186 A79.98,86 0 0 0 100,14 Z
// and reading that by eye is genuinely ambiguous. The two endpoints,
// (100,14) and (100,186), are diametrically opposite on the r=86 circle, so the
// first arc is exactly the right half. The second arc has rx=79.98 but ry=86,
// and the chord it has to span is 172 long - exactly 2*ry. Both ellipses pass
// through the same two points, so they agree at top and bottom and can differ
// only in the middle, by at most 86-79.98 = 6.02 units. Read one way that is a
// 6-unit crescent; read the other way it is a sliver traced twice over and
// almost nothing is filled.
//
// Pixel sampling says which. This draws the path into a canvas at the same
// scale the page uses and reports, per row, how far the filled region spans.
// A crescent reads as a profile that swells in the middle; a sliver reads as
// one that is near zero throughout.
//
// Usage: node probe-mask.js <url> <selector-of-the-mask-path>
const { spawn } = require('child_process');
const fs = require('fs');
const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const URL_ = process.argv[2];
const SEL = process.argv[3] || '#hMoonMask path';
const PORT = 9345;
const PROFILE = 'C:\\Users\\aadit\\AppData\\Local\\Temp\\opencode\\chrome-profile-mask';
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
    '--window-size=1400,900', '--no-first-run', '--no-default-browser-check', 'about:blank'], { stdio: 'ignore' });
  let target = null;
  for (let i = 0; i < 40 && !target; i++) { await sleep(500);
    try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
          target = l.find(t => t.type === 'page'); } catch (_) {} }
  if (!target) throw new Error('Chrome never came up');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));
  await rpc(ws, 'Runtime.enable'); await rpc(ws, 'Page.enable');
  await rpc(ws, 'Emulation.setDeviceMetricsOverride', { width: 1400, height: 900, deviceScaleFactor: 1, mobile: false });
  await rpc(ws, 'Page.navigate', { url: URL_ });
  await sleep(5000);

  const out = await ev(ws, `(() => {
    const p = document.querySelector(${JSON.stringify(SEL)});
    if (!p) return { found: false };
    const d = p.getAttribute('d');
    const N = 400;                       // 2x the viewBox, so a 6-unit sliver is 12px
    const cv = document.createElement('canvas');
    cv.width = N; cv.height = N;
    const g = cv.getContext('2d');
    g.fillStyle = '#000'; g.fillRect(0, 0, N, N);
    // 200x200 viewBox -> NxN, so scale is N/200 = 2
    g.save();
    g.scale(N / 200, N / 200);
    g.fillStyle = '#fff';
    g.fill(new Path2D(d));
    g.restore();
    const px = g.getImageData(0, 0, N, N).data;
    let area = 0, minX = N, maxX = -1, minY = N, maxY = -1;
    const rows = [];
    for (let y = 0; y < N; y++) {
      let lo = -1, hi = -1, n = 0;
      for (let x = 0; x < N; x++) {
        if (px[(y * N + x) * 4] > 127) { n++; if (lo < 0) lo = x; hi = x; }
      }
      area += n;
      if (n) {
        minX = Math.min(minX, lo); maxX = Math.max(maxX, hi);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        rows.push([y, lo, hi, n]);
      }
    }
    // widest row, and the width profile at 10 evenly spaced filled rows
    let widest = rows[0];
    for (const r of rows) if ((r[2] - r[1]) > (widest[2] - widest[1])) widest = r;
    const sample = [];
    for (let i = 0; i < 11; i++) {
      const r = rows[Math.min(rows.length - 1, Math.floor(i * (rows.length - 1) / 10))];
      sample.push({ y: r[0], xFrom: r[1], xTo: r[2], span: r[2] - r[1] + 1, filled: r[3] });
    }
    // a full disc of r=86 in this space would be pi*172^2 = 92,948 px
    const discArea = Math.PI * 172 * 172;
    return {
      found: true, d: d, raster: N,
      areaPx: area,
      pctOfDisc: +(100 * area / discArea).toFixed(1),
      bbox: { minX, maxX, minY, maxY, w: maxX - minX + 1, h: maxY - minY + 1 },
      widestRow: { y: widest[0], span: widest[2] - widest[1] + 1, filled: widest[3] },
      profile: sample
    };
  })()`);
  console.log(URL_);
  console.log(JSON.stringify(out, null, 2));
  ws.close(); chrome.kill(); await sleep(500);
  process.exit(0);
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
