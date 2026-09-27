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

/* ---------------------------------------------------------------- verdict */
console.log('\n' + '='.repeat(62));
console.log(fails ? fails + ' FAILURE(S), ' + warns + ' warning(s)' : 'ALL CHECKS PASSED (' + warns + ' warning(s))');
process.exit(fails ? 1 : 0);
