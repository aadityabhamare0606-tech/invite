// Walks up from a selector and reports every ancestor's display, so a
// "display:none" verdict can be traced to the rule that caused it.
// Usage: node probe-hidden.js "<selector>" [selector...]
const { spawn } = require('child_process');
const fs = require('fs');
const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const URL_ = process.argv[2];
const SELS = process.argv.slice(3);
const PORT = 9349;
const PROFILE = 'C:\\Users\\aadit\\AppData\\Local\\Temp\\opencode\\chrome-profile-hidden';
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
  await sleep(5500);

  const closed = ev(ws, `(() => { const s = document.querySelector('#invite-open'); if (s) s.click(); return true; })()`);
  const before = await ev(ws, `(async () => {
    const out = [];
    for (const sel of ${JSON.stringify(SELS)}) {
      const e = document.querySelector(sel);
      if (!e) { out.push({ sel, missing: true }); continue; }
      const chain = [];
      for (let p = e; p && p !== document.documentElement; p = p.parentElement) {
        const cs = getComputedStyle(p);
        chain.push({
          el: p.tagName.toLowerCase() + (p.id ? '#' + p.id : '') +
              (typeof p.className === 'string' && p.className ? '.' + p.className.trim().split(/\\s+/).join('.') : ''),
          display: cs.display, visibility: cs.visibility, opacity: cs.opacity
        });
        if (p === document.body) break;
      }
      const r = e.getBoundingClientRect();
      out.push({ sel, chain, rect: [r.width, r.height].map(Math.round) });
    }
    return out;
  })()`);
  await closed;
  await sleep(3000);
  const after = await ev(ws, `(async () => {
    const out = [];
    for (const sel of ${JSON.stringify(SELS)}) {
      const e = document.querySelector(sel);
      if (!e) { out.push({ sel, missing: true }); continue; }
      const chain = [];
      for (let p = e; p && p !== document.documentElement; p = p.parentElement) {
        const cs = getComputedStyle(p);
        chain.push({
          el: p.tagName.toLowerCase() + (p.id ? '#' + p.id : '') +
              (typeof p.className === 'string' && p.className ? '.' + p.className.trim().split(/\\s+/).join('.') : ''),
          display: cs.display, visibility: cs.visibility, opacity: cs.opacity
        });
        if (p === document.body) break;
      }
      const r = e.getBoundingClientRect();
      out.push({ sel, chain, rect: [r.width, r.height].map(Math.round) });
    }
    return out;
  })()`);

  console.log('=== BEFORE the seal is pressed ===');
  console.log(JSON.stringify(before, null, 2));
  console.log('\n=== AFTER the cover is opened ===');
  console.log(JSON.stringify(after, null, 2));
  ws.close(); chrome.kill(); await sleep(600);
  process.exit(0);
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
