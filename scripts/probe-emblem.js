// Focused probe: is the Ganesha actually painted, and if not, why.
// Answers with numbers, not a screenshot I cannot look at.
//
//   node probe-ganesh.js <url> <w> <h> <outPng>
const { spawn } = require('child_process');
const fs = require('fs');

const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const URL_ = process.argv[2] || 'http://127.0.0.1:8907/demos/trial/index.html';
const W = +(process.argv[3] || 430);
const H = +(process.argv[4] || 932);
const OUT = process.argv[5] || 'C:\\Users\\aadit\\AppData\\Local\\Temp\\opencode\\shots\\ganesh.png';
const PORT = 9337;
const PROFILE = 'C:\\Users\\aadit\\AppData\\Local\\Temp\\opencode\\chrome-profile-ganesh';
const sleep = ms => new Promise(r => setTimeout(r, ms));

let id = 0;
function rpc(ws, method, params) {
  return new Promise((resolve, reject) => {
    const mid = ++id;
    const onMsg = ev => {
      const m = JSON.parse(ev.data);
      if (m.id === mid) {
        ws.removeEventListener('message', onMsg);
        m.error ? reject(new Error(method + ': ' + JSON.stringify(m.error))) : resolve(m.result);
      }
    };
    ws.addEventListener('message', onMsg);
    ws.send(JSON.stringify({ id: mid, method, params: params || {} }));
    setTimeout(() => reject(new Error(method + ': timeout')), 30000);
  });
}
async function evaluate(ws, expression) {
  const r = await rpc(ws, 'Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error('page threw: ' + JSON.stringify(r.exceptionDetails));
  return r.result.value;
}

(async () => {
  fs.rmSync(PROFILE, { recursive: true, force: true });
  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--remote-debugging-port=' + PORT, '--user-data-dir=' + PROFILE,
    '--window-size=' + W + ',' + H, '--force-device-scale-factor=1',
    '--no-first-run', '--no-default-browser-check', 'about:blank'
  ], { stdio: 'ignore' });

  let target = null;
  for (let i = 0; i < 40 && !target; i++) {
    await sleep(500);
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      target = list.find(t => t.type === 'page');
    } catch (_) {}
  }
  if (!target) { console.error('Chrome never came up'); chrome.kill(); process.exit(1); }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  await rpc(ws, 'Runtime.enable');
  await rpc(ws, 'Page.enable');
  await rpc(ws, 'Emulation.setDeviceMetricsOverride', {
    width: W, height: H, deviceScaleFactor: 1, mobile: W < 600
  });

  const console_ = [];
  ws.addEventListener('message', ev => {
    const m = JSON.parse(ev.data);
    if (m.method === 'Runtime.consoleAPICalled' && /error|warn/.test(m.params.type)) {
      console_.push(m.params.type + ': ' + m.params.args.map(a => a.value || a.description).join(' '));
    }
    if (m.method === 'Runtime.exceptionThrown') {
      console_.push('EXCEPTION: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
    }
    if (m.method === 'Network.loadingFailed') {
      console_.push('NETFAIL: ' + m.params.errorText + ' ' + (m.params.type || ''));
    }
  });
  await rpc(ws, 'Network.enable');

  await rpc(ws, 'Page.navigate', { url: URL_ });
  await sleep(5000);   // well past the 240ms loaded + 1.6s ganesh entrance

  const info = await evaluate(ws, `(() => {
    const img = document.querySelector('.ic-ganesh img');
    if (!img) return { fatal: 'no .ic-ganesh img in the DOM' };
    const fig = img.closest('.ic-ganesh');
    const r   = img.getBoundingClientRect();
    const cx  = Math.round(r.left + r.width / 2);
    const cy  = Math.round(r.top + r.height / 2);

    // what is actually on top at the centre of the image?
    const hit = document.elementFromPoint(cx, cy);
    const chain = [];
    for (let e = hit; e && chain.length < 6; e = e.parentElement) {
      const cs = getComputedStyle(e);
      chain.push({
        el: e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') +
            (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\\s+/).join('.') : ''),
        opacity: cs.opacity, visibility: cs.visibility, display: cs.display,
        zIndex: cs.zIndex, position: cs.position,
        bg: cs.backgroundColor
      });
    }

    const csImg = getComputedStyle(img), csFig = getComputedStyle(fig);

    // effective opacity = product up to the cover
    let eff = 1, n = img;
    while (n && n.id !== 'invite-cover') { eff *= +getComputedStyle(n).opacity; n = n.parentElement; }
    const coverOpacity = +getComputedStyle(document.getElementById('invite-cover')).opacity;

    return {
      src: img.getAttribute('src'),
      currentSrc: img.currentSrc,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)],
      centre: [cx, cy],
      imgOpacity: csImg.opacity,
      imgTransform: csImg.transform,
      imgFilter: csImg.filter,
      imgVisibility: csImg.visibility,
      imgDisplay: csImg.display,
      figOpacity: csFig.opacity,
      figTransform: csFig.transform,
      bodyHasLoaded: document.body.classList.contains('loaded'),
      bodyClass: document.body.className,
      coverOpacity,
      coverVisibility: getComputedStyle(document.getElementById('invite-cover')).visibility,
      effectiveOpacity: eff,
      imgAnimations: img.getAnimations().map(a => a.animationName || 'waapi'),
      figAnimations: fig.getAnimations().map(a => a.animationName || 'waapi'),
      topmostAtCentre: hit ? hit.tagName.toLowerCase() + (hit.id ? '#' + hit.id : '') +
        (typeof hit.className === 'string' && hit.className ? '.' + hit.className.trim().split(/\\s+/).join('.') : '') : null,
      hitChain: chain,
      /* is the img inside something clipping it? */
      clippedBy: (() => {
        const out = [];
        for (let e = img.parentElement; e; e = e.parentElement) {
          const cs = getComputedStyle(e);
          if (/hidden|clip/.test(cs.overflow) && out.indexOf(e.tagName.toLowerCase() + '.' + (typeof e.className === 'string' ? e.className : '')) < 0)
            out.push(e.tagName.toLowerCase() + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\\s+/)[0] : '') + ' overflow:' + cs.overflow);
        }
        return out;
      })()
    };
  })()`);

  const shot = await rpc(ws, 'Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(OUT, Buffer.from(shot.data, 'base64'));

  console.log(JSON.stringify({ viewport: [W, H], screenshot: OUT, screenshotBytes: fs.statSync(OUT).size,
    consoleProblems: console_, ganesh: info }, null, 2));

  ws.close();
  chrome.kill();
  await sleep(600);
  process.exit(0);
})().catch(e => { console.error('PROBE FAILED:', e.message); process.exit(1); });
