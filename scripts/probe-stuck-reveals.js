// Which .rv elements are stuck, and why.
//
// The render audit reports revealStuck and revealInvisibleCount but only the
// count of the latter, and a bare "2" is not an actionable bug report. This
// names each one, says which section it is in, and reports where it is
// relative to the viewport - because the usual cause on a short landscape
// phone is not a broken observer, it is a section head that is simply never
// scrolled through, and the two need completely different fixes.
//
// The suspicion worth testing is always the same: is the element taller than
// the viewport, so it can never satisfy a threshold that requires a
// configurable slice of it to be visible?
const { spawn } = require('child_process');
const fs = require('fs');
const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const URL_ = process.argv[2] || 'http://127.0.0.1:8907/demos/trial/index.html';
const PORT = 9346;
const PROFILE = 'C:\\Users\\aadit\\AppData\\Local\\Temp\\opencode\\chrome-profile-stuck';
const W = +(process.env.VW || 740);
const H = +(process.env.VH || 360);
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
  await sleep(2500);

  // scroll the whole page the way a guest would, then come back
  const info = await ev(ws, `(async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const H = innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += Math.round(H * 0.6)) {
      window.scrollTo(0, y); await sleep(140);
    }
    window.scrollTo(0, document.body.scrollHeight); await sleep(600);
    window.scrollTo(0, 0); await sleep(700);

    const rows = [];
    document.querySelectorAll('.rv').forEach(el => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const sec = el.closest('section,header,footer');
      rows.push({
        cls: el.className,
        section: sec ? (sec.id || sec.tagName.toLowerCase()) : null,
        hasIn: el.classList.contains('in'),
        opacity: cs.opacity,
        transform: cs.transform,
        top: Math.round(r.top + scrollY),
        h: Math.round(r.height),
        text: (el.textContent || '').trim().slice(0, 46)
      });
    });
    return { viewport: [innerWidth, innerHeight], docH: document.body.scrollHeight, rows };
  })()`);

  console.log('viewport %dx%d   document %dpx tall' % (info.viewport[0], info.viewport[1], info.docH));
  const stuck = info.rows.filter(r => !r.hasIn);
  console.log('\n%d of %d .rv elements never got .in\n' % (stuck.length, info.rows.length));
  for (const r of stuck) {
    console.log('  section #%s   class "%s"' % (r.section, r.cls));
    console.log('    opacity %s   transform %s' % (r.opacity, r.transform));
    console.log('    at y %d, height %d (viewport is %d tall)' % (r.top, r.h, info.viewport[1]));
    console.log('    text: %s' % r.text);
    console.log('');
  }
  if (!stuck.length) console.log('  none - every .rv revealed');
  ws.close(); chrome.kill(); await sleep(500);
  process.exit(stuck.length ? 1 : 0);
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
