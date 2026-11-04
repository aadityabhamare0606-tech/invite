import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "assets", "demos");
mkdirSync(OUT, { recursive: true });

// Each preview: 1200x800, matching the selected live demo's palette and mood.
const cards = [
  {
    file: "memories-family-story.webp",
    bg1: "#fbf7ef", bg2: "#efe2c8", ink: "#2a2019", accent: "#b9863f",
    kicker: "A LIVING FAMILY ARCHIVE", title: "Every family has a story", sub: "Stories · Portraits · Voices",
  },
  {
    file: "memories-family-story-3.webp",
    bg1: "#f4f1e8", bg2: "#d7e0c8", ink: "#22301f", accent: "#4f7a48",
    kicker: "THE FAMILY TREE", title: "Rooted in one another", sub: "Tap a name. Discover a story.",
  },
  {
    file: "memories-wedding-memories.webp",
    bg1: "#fdf7f3", bg2: "#f8dbe6", ink: "#3a2b2f", accent: "#c2185b",
    kicker: "THE WEDDING GUESTBOOK", title: "A day, told by everyone", sub: "Photos · Wishes · Voice notes",
  },
  {
    file: "memories-wedding-memories-3.webp",
    bg1: "#141210", bg2: "#2a2118", ink: "#f2ece1", accent: "#e0a850",
    kicker: "THE WEDDING FILM ROLL", title: "Keep the in-between", sub: "14 frames · one beautiful blur",
  },
  {
    file: "memories-time-capsule.webp",
    bg1: "#f7f4fb", bg2: "#e0d6f2", ink: "#2f2740", accent: "#6d4aa8",
    kicker: "LETTERS TO TOMORROW", title: "A note across time", sub: "Write today · open when it matters",
  },
  {
    file: "memories-time-capsule-3.webp",
    bg1: "#f0e6d2", bg2: "#e2cba6", ink: "#3a2a1c", accent: "#a63a34",
    kicker: "THE HEIRLOOM LETTER BOX", title: "Sealed with love", sub: "A little wonder, saved for later",
  },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

for (const c of cards) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c.bg1}"/>
      <stop offset="1" stop-color="${c.bg2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="18%" r="60%">
      <stop offset="0" stop-color="${c.accent}" stop-opacity="0.22"/>
      <stop offset="1" stop-color="${c.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#g)"/>
  <rect width="1200" height="800" fill="url(#glow)"/>

  <!-- soft decorative cards -->
  <g opacity="0.9">
    <rect x="120" y="250" width="150" height="200" rx="10" fill="${c.bg1}" stroke="${c.accent}" stroke-opacity="0.28" transform="rotate(-8 195 350)"/>
    <rect x="930" y="250" width="150" height="200" rx="10" fill="${c.bg1}" stroke="${c.accent}" stroke-opacity="0.28" transform="rotate(8 1005 350)"/>
  </g>

  <!-- frame -->
  <rect x="60" y="60" width="1080" height="680" rx="26" fill="none" stroke="${c.accent}" stroke-opacity="0.35" stroke-width="2"/>

  <!-- kicker pill -->
  <rect x="470" y="200" width="260" height="44" rx="22" fill="${c.bg1}" stroke="${c.accent}" stroke-opacity="0.45"/>
  <text x="600" y="229" text-anchor="middle" font-family="Georgia, serif" font-size="15" letter-spacing="4" fill="${c.accent}">${esc(c.kicker)}</text>

  <!-- title -->
  <text x="600" y="360" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="78" font-weight="600" fill="${c.ink}">${esc(c.title)}</text>

  <!-- divider -->
  <line x1="520" y1="405" x2="680" y2="405" stroke="${c.accent}" stroke-width="2" stroke-opacity="0.6"/>

  <!-- subtitle -->
  <text x="600" y="455" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="${c.ink}" opacity="0.6">${esc(c.sub)}</text>

  <!-- bottom brand -->
  <text x="600" y="655" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="16" letter-spacing="6" fill="${c.accent}" opacity="0.85">OURMOMENT</text>
</svg>`;

  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(join(OUT, c.file));
  console.log("made", c.file);
}
console.log("done");
