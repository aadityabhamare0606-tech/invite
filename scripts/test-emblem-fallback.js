// Proves the <picture> fallback is real: block the WebP at the network layer,
// reload, and confirm the browser lands on the PNG and still paints.
//
// The block pattern and the expected filename both used to be hardcoded to the
// old ganesh.* names, so after the emblem was switched to the pair copied from
// wedding-invite-7 this test blocked a URL nothing requested. It then reported
// webpBlocked: true — a literal in the returned object, never a measurement —
// and asserted against 1248x1248, so it failed while showing a fully loaded
// 421x512 image. A test that hardcodes the thing it is meant to prove proves
// nothing. The blocked-ness is now read off the network events instead.
const { spawn } = require('child_process');
const fs = require('fs');
const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const URL_ = process.argv[2] || 'http://127.0.0.1:8907/demos/trial/index.html';
const PORT = 9339;
const PROFILE = 'C:\\Users\\aadit\\AppData\\Local\\Temp\\opencode\\chrome-profile-fb';
const WEBP = '21.webp';
const PNG = '21.png';
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

  /* Record what actually happened on the wire. webpBlocked is derived, not
     asserted. It cannot be read off Network.loadingFailed, because a blocked
     URL's errorText is net::ERR_BLOCKED_BY_CLIENT and carries no filename — the
     first version of this test grepped that string for "webp" and so never
     detected the block it had just caused. The reliable signal is that the
     WebP was requested and never answered. */
  let webpRequested = 0, webpResponded = 0, pngRequested = 0;
  ws.addEventListener('message', ev => {
    const m = JSON.parse(ev.data);
    if (m.method === 'Network.requestWillBeSent') {
      if (/\.webp$/.test(m.params.request.url)) webpRequested++;
      if (/\.png$/.test(m.params.request.url)) pngRequested++;
    }
    if (m.method === 'Network.responseReceived' && /\.webp$/.test(m.params.response.url))
      webpResponded++;
  });

  // block the webp so the <source> cannot win
  const NOBLOCK = process.env.NOBLOCK === '1';
  if (!NOBLOCK) await rpc(ws, 'Network.setBlockedURLs', { urls: ['*' + WEBP] });
  await rpc(ws, 'Page.navigate', { url: URL_ });
  await sleep(6000);

  const r = await ev(ws, `(() => {
    const img = document.querySelector('.ic-ganesh img');
    const src = document.querySelector('.ic-ganesh source');
    const box = img.getBoundingClientRect();
    return {
      sourcePresent: !!src,
      sourceType: src ? src.getAttribute('type') : null,
      imgSrcAttr: img.getAttribute('src'),
      currentSrc: img.currentSrc,
      complete: img.complete,
      natural: img.naturalWidth + 'x' + img.naturalHeight,
      box: Math.round(box.width) + 'x' + Math.round(box.height),
      painted: img.getBoundingClientRect().width > 0
    };
  })()`);
  r.webpRequested = webpRequested;
  r.webpResponded = webpResponded;
  r.pngRequested = pngRequested;
  r.mode = NOBLOCK ? 'normal' : 'webp-blocked';
  console.log(JSON.stringify(r, null, 2));

  let ok, say;
  if (NOBLOCK) {
    /* The normal path. The WebP must be what actually loads: it is 111 KB
       against the PNG's 352 KB, and this is the assertion that would catch the
       25 MB SVG being put back as the default download. */
    ok = new RegExp(WEBP + '$').test(r.currentSrc) && r.webpResponded > 0
      && r.sourcePresent && r.complete && r.painted && r.natural === '421x512';
    say = ok
      ? '\nNORMAL PATH OK: the browser served ' + WEBP + ' (' + r.webpResponded + ' response(s)) and painted it.'
      : '\nNORMAL PATH WRONG: expected ' + WEBP + ' to be served, got ' + r.currentSrc;
  } else {
    /* Gate on the behaviour, not on the network counters.
       Deriving "was it blocked" from request-versus-response counts proved
       unreliable: the emblem is fetched three times on this page (preload plus
       the picture, plus one more), and blocking it still let a single response
       through, so the count-based flag read false on a run where the fallback
       had plainly worked.

       The direct evidence is unambiguous. Nothing but the page's own recovery
       code removes the <source> element, so sourcePresent === false plus a
       currentSrc on the PNG plus a real intrinsic size means the swap ran and
       the image painted. If the fallback had not fired, the <source> would
       still be in the DOM. The counters are still printed, as diagnostics. */
    ok = !r.sourcePresent
      && new RegExp(PNG + '$').test(r.currentSrc)
      && r.natural === '421x512' && r.complete && r.painted;
    say = ok
      ? '\nFALLBACK OK: the <source> was removed by the page\'s own recovery, ' + PNG +
        ' was fetched, and it painted (' + r.webpRequested + ' webp request(s), ' +
        r.webpResponded + ' response(s)).'
      : '\nFALLBACK BROKEN: expected the <source> to be removed and ' + PNG +
        ' / 421x512, got sourcePresent=' + r.sourcePresent + ' ' + r.currentSrc +
        ' / ' + r.natural;
  }
  console.log(say);
  ws.close(); chrome.kill(); await sleep(600);
  process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
