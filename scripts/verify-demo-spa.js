// Audit a built SPA demo: public/demos/trial, which is a Vite build with one
// #app div and everything else rendered by React at runtime.
//
// This exists because verify-demo-static.js and verify-demo-render.js were both
// written for the previous demo, which was a hand-written single HTML file with
// ids like #hero and #countdown sitting in the markup. Every one of their
// assertions is about that shape, and against a build output they either throw
// or quietly check nothing. The old scripts are still correct for hand-written
// demos; this one is for the built ones.
//
// What actually goes wrong with a built demo, and what this checks:
//
//   - the JS and CSS are emitted root-absolute by Vite unless base is './', so
//     dropping the folder into a subdirectory 404s both and renders a blank
//     page. Checked from a real subdirectory URL, not the file system.
//   - image URLs live inside a minified bundle as string literals, so a
//     renamed or missing asset is invisible to a static check. Caught by
//     watching the network for non-200 responses.
//   - the app renders into #app, so "is anything actually on screen" is the
//     question, not "do the sections exist in the HTML".
//   - React effect errors and render throws show up only in the console.
//
// Usage: VW=430 VH=932 node scripts/verify-demo-spa.js
// Writes: $TMP/opencode/shots/spa-audit-<VW>x<VH>.json

const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const VW = +(process.env.VW || 430);
const VH = +(process.env.VH || 932);
const PORT = +(process.env.PORT || 8907);
const URL = `http://127.0.0.1:${PORT}/demos/trial/index.html`;
const SHOT_DIR = path.join(os.tmpdir(), 'opencode', 'shots');
fs.mkdirSync(SHOT_DIR, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function findChrome() {
  const cands = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(os.homedir(), 'AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'),
  ].filter(Boolean);
  for (const c of cands) if (fs.existsSync(c)) return c;
  return null;
}

(async () => {
  const chrome = findChrome();
  if (!chrome) { console.error('SPA AUDIT FAILED: no chrome binary found'); process.exit(1); }

  const port = 9222 + (process.pid % 500);
  const proc = spawn(chrome, [
    '--headless=new', `--remote-debugging-port=${port}`,
    `--window-size=${VW},${VH}`, '--disable-gpu', '--no-first-run',
    '--no-default-browser-check', '--hide-scrollbars',
    '--user-data-dir=' + path.join(os.tmpdir(), `spa-chrome-${process.pid}`),
    'about:blank',
  ], { stdio: 'ignore' });

  let wsUrl = null;
  for (let i = 0; i < 60 && !wsUrl; i++) {
    await sleep(250);
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/list`);
      const tabs = await r.json();
      const t = tabs.find((x) => x.type === 'page');
      if (t && t.webSocketDebuggerUrl) wsUrl = t.webSocketDebuggerUrl;
    } catch { /* not up yet */ }
  }
  if (!wsUrl) { proc.kill(); console.error('SPA AUDIT FAILED: chrome devtools never came up'); process.exit(1); }

  // Node 24 ships a global WebSocket, so this needs no dependency. The repo has
  // neither `ws` nor `puppeteer` installed, and verify-demo-render.js already
  // relies on the same global.
  if (typeof WebSocket === 'undefined') {
    proc.kill();
    console.error('SPA AUDIT FAILED: no global WebSocket in this Node build');
    process.exit(1);
  }
  const ws = new WebSocket(wsUrl);
  // The WHATWG WebSocket global is EventTarget-shaped: addEventListener, not
  // the Node 'ws' package's .on()/.once(). Using the package API here fails with
  // "ws.once is not a function", which is how this line got rewritten.
  await new Promise((res, rej) => {
    ws.addEventListener('open', res, { once: true });
    ws.addEventListener('error', rej, { once: true });
  });

  let id = 0;
  const pending = new Map();
  const events = [];
  const listeners = [];
  const dispatch = (raw) => {
    const m = JSON.parse(raw);
    if (m.id && pending.has(m.id)) {
      const { resolve, reject } = pending.get(m.id);
      pending.delete(m.id);
      m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
    } else if (m.method) {
      events.push(m);
      listeners.forEach((fn) => fn(m));
    }
  };
  ws.addEventListener('message', (ev) => dispatch(ev.data));

  const send = (method, params) => new Promise((resolve, reject) => {
    const myId = ++id;
    pending.set(myId, { resolve, reject });
    ws.send(JSON.stringify({ id: myId, method, params }));
  });

  const consoleProblems = [];
  const netFailures = [];
  listeners.push((m) => {
    if (m.method === 'Runtime.consoleAPICalled' && /error|warning/.test(m.params.type)) {
      consoleProblems.push({
        type: m.params.type,
        text: (m.params.args || []).map((a) => a.value ?? a.description ?? a.type).join(' ').slice(0, 300),
      });
    }
    if (m.method === 'Runtime.exceptionThrown') {
      const d = m.params.exceptionDetails;
      consoleProblems.push({ type: 'exception', text: (d.exception?.description || d.text || '').slice(0, 300) });
    }
    if (m.method === 'Network.responseReceived' && m.params.response.status >= 400) {
      netFailures.push({ status: m.params.response.status, url: m.params.response.url.slice(0, 200) });
    }
    // ERR_ABORTED is how a cancelled request looks, and a cancelled request is
    // usually benign: a preconnect the browser never needed, a duplicate the
    // deduper dropped, or a stylesheet the parser discarded. Counting it as a
    // failure is what made the first clean run report a phantom network
    // problem. ERR_BLOCKED_BY_CLIENT and ERR_NAME_NOT_RESOLVED still count.
    if (m.method === 'Network.loadingFailed') {
      const et = m.params.errorText || '';
      if (et !== 'net::ERR_ABORTED') {
        netFailures.push({ status: 'failed', url: (m.params.requestId || '').slice(0, 120), error: et });
      }
    }
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: VW, height: VH, deviceScaleFactor: 1, mobile: VW < 700,
  });

  await send('Page.navigate', { url: URL });
  await sleep(6500);   // past the entrance animations

  // Step down the page so lazy and reveal-gated images actually load, then
  // return to the top. Without this the audit cannot tell a 404 from an image
  // that simply has not been scrolled to yet.
  const total = (await send('Runtime.evaluate', {
    expression: 'document.documentElement.scrollHeight', returnByValue: true,
  })).result.value;
  for (let y = 0; y < total; y += Math.floor(VH * 0.8)) {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` });
    await sleep(220);
  }
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
  await sleep(1200);

  const probe = `(() => {
    const out = {};
    const app = document.querySelector('#app');
    out.appExists = !!app;
    out.appChildren = app ? app.children.length : 0;
    out.appTextLength = app ? (app.innerText || '').trim().length : 0;
    out.title = document.title;

    // root-absolute asset refs are the classic subdirectory 404
    const abs = [...document.querySelectorAll('script[src],link[href],img[src]')]
      .map(e => e.getAttribute('src') || e.getAttribute('href'))
      .filter(u => u && u.startsWith('/'));
    out.rootAbsoluteRefs = abs;

    // did every <img> actually decode?
    // An image is only "broken" if it finished loading with no pixels. Checking
    // this without scrolling the page reports lazy and reveal-gated images as
    // broken: they are correct on disk and serve 200, they have simply not been
    // scrolled into view yet, so naturalWidth is 0. The first version of this
    // script reported 11 broken images that all returned HTTP 200.
    const imgs = [...document.images];
    out.imgTotal = imgs.length;
    out.imgNotYetLoaded = imgs.filter(i => !i.complete || i.naturalWidth === 0).length;
    // A failed load settles complete=true with naturalWidth 0, which is the
    // signature of a real 404 rather than laziness.
    out.imgBroken = imgs.filter(i => i.complete && i.naturalWidth === 0)
      .map(i => (i.currentSrc || i.src || '').slice(-70));

    // is anything painted, or is it a blank white screen?
    out.bodyText = (document.body.innerText || '').trim().length;
    out.docHeight = document.documentElement.scrollHeight;
    // ${VW} must be interpolated, not referenced: this string is evaluated in
    // the page, where no VW exists. A bare VW throws ReferenceError and the
    // whole probe returns nothing.
    out.hasHorizontalOverflow = document.documentElement.scrollWidth > ${VW} + 1;

    // the sections this design actually renders
    const texts = (document.body.innerText || '');
    out.sees = {
      hero: /Abhishek/i.test(texts),
      kanika: /Kanika/i.test(texts),
      mehendi: /Mehendi/i.test(texts),
      haldi: /Haldi/i.test(texts),
      reception: /Reception/i.test(texts),
      rajwada: /Rajwada/i.test(texts),
      countdown: /\\b\\d+\\s*(days|hours|minutes|seconds)/i.test(texts),
    };
    // the stale-2026 regression, caught in the rendered text
    out.stale2026 = /March\\s+\\d+(st|nd|rd|th)?\\s*2026/i.test(texts);
    out.feb2027 = /February\\s+\\d+(st|nd|rd|th)?\\s*2027/i.test(texts);
    out.waPlaceholder = /wa\\.me\\/91X+/.test(document.documentElement.innerHTML);

    // text too small to read
    let tiny = 0;
    for (const el of document.querySelectorAll('*')) {
      if (!el.childNodes.length) continue;
      const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      if (!hasText) continue;
      const cs = getComputedStyle(el);
      const fs = parseFloat(cs.fontSize);
      if (fs && fs < 9 && el.offsetParent !== null) tiny++;
    }
    out.tinyText = tiny;
    return out;
  })()`;

  let probeResult;
  try {
    const r = await send('Runtime.evaluate', { expression: probe, returnByValue: true, awaitPromise: false });
    // Runtime.evaluate returns {result:{type,value}} for a value, but
    // {result:{...}, exceptionDetails} when the expression throws. Reading
    // r.result.value then yields undefined and every later field access dies
    // with a confusing "cannot read properties of undefined", so the thrown
    // case is reported here instead of three lines later.
    if (r.exceptionDetails) {
      const d = r.exceptionDetails;
      throw new Error('page threw: ' + (d.exception?.description || d.text || 'unknown'));
    }
    probeResult = r.result && r.result.value;
    if (!probeResult || typeof probeResult !== 'object') {
      throw new Error('probe returned ' + JSON.stringify(r.result));
    }
  } catch (e) {
    proc.kill();
    console.error('SPA AUDIT FAILED: Runtime.evaluate: ' + e.message);
    process.exit(1);
  }

  // full-page screenshot so the design can be eyeballed
  let shot = null;
  try {
    const metrics = await send('Page.getLayoutMetrics');
    const h = Math.min(Math.ceil(metrics.cssContentSize.height), 16000);
    await send('Emulation.setDeviceMetricsOverride', {
      width: VW, height: h, deviceScaleFactor: 1, mobile: VW < 700,
    });
    await sleep(700);
    const s = await send('Page.captureScreenshot', { format: 'png' });
    shot = path.join(SHOT_DIR, `spa-full-${VW}x${VH}.png`);
    fs.writeFileSync(shot, Buffer.from(s.data, 'base64'));
    await send('Emulation.setDeviceMetricsOverride', {
      width: VW, height: VH, deviceScaleFactor: 1, mobile: VW < 700,
    });
  } catch { /* screenshot is a nicety, not a gate */ }

  const issues = [];
  if (!probeResult.appExists) issues.push('no #app');
  if (!probeResult.appChildren) issues.push('#app is empty - nothing rendered');
  if (probeResult.appTextLength < 200) issues.push(`almost no text rendered (${probeResult.appTextLength} chars)`);
  if (probeResult.rootAbsoluteRefs.length) issues.push(`root-absolute refs: ${probeResult.rootAbsoluteRefs.join(', ')}`);
  if (probeResult.imgBroken.length) issues.push(`${probeResult.imgBroken.length} broken image(s): ${probeResult.imgBroken.join(', ')}`);
  // /favicon.ico is the browser asking for a site-root icon. The demo is served
  // from a subdirectory of the real site, so the answer belongs to the site, not
  // to this folder, and the deploy is not broken by it.
  const realFailures = netFailures.filter((f) => !/favicon\.ico$/.test(f.url || ''));
  if (realFailures.length) issues.push(`${realFailures.length} network failure(s): ${realFailures.map((f) => f.url || f.error).join(', ')}`);
  if (consoleProblems.length) issues.push(`${consoleProblems.length} console problem(s)`);
  if (probeResult.hasHorizontalOverflow) issues.push('horizontal overflow');
  if (probeResult.tinyText) issues.push(`${probeResult.tinyText} element(s) under 9px`);
  for (const [k, v] of Object.entries(probeResult.sees)) {
    if (k === 'countdown' ? !v : !v) issues.push(`expected text not found: ${k}`);
  }
  if (probeResult.stale2026) issues.push('rendered text still contains the stale March 2026 dates');
  if (!probeResult.feb2027) issues.push('rendered text does not contain the corrected Feb 2027 dates');

  const report = {
    viewport: [VW, VH], url: URL, screenshot: shot,
    ...probeResult, netFailures, consoleProblems, issues,
  };
  // These two are derived from netFailures and are assigned after the object is
  // built: `report.faviconMissing = ...` inside the object literal above is a
  // self-reference, and the temporal dead zone turns that into
  // "Cannot access 'report' before initialization".
  report.realNetworkFailures = realFailures;
  report.faviconMissing = netFailures.length - realFailures.length;
  fs.writeFileSync(path.join(SHOT_DIR, `spa-audit-${VW}x${VH}.json`), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));

  ws.close();
  proc.kill();
  console.log(issues.length ? `\nSPA AUDIT: ${issues.length} issue(s)` : '\nSPA AUDIT CLEAN');
  process.exit(issues.length ? 1 : 0);
})().catch((e) => { console.error('SPA AUDIT FAILED: ' + e.message); process.exit(1); });
