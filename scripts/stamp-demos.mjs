/**
 * Stamps a content hash onto the hand-edited stylesheet/script references of
 * every non-built demo, so an edited demo asset is always fetched from a NEW
 * url.
 *
 * Why this exists: `public/demos/demo-9/index.html` references `styles.css`
 * and `script.js` with no version query. An HTTP cache keys on the bare path,
 * so hand-editing a demo and reloading can serve day-old CSS against fresh
 * markup. Tying the query to the file's own bytes makes the edit and the fetch
 * inseparable - change the file, change the url, get the new bytes.
 *
 * Deliberately narrow, because a broad stamp causes more harm than good here:
 *   - only <link rel=stylesheet href=*.css> and <script src=*.js>
 *     (images/media are served with a long cache and are never hand-edited)
 *   - skips filenames that already carry a build hash (index-BMskiZWE.css),
 *     since those change name on every build and need no help
 *   - skips remote, protocol-relative, data:, and inline references
 *
 * Idempotent: an already-correct reference is left byte-for-byte alone, so
 * running this with nothing changed does not churn git. Wired to `predev` so
 * it runs on every `npm run dev`; `npm run stamp` runs it on demand.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEMOS = join(ROOT, "public", "demos");

/** Already content-hashed by the build (Vite/Rollup emit `name-HASH.ext`). */
const HAS_BUILD_HASH = /-[A-Za-z0-9_-]{8,}\.[a-z0-9]+$/i;

const isLocal = (href) =>
  Boolean(href) &&
  !/^([a-z][a-z0-9+.-]*:)?\/\//i.test(href) && // http:, https:, //cdn...
  !/^(data|#|mailto:|tel|javascript):/i.test(href);

/** Drop any existing ?v= / &v= so the hash is always freshly derived. */
const stripVersion = (href) =>
  href
    .replace(/[?&]v=[^&#]*/, "")
    .replace(/[?&]$/, "")
    .replace(/\?$/, "");

const shortHash = (absPath) =>
  createHash("sha1").update(readFileSync(absPath)).digest("hex").slice(0, 8);

/** Resolve a demo-relative reference to a real file inside public/demos. */
function resolveLocal(htmlFile, href) {
  const clean = stripVersion(href.split(/[?#]/)[0]);
  if (!clean || HAS_BUILD_HASH.test(clean)) return null;
  // stay inside public/demos so a crafted doc can't reach elsewhere on disk
  const abs = resolve(dirname(htmlFile), clean.replace(/^\/+/, ""));
  if (!abs.startsWith(DEMOS)) return null;
  try {
    return statSync(abs).isFile() ? abs : null;
  } catch {
    return null;
  }
}

// Only the two reference kinds that actually go stale: stylesheets and scripts.
const STYLESHEET = /(<link\b[^>]*?\brel\s*=\s*["']?stylesheet["']?[^>]*?\bhref\s*=\s*)(["'])([^"']+)\2/gi;
const SCRIPT = /(<script\b[^>]*?\bsrc\s*=\s*)(["'])([^"']+)\2/gi;

let filesChanged = 0;
let refsStamped = 0;

let entries = [];
try {
  entries = readdirSync(DEMOS, { withFileTypes: true });
} catch {
  console.error("[stamp-demos] public/demos not found - nothing to do");
  process.exit(0);
}

for (const dir of entries) {
  if (!dir.isDirectory()) continue;
  const htmlPath = join(DEMOS, dir.name, "index.html");

  let html;
  try {
    html = readFileSync(htmlPath, "utf8");
  } catch {
    continue; // no index.html here - not a demo page
  }

  let mutated = false;
  let countForFile = 0;

  const rewrite = (match, prefix, quote, href) => {
    if (!isLocal(href)) return match;
    const abs = resolveLocal(htmlPath, href);
    if (!abs) return match;

    const v = shortHash(abs);
    const current = /[?&]v=([0-9a-f]+)/.exec(href);
    if (current && current[1] === v) return match; // already current - no write

    const base = stripVersion(href);
    mutated = true;
    countForFile++;
    return `${prefix}${quote}${base}${base.includes("?") ? "&" : "?"}v=${v}${quote}`;
  };

  let next = html.replace(STYLESHEET, rewrite);
  next = next.replace(SCRIPT, rewrite);

  if (mutated) {
    writeFileSync(htmlPath, next, "utf8");
    filesChanged++;
    refsStamped += countForFile;
    console.log(`[stamp-demos] ${dir.name}/index.html  ->  ${countForFile} reference(s)`);
  }
}

console.log(
  filesChanged === 0
    ? "[stamp-demos] every demo stylesheet/script reference is already current"
    : `[stamp-demos] ${filesChanged} file(s) updated, ${refsStamped} reference(s) stamped`
);
