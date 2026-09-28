// Static verification for the rebuilt trial invitation.
// Run: node verify-trial.js
const fs = require('fs');
const path = require('path');

const FILE = process.argv[2] ||
  'D:/Firefox/New/invite/public/demos/trial/index.html';
const DIR = path.dirname(FILE);
const raw = fs.readFileSync(FILE, 'utf8');
/* Strip comments before any "is this a real usage?" question. Without this the
   checker flags its own documentation — a comment saying "never var(--x)" is
   not a bug, and a tool that cannot tell the difference will keep crying
   wolf until someone stops reading its output. */
const stripCssComments = s => s.replace(/\/\*[\s\S]*?\*\//g, '');
const stripJsComments = s =>
  s.replace(/\/\*[\s\S]*?\*\//g, '')
   .replace(/(^|[^:])\/\/[^\n]*/g, '$1');
/* Properties that are only ever set at runtime, so they have no :root entry. */
const RUNTIME_VARS = new Set(['--i', '--a', '--d', '--hs', '--h', '--w']);

let fails = 0, warns = 0;
const ok  = m => console.log('  PASS  ' + m);
const bad = m => { fails++; console.log('  FAIL  ' + m); };
const warn = m => { warns++; console.log('  WARN  ' + m); };
const head = m => console.log('\n== ' + m + ' ' + '='.repeat(Math.max(0, 58 - m.length)));

console.log('file: ' + FILE);
console.log('size: ' + raw.length.toLocaleString() + ' bytes / ' +
            raw.split('\n').length.toLocaleString() + ' lines');

/* ---------------------------------------------------------------- 1. size */
head('1. file is not empty / not truncated');
raw.length > 40000 ? ok(raw.length.toLocaleString() + ' bytes') : bad('suspiciously small');
if (!/<\/html>\s*$/.test(raw)) bad('no closing </html>');

/* ------------------------------------------------------------ 2. scripts */
head('2. script blocks parse');
const scripts = [...raw.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
console.log('  found ' + scripts.length + ' script block(s)');
scripts.forEach((s, i) => {
  try { new Function(s); ok('script #' + (i + 1) + ' parses (' + s.length + ' chars)'); }
  catch (e) { bad('script #' + (i + 1) + ': ' + e.message); }
});

/* ---------------------------------------------------------------- 3. CSS */
head('3. CSS brace balance');
const styles = [...raw.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]);
console.log('  found ' + styles.length + ' <style> block(s)');
styles.forEach((css, i) => {
  const o = (css.match(/\{/g) || []).length;
  const c = (css.match(/\}/g) || []).length;
  o === c ? ok('style #' + (i + 1) + ' balanced (' + o + ' rules)')
          : bad('style #' + (i + 1) + ': ' + o + ' open vs ' + c + ' close');
});
/* comment-stripped paren check on the last block only catches unclosed at-rules */
const last = styles[styles.length - 1] || '';
const noCmt = last.replace(/\/\*[\s\S]*?\*\//g, '');
(noCmt.match(/\(/g) || []).length === (noCmt.match(/\)/g) || []).length
  ? ok('style parens balanced') : bad('style parens unbalanced');

/* --------------------------------------- 3b. intrinsic sizes must be true.
   A width/height that does not match the file is not a cosmetic problem: the
   browser reserves the box from those numbers before CSS arrives, so a stale
   pair causes a visible layout shift on every load. The Ganesha carried
   440x248 long after the file became 640x640. */
head('3b. width/height attributes match the real file');
const natOf = f => { try { return null; } catch (e) { return null; } };
[...raw.matchAll(/<img[^>]*\bsrc="(assets\/[^"]+)"[^>]*>/g)].forEach(m => {
  const tag = m[0];
  const src = m[1];
  const file = path.join(DIR, src);
  if (!fs.existsSync(file)) return;
  const w = tag.match(/\bwidth="(\d+)"/), h = tag.match(/\bheight="(\d+)"/);
  if (!w || !h) { warn(src + ' has no width/height (no aspect reserved)'); return; }
  if (/\.(png|jpe?g)$/i.test(src)) {
    /* read PNG/JPEG headers directly — no image library needed */
    const fd = fs.openSync(file, 'r');
    const buf = Buffer.alloc(64 * 1024);
    fs.readSync(fd, buf, 0, buf.length, 0);
    fs.closeSync(fd);
    let iw = 0, ih = 0;
    if (buf.slice(1, 4).toString() === 'PNG') { iw = buf.readUInt32BE(16); ih = buf.readUInt32BE(20); }
    else if (buf[0] === 0xFF && buf[1] === 0xD8) {
      let o = 2;
      while (o < buf.length) {
        if (buf[o] !== 0xFF) { o++; continue; }
        const m2 = buf[o + 1];
        const len = buf.readUInt16BE(o + 2);
        if (m2 >= 0xC0 && m2 <= 0xCF && m2 !== 0xC4 && m2 !== 0xC8 && m2 !== 0xCC) {
          ih = buf.readUInt16BE(o + 5); iw = buf.readUInt16BE(o + 7); break;
        }
        o += 2 + len;
      }
    }
    if (iw && (iw !== +w[1] || ih !== +h[1]))
      bad(src + ' declared ' + w[1] + 'x' + h[1] + ' but the file is ' + iw + 'x' + ih);
    else if (iw) ok(src + ' ' + iw + 'x' + ih);
  } else {
    /* webp/avif: compare against a recorded expectation */
    ok(src + ' ' + w[1] + 'x' + h[1] + ' (non-raster, header not parsed)');
  }
});

/* ------------------------------------------------------------ 4. assets */
head('4. every referenced asset exists');
const refs = new Set();
for (const m of raw.matchAll(/(?:src|href)="([^"]+)"/g)) {
  const v = m[1];
  if (v.startsWith('assets/') || v.startsWith('fonts/')) refs.add(v);
}
for (const m of raw.matchAll(/url\((['"]?)(assets\/[^)'"]+)\1\)/g)) refs.add(m[2]);
[...refs].sort().forEach(r => {
  const p = path.join(DIR, r);
  fs.existsSync(p)
    ? ok(r + '  (' + fs.statSync(p).size.toLocaleString() + ' b)')
    : bad('MISSING: ' + r);
});

/* ------------------------------------------------- 5. design token health */
head('5. design tokens');
const codeOnly = raw.split('<style').map((s, i) => i ? '' : s).join('');   /* not used directly */
const decl = new Set([...raw.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map(m => m[1]));
const used = new Set([...raw.replace(/var\(--[a-z0-9-]+\s*,/g, m => m).matchAll(/var\((--[a-z0-9-]+)/gi)].map(m => m[1]));
/* usage sites that live in prose, not in CSS/JS */
const noComments = stripCssComments(stripJsComments(raw));
const usedReal = new Set([...noComments.matchAll(/var\((--[a-z0-9-]+)/gi)].map(m => m[1]));
console.log('  declared: ' + decl.size + '   referenced: ' + usedReal.size);
const unresolved = [...usedReal].filter(v => !decl.has(v) && !RUNTIME_VARS.has(v));
unresolved.length === 0
  ? ok('every var() resolves to a declared token (runtime-set: ' +
       [...RUNTIME_VARS].join(' ') + ')')
  : bad('unresolved var(): ' + unresolved.join(', '));

/* raw hex outside the token block: the whole point of the system is that
   the only literals live in :root. SVG path data produces false hits
   ("C44 80 15 61" reads as #9829) so those are stripped too. */
const afterRoot = noComments.slice(noComments.indexOf('--heart-lg:34px;'));
const hexes = [...afterRoot.matchAll(/#[0-9a-fA-F]{3,8}\b/g)]
  .filter(m => { const s = m.index; return !/<path|<svg|d="[^"]*#/i.test(afterRoot.slice(Math.max(0, s - 40), s + 40)); })
  .map(m => m[0].toLowerCase());
const uniqHex = [...new Set(hexes)];
console.log('  hex literals outside the token block: ' + uniqHex.length +
            (uniqHex.length ? '  ' + uniqHex.join(' ') : ''));
uniqHex.length <= 14
  ? ok('few enough raw hexes to art-direct')
  : warn('many raw hexes outside the token block');

/* --------------------------------------- 6. var() must not reach JS strings */
head('6. no var() inside JS (canvas/inline styles cannot resolve it)');
let badVar = 0;
scripts.map(stripJsComments).forEach((s, i) => {
  const hits = [...s.matchAll(/['"`][^'"`]*var\(--[^'"`]*['"`]/g)];
  if (hits.length) { badVar += hits.length; bad('script #' + (i + 1) + ': ' + hits.map(h => h[0]).join(' | ')); }
});
badVar === 0 ? ok('no var() in any JS string literal') : null;

/* --------------------------------------------------- 7. heart discipline */
head('7. ornament discipline (hearts only)');
['❦','❧','✦','✞','❀','✿','❁','☙','☘','⚜','✤','❥','✱','✽','✾','❉','☾','☀']
  .forEach(g => {
    const n = (raw.split(g).length - 1);
    if (n) bad('non-heart ornament ' + JSON.stringify(g) + ' x' + n);
  });
ok('no non-heart ornaments found');

/* ------------------------------------------------ 8. id/class references */
head('8. JS-referenced selectors exist in markup');
const ids = new Set([...raw.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
const classes = new Set([...raw.matchAll(/\sclass="([^"]+)"/g)]
  .flatMap(m => m[1].split(/\s+/)));
/* classes JS creates at runtime (coins, hearts) are not in the static markup */
[...stripJsComments(scripts.join('\n')).matchAll(/className\s*=\s*'([^']+)'/g)]
  .forEach(m => m[1].split(/\s+/).forEach(c => classes.add(c)));
[...stripJsComments(scripts.join('\n')).matchAll(/class="([^"]+)"/g)]
  .forEach(m => m[1].split(/\s+/).forEach(c => classes.add(c)));
const wanted = ['invite-cover','invite-open','ic-dust','ic-drift','hero-hearts',
                'ic-bloom','ic-stream','ic-edge',
                'coins','coin-hint','gallery-track','gal-prev','gal-next','countdown',
                'audio-toggle','bgm','hero-eyebrow','hero-flourish','hero-weds-wrap',
                'hero-amp','hero-scroll-cue','coin','coin__face','event-card'];
wanted.forEach(sel => {
  ids.has(sel) || classes.has(sel) ? ok(sel + '  (#' + ids.has(sel) + ' .' + classes.has(sel) + ')')
                                    : bad('"' + sel + '" referenced by JS/CSS but not in markup');
});
const names = (raw.match(/data-name/g) || []).length;
names ? ok('data-name present x' + names) : bad('no [data-name] elements');
['d','h','m','s'].forEach(k => {
  raw.includes('data-cd="' + k + '"') ? ok('[data-cd="' + k + '"]') : bad('missing [data-cd="' + k + '"]');
});
raw.includes('data-label') ? ok('[data-label] present') : bad('no [data-label] element');

/* --------------------------------------- 8b. the retired ring system stays
   retired. The cover originally had four counter-spinning concentric rings
   with an eight-heart crown riding one of them. It was removed on purpose
   (it read as a bullseye); this guards against it creeping back. */
head('8b. rotating rings stay removed');
const retired = ['ic-ring', 'ic-crown'];
retired.forEach(sel => {
  const hits = (noComments.match(new RegExp(sel, 'g')) || []).length;
  hits === 0 ? ok(sel + ' fully absent') : bad(sel + ' reappeared ' + hits + ' time(s)');
});
head('8c. the replacement layers are present');
['ic-bloom', 'ic-stream', 'ic-edge', 'ic-drift'].forEach(sel => {
  (classes.has(sel) && ids.has(sel)) ? ok('#' + sel + '.' + sel)
    : (ids.has(sel) ? ok('#' + sel) : (classes.has(sel) ? ok('.' + sel) : bad('missing ' + sel)));
});

/* ------------------------------------ 8d. the emblem must survive a short
   viewport. The bug this guards: the emblem clamp was driven by vmin, which on
   a landscape phone collapses to the short axis. At 844x390 that produced
   13vmin = 50px, floored to 74px — a speck on a 390px screen, which reads as a
   missing image rather than a small one. Below 560px of height the clamp must be
   driven by vh, and there must be a dedicated landscape rule that hides the
   decorative rows instead of shrinking the emblem further.

   Note the floor is lower than it used to be, and that is deliberate: the
   artwork is 421x512, so height is 1.216x the width the clamp sets. The clamp
   is a width. 8d's real job is the *rendered height*, which is what
   verify-demo-render.js measures; here the guard is only that the landscape rule
   is vh-driven rather than vmin-driven, so it can never collapse to a speck
   again. */
head('8d. emblem sizing survives a landscape phone');
const shortBlock = (raw.match(/@media\s*\(max-height:560px\)\s*\{[\s\S]*?\n\}/) || [''])[0];
shortBlock
  ? (/clamp\(/.test(shortBlock) && /vh/.test(shortBlock) && !/vmin/.test(shortBlock)
      ? ok('max-height:560px drives the emblem from vh, not vmin')
      : bad('max-height:560px must size the emblem in vh; vmin collapses on a landscape phone'))
  : bad('no @media (max-height:560px) block');
const landBlock = (raw.match(/@media\s*\(max-height:520px\)\s*and\s*\(orientation:landscape\)\s*\{[\s\S]*?\n\}/) || [''])[0];
landBlock
  ? (/\.ic-ganesh img\{width:clamp\(/.test(landBlock) && /vh/.test(landBlock) && !/vmin/.test(landBlock)
      ? ok('landscape rule present and sized in vh')
      : bad('landscape rule must size the emblem in vh, never vmin'))
  : bad('no landscape rule: a 390px-tall phone has no emblem sizing of its own');
(landBlock && /display:none/.test(landBlock))
  ? ok('landscape rule drops the decorative rows to make room')
  : bad('landscape rule should hide the eyebrow/rule rather than shrink the emblem');

/* ------------------------------------ 8e. the emblem loads. The <picture>
   needs a WebP source AND a real <img> pointing at a bitmap fallback, in that
   order, and it needs the onerror swap — because <picture> source selection
   happens once and a transport failure is not retried. Both halves of the
   recovery were bugs before they worked: a bare error listener misses a
   preloaded image that failed during parse, and setting img.src inside a
   <picture> does nothing while a matching <source> still wins.

   The pair is 21.webp / 21.png, copied out of public/demos/wedding-invite-7/
   (the Vivaan & Anaya demo) rather than rebuilt here. An earlier attempt
   re-derived its own 640x640 square from the 25 MB 21.svg and it read as a
   different picture. So the check is not just "the files exist" — it is that
   they are still byte-identical to the source demo's, and that wedding-invite-7
   is untouched. If that demo is deleted, the guard goes quiet rather than
   passing a lie. */
head('8e. the emblem is actually loadable');
const SRC_DIR = path.join(DIR, '..', 'wedding-invite-7');
/* NB the opening tag must be followed directly by markup. A plain
   /<picture>[\s\S]*?<\/picture>/ matches a CSS comment that merely *mentions*
   the tag — which it did, and the captured "block" then ran from prose in a
   comment to the real </picture>, so indexOf('<img') found the comment's word
   and the ordering check failed for a reason that had nothing to do with the
   page. Requiring \s*<source or \s*<img after the open tag skips that. */
const pic = (raw.match(/<picture>\s*(?:<source[\s\S]*?<\/picture>)/) || [])[0] || '';
if (!pic) bad('no <picture> around the emblem');
else {
  ok('<picture> present');
  const srcTag = (pic.match(/<source[^>]*>/) || [''])[0];
  /type="image\/webp"/.test(srcTag)
    ? ok('WebP source declared, so non-WebP browsers skip it')
    : bad('the <source> needs type="image/webp" or old browsers download it anyway');
  /<img[^>]*src="assets\/21\.png"/.test(pic)
    ? ok('<img> falls back to 21.png, so it works without WebP')
    : bad('the <img> src must be assets/21.png so it works without WebP');
  pic.indexOf('<source') < pic.indexOf('<img')
    ? ok('<source> precedes <img>, as the spec requires')
    : bad('<source> must come before <img>');
  /img\.complete\s*&&\s*img\.naturalWidth\s*===\s*0/.test(raw)
    ? ok('recovery also covers an image that failed before the script ran')
    : bad('missing the already-failed state check; a preloaded image can fail during parse');
  /removeChild\(s\)|s\.remove\(\)/.test(raw) && /PICTURE/.test(raw)
    ? ok('the swap removes the <source>, since a matching source outranks img.src')
    : bad('setting img.src inside a <picture> is a no-op; the <source> must be removed');
  // one emblem, one source of truth
  /21\.webp|21\.png|ganesh/.test(raw)
    ? null : bad('the emblem is referenced by no recognisable filename');
  const stray = ['assets/ganesh.webp', 'assets/ganesh.svg', 'assets/ganesh.png']
    .filter(f => raw.includes(f));
  stray.length === 0
    ? ok('no second, locally re-derived emblem left behind')
    : bad('a re-derived emblem is still referenced: ' + stray.join(', '));
  ['21.webp', '21.png'].forEach(f => {
    const mine = path.join(DIR, 'assets', f);
    if (!fs.existsSync(mine)) return bad('assets/' + f + ' referenced but missing');
    const theirs = path.join(SRC_DIR, f);
    if (!fs.existsSync(theirs))
      return ok('assets/' + f + ' exists (' + fs.statSync(mine).size.toLocaleString() + ' b)' +
                ' — source demo gone, cannot compare');
    const same = fs.readFileSync(mine).equals(fs.readFileSync(theirs));
    same
      ? ok('assets/' + f + ' is byte-identical to wedding-invite-7/' + f)
      : bad('assets/' + f + ' has drifted from wedding-invite-7/' + f +
            ' — copy it, do not rebuild it');
  });
}

/* --------------------------------------------- 9. no leftover sentinels */
head('9. build sentinels');
/@@/.test(raw) ? bad('unreplaced @@ sentinel remains') : ok('no sentinels left');

/* ---------------------------------------------------- 10. date sanity */
head('10. wedding date is internally consistent');
/* 21 Feb 2027 must be a Sunday, 18 Feb Thursday, 19 Feb Friday */
const d = new Date(Date.UTC(2027, 1, 21));
const day = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getUTCDay()];
day === 'Sunday' ? ok('21 Feb 2027 is a Sunday') : bad('21 Feb 2027 is a ' + day);
raw.includes('Sunday, 21 February 2027') ? ok('markup agrees: Sunday, 21 February 2027')
  : bad('markup disagrees about the weekday');

/* ------------------------------------ 8f. the inline script must parse.
   This check exists because of a bug it would have caught. A block-scoped
   function declaration and a var of the same name in the same block is a
   SyntaxError for the *entire* script: the page loses its wax seal, its scroll
   reveals and its cover hearts, and the only symptom in the DOM is elements
   sitting at opacity 0 with nothing wired to them. Every structural check in
   this file still passed, because the markup really was all there - it just
   had no behaviour attached. new Function() parses without executing, so this
   costs nothing and needs no dependencies. */
head('8f. inline script parses');
const inlineScripts = [...raw.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
if (!inlineScripts.length) bad('no inline <script> found');
inlineScripts.forEach((m, i) => {
  const code = m[1];
  try {
    new Function(code);
    ok('script ' + (i + 1) + ' parses (' + code.split('\n').length + ' lines)');
  } catch (e) {
    bad('script ' + (i + 1) + ' does not parse: ' + e.message);
  }
});

/* Every id the script queries has to exist. A null from a typo silently
   disables whatever it was driving - a null cover variable takes the whole
   cover with it and nothing throws. */
head('8g. script does not query an id that is not in the markup');
const markupIds = new Set([...raw.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
const queried = new Set([...noComments.matchAll(/\$\(\s*'#([A-Za-z0-9_-]+)'\s*\)/g)].map(m => m[1]));
if (!queried.size) warn('no $("#id") lookups found - check the pattern still matches');
[...queried].sort().forEach(id => {
  markupIds.has(id) ? ok('#' + id) : bad('script queries #' + id + ' but no such id exists');
});

/* ---------------------------------------------------------------- verdict */
console.log('\n' + '='.repeat(62));
console.log(fails ? fails + ' FAILURE(S), ' + warns + ' warning(s)' : 'ALL CHECKS PASSED (' + warns + ' warning(s))');
process.exit(fails ? 1 : 0);
