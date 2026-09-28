// Drives the rebuilt page in headless Chrome over the DevTools Protocol and
// reports what a screenshot cannot: console errors, computed sizes, resolved
// fonts, overflow, and whether the cover actually opens.
//
// Usage: node cdp-audit.js <url> [--shots]
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const URL_ = process.argv[2] || 'http://127.0.0.1:8907/demos/trial/index.html';
const SHOT_DIR = process.env.SHOT_DIR || 'C:\\Users\\aadit\\AppData\\Local\\Temp\\opencode\\shots';
const PORT = 9333;
const PROFILE = 'C:\\Users\\aadit\\AppData\\Local\\Temp\\opencode\\chrome-profile-audit';
const W = +(process.env.VW || 430);
const H = +(process.env.VH || 932);
const REDUCE = process.env.REDUCE === '1';
const TAG = process.env.TAG || '';

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

/* Evaluates an expression in the page and returns its JSON value. */
async function evaluate(ws, expression) {
  const r = await rpc(ws, 'Runtime.evaluate', {
    expression, returnByValue: true, awaitPromise: true
  });
  if (r.exceptionDetails) {
    throw new Error('page threw: ' + (r.exceptionDetails.exception?.description ||
              r.exceptionDetails.text));
  }
  return r.result.value;
}

(async () => {
  fs.rmSync(PROFILE, { recursive: true, force: true });
  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--remote-debugging-port=' + PORT,
    '--user-data-dir=' + PROFILE,
    '--window-size=' + W + ',' + H,
    '--force-device-scale-factor=1',
    ...(REDUCE ? ['--force-prefers-reduced-motion'] : []),
    '--no-first-run', '--no-default-browser-check',
    '--autoplay-policy=no-user-gesture-required',
    'about:blank'
  ], { stdio: 'ignore' });

  let target = null;
  for (let i = 0; i < 40 && !target; i++) {
    await sleep(500);
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      target = list.find(t => t.type === 'page');
    } catch (_) { /* not up yet */ }
  }
  if (!target) { console.error('Chrome never came up'); chrome.kill(); process.exit(1); }

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  const problems = [];
  const noise = [];
  await rpc(ws, 'Runtime.enable');
  await rpc(ws, 'Log.enable');
  await rpc(ws, 'Page.enable');
  /* Honour VW/VH exactly. --window-size alone does not: headless subtracts its
     own chrome, so asking for 844x390 measured 826x238 and every "landscape"
     result was really a much shorter viewport than the label claimed. The
     window-size flag is kept as a hint for first paint, but the override below
     is what the numbers come from. Also drops the forced 2x device scale, which
     was halving the CSS viewport. */
  await rpc(ws, 'Emulation.setDeviceMetricsOverride', {
    width: W, height: H, deviceScaleFactor: 1, mobile: W < 700
  });
  await rpc(ws, 'Network.enable');

  const failedRequests = [];
  ws.addEventListener('message', ev => {
    const m = JSON.parse(ev.data);
    if (m.method === 'Runtime.exceptionThrown') {
      const d = m.params.exceptionDetails;
      problems.push('UNCAUGHT: ' + (d.exception?.description || d.text));
    }
    if (m.method === 'Log.entryAdded') {
      const e = m.params.entry;
      if (e.level === 'error') problems.push('CONSOLE: ' + e.text + '  @' + (e.url || ''));
      else if (e.level === 'warning' && !/favicon|Autofill/i.test(e.text)) noise.push('warn: ' + e.text);
    }
    if (m.method === 'Network.loadingFailed') {
      failedRequests.push(m.params.errorText + ' ' + (m.params.type || ''));
    }
  });

  await rpc(ws, 'Page.navigate', { url: URL_ });
  await sleep(5000);   /* cover animation + fonts + dust */

  /* ------------------------------------------------------------ the cover */
  const cover = await evaluate(ws, `(() => {
    const c = document.getElementById('invite-cover');
    const btn = document.getElementById('invite-open');
    const seal = document.querySelector('.ic-seal');
    const ganesh = document.querySelector('.ic-ganesh img');
    const monogram = document.querySelector('#invite-cover .ic-monogram');
    const when = document.querySelector('.ic-when');
    const label = document.querySelector('.ic-open__label');
    const r = el => el ? el.getBoundingClientRect() : null;
    const cs = el => el ? getComputedStyle(el) : null;
    const money = n => Math.round(n * 10) / 10;
    return {
      viewport: [innerWidth, innerHeight],
      coverRect: r(c) && [money(r(c).width), money(r(c).height)],
      coverVisible: cs(c) && cs(c).display !== 'none' && cs(c).visibility !== 'hidden',
      bodyLocked: document.body.classList.contains('locked'),
      seal: r(seal) && { w: money(r(seal).width), h: money(r(seal).height) },
      sealClickable: r(seal) ? r(seal).width > 60 && r(seal).height > 60 : false,
      ganesh: ganesh ? {
        complete: ganesh.complete,
        natural: [ganesh.naturalWidth, ganesh.naturalHeight],
        shown: r(ganesh) && [money(r(ganesh).width), money(r(ganesh).height)],
        opacity: cs(ganesh).opacity
      } : null,
      monogramText: monogram ? monogram.textContent.trim() : null,
      monogramsOnCover: document.querySelectorAll('#invite-cover .ic-monogram').length,
      whenText: when ? when.textContent.replace(/\\s+/g, ' ').trim() : null,
      labelChars: label ? label.querySelectorAll('i').length : 0,
      labelText: label ? label.textContent.trim() : null,
      hintText: document.querySelector('.ic-hint') ? 'STILL PRESENT' : null,
      /* the old cover had four counter-spinning rings and an eight-heart
         crown riding one of them. The user asked for them gone. */
      ringsRemaining: document.querySelectorAll('.ic-ring, .ic-crown, .ic-crown__h').length,
      bloomPresent: !!document.querySelector('.ic-bloom'),
      streamsPresent: document.querySelectorAll('.ic-stream').length,
      edgesPresent: document.querySelectorAll('.ic-edge').length,
      coverOverflow: c ? c.scrollHeight > c.clientHeight + 1 : null,
      coverScroll: c ? [c.scrollHeight, c.clientHeight] : null
    };
  })()`);

  /* ------------------------------------------------- is the cover clipped? */
  const fit = await evaluate(ws, `(() => {
    const inner = document.querySelector('.ic-inner');
    const r = inner.getBoundingClientRect();
    return {
      stackHeight: Math.round(r.height),
      viewportHeight: innerHeight,
      topGap: Math.round(r.top),
      bottomGap: Math.round(innerHeight - r.bottom),
      clippedTop: r.top < 0,
      clippedBottom: r.bottom > innerHeight
    };
  })()`);

  /* Devanagari and drift hearts MUST be measured while the cover is still on
     screen. After the open the cover is display:none, so every box inside it
     reports 0x0 and a "font did not load" verdict becomes a false positive. */
  const coverLive = await evaluate(ws, `(async () => {
    await document.fonts.ready;
    const b = document.querySelector('.ic-bless b');
    const probe = el => { el.style.fontFamily = 'monospace'; const m = el.getBoundingClientRect().width;
                          el.style.fontFamily = 'Yaldevi';   const y = el.getBoundingClientRect().width;
                          el.style.fontFamily = ''; return { monospace: Math.round(m), yaldevi: Math.round(y) }; };
    /* SVG elements have an SVGAnimatedString className, so matching on
       className finds nothing. Walk up to an ancestor id instead. */
    const inDrift = el => !!(el.closest && el.closest('#ic-drift'));
    const anims = document.getAnimations().map(a => {
      const t = a.effect && a.effect.target;
      return {
        drift: t ? inDrift(t) : false,
        kf: a.effect && a.effect.getKeyframes ? a.effect.getKeyframes().map(k => k.transform).filter(Boolean) : []
      };
    });
    const driftAnims = anims.filter(a => a.drift);
    return {
      blessBox: b ? { w: Math.round(b.getBoundingClientRect().width), h: Math.round(b.getBoundingClientRect().height) } : null,
      blessText: b ? b.textContent : null,
      fontProbe: b ? probe(b) : null,
      fontsStatus: document.fonts.status,
      yaldeviLoaded: document.fonts.check('16px "Yaldevi"'),
      driftHeartsInDom: document.querySelectorAll('#ic-drift svg').length,
      driftAnimations: driftAnims.length,
      driftKeyframesValid: driftAnims.every(a => a.kf.every(t => !/vminvmin|pxpx|NaN|undefined/.test(t))),
      /* the middle band is reserved for type; count hearts sitting in it */
      heartsBehindType: (() => {
        const stack = document.querySelector('.ic-inner').getBoundingClientRect();
        let n = 0;
        document.querySelectorAll('#ic-drift svg').forEach(h => {
          const r = h.getBoundingClientRect();
          if (r.left + r.width > stack.left && r.left < stack.right &&
              r.top + r.height > stack.top && r.top < stack.bottom) n++;
        });
        return n;
      })(),
      canvasDots: (() => {
        /* sample the flow canvas: how many lit pixels, and are they in the sides */
        const cv = document.getElementById('ic-dust');
        if (!cv) return null;
        const cx = cv.getContext('2d');
        const d = cx.getImageData(0, 0, cv.width, cv.height).data;
        let lit = 0, mid = 0;
        const W = cv.width;
        for (let i = 3; i < d.length; i += 4 * 7) {
          if (d[i] > 6) {
            lit++;
            const x = (i / 4) % W;
            if (x > W * 0.30 && x < W * 0.70) mid++;
          }
        }
        return { litSamples: lit, inMiddleBand: mid };
      })(),
      sampleKeyframe: driftAnims.filter(a => a.kf.length).slice(0, 1).map(a => a.kf[3])[0] || null
    };
  })()`);

  /* tiny type check, while sizes are meaningful */
  const typeCheck = await evaluate(ws, `(() => {
    const bad = [];
    document.querySelectorAll('#invite-cover p, #invite-cover span, #invite-cover b, .ic-eyebrow, .ic-when, .ic-open__label')
      .forEach(e => {
        const t = e.textContent.trim();
        if (t.length < 3) return;
        const px = parseFloat(getComputedStyle(e).fontSize);
        if (px < 11.5) bad.push({ px: px, text: t.slice(0, 24) });
      });
    return { tooSmall: bad };
  })()`);

  /* -------------------------------------------------------------- open it */
  await evaluate(ws, `document.getElementById('invite-open').click(); true`);
  await sleep(1200);
  const mid = await evaluate(ws, `(() => {
    const c = document.getElementById('invite-cover');
    return {
      bodyLocked: document.body.classList.contains('locked'),
      bodyOpened: document.body.classList.contains('opened'),
      coverOpacity: getComputedStyle(c).opacity,
      audioToggleVisible: getComputedStyle(document.getElementById('audio-toggle')).visibility
    };
  })()`);

  await sleep(5200);   /* let the whole name cascade finish */
  const hero = await evaluate(ws, `(() => {
    const letters = [...document.querySelectorAll('.hero-name--a .hl')];
    const k = [...document.querySelectorAll('.hero-name--k .hl')];
    const box = el => { const r = el.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; };
    const all = [...document.querySelectorAll('#hero .hl')];
    return {
      aLetters: letters.length,
      kLetters: k.length,
      aText: letters.map(l => l.textContent).join(''),
      kText: k.map(l => l.textContent).join(''),
      anyLetterZeroSize: all.some(l => box(l).w === 0 || box(l).h === 0),
      anyLetterStillTransparent: all.some(l => +getComputedStyle(l).opacity < 0.95),
      aFontSize: letters[0] ? getComputedStyle(letters[0]).fontSize : null,
      wedsLines: document.querySelectorAll('.hero-weds span').length,
      hearts: document.querySelectorAll('#hero-hearts svg').length,
      heartSizes: [...new Set([...document.querySelectorAll('#hero-hearts svg')]
        .map(s => getComputedStyle(s).width))],
      heroHeight: Math.round(document.getElementById('hero').getBoundingClientRect().height),
      cueVisible: +getComputedStyle(document.querySelector('.hero-scroll-cue')).opacity
    };
  })()`);

  /* --------------------------------------------------- the rest of the page */
  await evaluate(ws, `window.scrollTo(0, document.body.scrollHeight); true`);
  await sleep(2500);

  /* lazy images inside a horizontally scrolled track only load once the track
     is in view, so check them with the track actually on screen */
  await evaluate(ws, `document.getElementById('gallery').scrollIntoView(); true`);
  await sleep(2000);

  const page = await evaluate(ws, `(() => {
    const secs = [...document.querySelectorAll('main > section')].map(s => {
      const r = s.getBoundingClientRect();
      return { id: s.id || '(none)', h: Math.round(r.height) };
    });
    const rvTotal = document.querySelectorAll('.rv').length;
    const rvShown = document.querySelectorAll('.rv.in').length;
    /* The visible box an image must be near for the browser to have asked it to
       load: the window, intersected with every scrollable ancestor, since
       Chrome decides lazy loading against the nearest scroll container. */
    const lazyScope = (el => {
      let box = { top: 0, left: 0, right: innerWidth, bottom: innerHeight };
      for (let p = el.parentElement; p; p = p.parentElement) {
        const cs = getComputedStyle(p);
        if (!/(auto|scroll|overlay)/.test(cs.overflowX + cs.overflowY)) continue;
        const pr = p.getBoundingClientRect();
        box.top = Math.max(box.top, pr.top);
        box.left = Math.max(box.left, pr.left);
        box.right = Math.min(box.right, pr.right);
        box.bottom = Math.min(box.bottom, pr.bottom);
      }
      return box;
    });
    return {
      docWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      sections: secs,
      zeroHeightSections: secs.filter(s => s.h < 40).map(s => s.id),
      revealTotal: rvTotal,
      revealShown: rvShown,
      revealStuck: rvTotal - rvShown,
      /* "stuck" only matters if it means invisible. Under reduced motion the
         observer is bypassed and a media query forces .rv visible, so a
         missing .in class is expected and harmless — check the real thing. */
      revealInvisible: [...document.querySelectorAll('.rv')]
        .filter(e => { const cs = getComputedStyle(e);
                       return cs.opacity !== '1' && e.getBoundingClientRect().top < innerHeight; })
        .map(e => e.className).slice(0, 5),
      revealInvisibleCount: [...document.querySelectorAll('.rv')]
        .filter(e => { const cs = getComputedStyle(e);
                       return cs.opacity !== '1' && e.getBoundingClientRect().top < innerHeight; }).length,
      coins: document.querySelectorAll('.coin').length,
      countdown: [...document.querySelectorAll('[data-cd]')].map(c => c.textContent),
      galleryItems: document.querySelectorAll('.gallery__item').length,
      images: [...document.querySelectorAll('img')].map(i => ({
        src: i.currentSrc.split('/').slice(-1)[0],
        ok: i.complete && i.naturalWidth > 0,
        lazy: i.getAttribute('loading'),
        w: i.naturalWidth
      })),
      /* "broken" has to mean broken. The old filter was
         !(complete && naturalWidth > 0), which also matches every lazy image
         that simply has not started because it is outside the viewport —
         correct behaviour, reported as a failure. On this page that is most of
         the images, so the metric was mostly noise and would have hidden a real
         broken image behind a pile of deferred ones.

         The test for "has it been asked to load yet" cannot just be the window.
         #gallery-track is a horizontal scroller, so couple-5 and couple-6 sit
         at x=1216 and x=1505 on a 430px-wide phone: vertically nowhere near the
         viewport, horizontally far outside it, and correctly deferred until you
         swipe the track. Chrome decides lazy loading against the nearest scroll
         container's scrollport, so this walks up the ancestors, intersects the
         scrollable ones, and only then applies a margin. */
      /* An image inside display:none is unreachable *right now* - which is not
         the same as dead weight. Measured after the cover is dismissed, the
         Ganesha reports this way too, because #invite-cover.gone is
         display:none: the emblem rendered at 118x144 before the seal was
         pressed and is supposed to be gone afterwards. A layer carrying .gone
         has already had its turn, so it is excluded here.

         What is left is genuinely unreachable at every point in the page's
         life, which is the useful finding: .hero-bg is display:none while still
         holding a 306 KB AVIF that can never load. */
      unreachableImages: [...document.querySelectorAll('img')].filter(i => {
        let hidden = false;
        for (let p = i; p && p !== document.body; p = p.parentElement) {
          if (p.classList && p.classList.contains('gone')) return false;
          if (getComputedStyle(p).display === 'none') hidden = true;
        }
        return hidden;
      }).map(i => (i.getAttribute('src') || '').split('/').slice(-1)[0] +
                  '  ' + (i.className || (i.parentElement && i.parentElement.className) || i.tagName) +
                  '  (an ancestor is display:none, and no .gone layer is involved)'),
      brokenImages: [...document.querySelectorAll('img')].filter(i => {
        if (i.complete && i.naturalWidth > 0) return false;
        if (getComputedStyle(i).display === 'none') return false;
        if (i.getAttribute('loading') !== 'lazy') return true;
        const r = i.getBoundingClientRect();
        /* No area, nothing visible can be missing. This matters: a 0x0 rect is
           trivially "near" every edge, so without this an image inside a
           display:none parent was reported both broken and unreachable. */
        if (r.width === 0 || r.height === 0) return false;
        const b = lazyScope(i);
        const m = 200;
        return r.top < b.bottom + m && r.bottom > b.top - m
            && r.left < b.right + m && r.right > b.left - m;
      }).map(i => {
        const r = i.getBoundingClientRect();
        return (i.currentSrc.split('/').slice(-1)[0] || '(no resolved src)')
          + '  ' + (i.className || i.parentElement.className || i.tagName)
          + '  rect ' + [r.left, r.top, r.right, r.bottom].map(Math.round).join(',');
      }),
      /* Deferred means "not asked to load yet, and correctly so" - lazy, and
         outside the scroll container it lives in. An image that can never load
         at all is unreachable, not deferred, so it is kept out of this list. */
      deferredImages: [...document.querySelectorAll('img')].filter(i => {
        if (i.complete && i.naturalWidth > 0) return false;
        if (i.getAttribute('loading') !== 'lazy') return false;
        for (let p = i; p && p !== document.body; p = p.parentElement)
          if (getComputedStyle(p).display === 'none') return false;
        return true;
      }).map(i => (i.currentSrc.split('/').slice(-1)[0]
                  || (i.getAttribute('src') || '').split('/').slice(-1)[0])
        + '  ' + (i.className || i.parentElement.className || i.tagName))
    };
  })()`);

  /* --------------------------------------------------------------- fonts */
  const fonts = await evaluate(ws, `(async () => {
    await document.fonts.ready;
    const want = ['Cormorant','Cormorant Infant','Cormorant Upright','Aboreto','Manrope','Yaldevi'];
    const declared = [...document.fonts].map(f => f.family);
    return {
      ready: document.fonts.status,
      declaredFamilies: [...new Set(declared)],
      /* check() with an empty string returns true for any family, including
         ones that were never declared, so pair it with the declared list. */
      perFamily: want.map(f => f + ': ' + document.fonts.check('16px "' + f + '"')),
      undeclaredButReportedLoaded: ['Gotu'].filter(f =>
        !declared.includes(f) && document.fonts.check('16px "' + f + '"'))
    };
  })()`);

  /* ------------------------------------------------- colour system in situ */
  const colours = await evaluate(ws, `(() => {
    const g = (sel, prop) => { const e = document.querySelector(sel); return e ? getComputedStyle(e)[prop] : null; };
    return {
      bodyBg: g('body', 'backgroundColor'),
      coverBg: g('#invite-cover', 'backgroundColor'),
      heroText: g('.hero-name', 'color'),
      goldOnDark: g('.ic-eyebrow', 'color'),
      sealGlyph: g('.ic-seal__glyph', 'color'),
      inkCardBg: g('.know-card', 'backgroundColor'),
      heartColour: g('.hero-flourish svg', 'color'),
      anyBlackText: [...document.querySelectorAll('p,h1,h2,h3,dd,dt')]
        .filter(e => { const c = getComputedStyle(e).color; return c === 'rgb(0, 0, 0)'; }).length,
      /* a rule of thumb: no body copy under 12px */
      tinyText: [...document.querySelectorAll('p,dd,dt,li,span')]
        .filter(e => e.textContent.trim().length > 3) 
        .map(e => ({ px: parseFloat(getComputedStyle(e).fontSize), t: e.textContent.trim().slice(0, 30) }))
        .filter(o => o.px < 11.5).slice(0, 6)
    };
  })()`);

  /* --------------------------------------------------------------- report */
  const out = { url: URL_, cover, fit, coverLive, typeCheck, afterOpen: mid, hero, page, fonts, colours,
                consoleProblems: problems, networkFailures: failedRequests, warnings: noise };
  fs.writeFileSync(path.join(SHOT_DIR, 'cdp-audit' + (TAG ? '-' + TAG : '') + '.json'),
                   JSON.stringify(out, null, 2));
  /* a one-screen verdict, so three viewports can be compared at a glance */
  const verdict = {
    viewport: cover.viewport,
    stackFits: !fit.clippedTop && !fit.clippedBottom,
    stackHeight: fit.stackHeight,
    coverScrolls: cover.coverOverflow,
    tinyText: typeCheck.tooSmall.length,
    ringsRemaining: cover.ringsRemaining,
    bloom: cover.bloomPresent,
    streams: cover.streamsPresent,
    driftHearts: coverLive.driftHeartsInDom,
    driftAnimOk: coverLive.driftKeyframesValid,
    /* a heart must never end up behind the type stack */
    heartsBehindType: coverLive.heartsBehindType,
    devanagariOk: coverLive.fontProbe && coverLive.fontProbe.yaldevi !== coverLive.fontProbe.monospace,
    openedCleanly: !mid.bodyLocked && mid.coverOpacity === '0',
    lettersLanded: !hero.anyLetterZeroSize && !hero.anyLetterStillTransparent,
    distinctHeartSizes: hero.heartSizes.length,
    horizontalOverflow: page.horizontalOverflow,
    /* The bug this whole page was rebuilt around was "the image is not showing",
       so a broken image is now a first-class verdict line rather than something
       buried in the detail JSON. Deferred carousel images are reported
       separately and do not count against it. */
    brokenImages: page.brokenImages,
    unreachableImages: page.unreachableImages,
    deferredImages: page.deferredImages,
    revealsStuck: page.revealStuck,
    revealInvisible: page.revealInvisibleCount,
    sectionsZeroHeight: page.zeroHeightSections.length,
    consoleProblems: problems.length,
    networkFailures: failedRequests.length,
    invalidKeyframeWarnings: noise.filter(w => /Invalid keyframe/.test(w)).length
  };
  console.log(JSON.stringify(verdict, null, 2));
  fs.writeFileSync(path.join(SHOT_DIR, 'verdict' + (TAG ? '-' + TAG : '') + '.json'),
                   JSON.stringify(verdict, null, 2));

  ws.close();
  chrome.kill();
  await sleep(1200);
  try { fs.rmSync(PROFILE, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); }
  catch (_) { /* Chrome sometimes keeps the profile locked briefly; harmless */ }
  process.exit(0);
})().catch(async e => {
  console.error('AUDIT FAILED: ' + e.message);
  try { require('child_process').execSync('taskkill /F /IM chrome.exe'); } catch (_) {}
  process.exit(1);
});
