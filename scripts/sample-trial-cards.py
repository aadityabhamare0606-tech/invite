"""
Measures the contrast of the event-card text from captured pixels.

The palette maths said the light card grounds give 9.9-11.0:1 for the body ink,
but that was computed against the gradient stops. What the text actually sits
on is the gradient, plus an SVG motif at 0.55 alpha, plus a white bloom from
the top at 0.62 alpha, plus the ornament PNGs. No computed colour describes
that stack, so this reads the rendered pixels instead.

Method, and why:
  - the ground is the modal colour of the crop, i.e. what most of the area is
  - the glyphs are the darkest pixels in the crop
  - the headline number is the 1st-percentile-darkest pixel against the modal
    ground, NOT the single darkest pixel. The single darkest pixel of a
    screenshot crop is whichever antialiased edge happened to land hardest,
    and reporting that as "the text contrast" measures the rasteriser rather
    than the design. The 1st percentile is the stroke core, which is what a
    reader actually resolves.
  - both faces are sampled, because the cards flip and a guest reads both

Small text is held to the stricter 4.5:1 rather than being waved through on a
large-text exemption - these tags are 10-11px, and 10px is not large text by
any definition, so the exemption never applied to them in the first place.

Usage: python sample-trial-cards.py [front|back]
Reads: $TMP/opencode/shots/trial-card-<face>-*.png
"""

import glob
import os
import re
import sys
from collections import Counter

from PIL import Image

SHOTS = os.path.join(os.environ["LOCALAPPDATA"], "Temp", "opencode", "shots")

# The ink the design specifies, for cross-checking the sample.
INK = (18, 35, 58)


def srgb(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def lum(rgb):
    return 0.2126 * srgb(rgb[0]) + 0.7152 * srgb(rgb[1]) + 0.0722 * srgb(rgb[2])


def cr(a, b):
    la, lb = lum(a), lum(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


def analyse(path):
    im = Image.open(path).convert("RGB")
    px = list(im.getdata())

    # Modal ground, quantised to 4 levels per channel so a gradient plus a
    # motif plus a bloom still clusters on one dominant colour.
    quant = Counter((p[0] // 4, p[1] // 4, p[2] // 4) for p in px)
    (gr, gg, gb), _ = quant.most_common(1)[0]
    ground = (gr * 4 + 2, gg * 4 + 2, gb * 4 + 2)

    by_lum = sorted(((lum(p), p) for p in px), key=lambda t: t[0])
    n = max(1, len(by_lum) // 100)
    stroke = by_lum[n - 1][1]   # 1st-percentile darkest = the stroke core
    hardest = by_lum[0][1]     # single darkest pixel = an antialiased edge

    return {
        "size": im.size,
        "ground": ground,
        "groundIsLight": all(v > 170 for v in ground),
        "stroke": stroke,
        "hardest": hardest,
        "cr_stroke": cr(stroke, ground),
        "cr_min": cr(hardest, ground),
        "cr_ink": cr(INK, ground),
    }


def main():
    face = sys.argv[1] if len(sys.argv) > 1 else "front"
    files = sorted(glob.glob(os.path.join(SHOTS, f"trial-card-{face}-*.png")))
    if not files:
        print(f"  no {face} captures found - run probe-trial-light.js with FACE={face}")
        return 1

    print(f"  === event card text, {face} face, measured from rendered pixels ===")
    worst = 99.0
    worst_at = ""
    rows = []
    for f in files:
        m = re.search(r"-(\d+)-", os.path.basename(f))
        a = analyse(f)
        rows.append((int(m.group(1)) if m else 0, os.path.basename(f), a))
        worst_c = min(a["cr_stroke"], a["cr_ink"])
        if worst_c < worst:
            worst, worst_at = worst_c, os.path.basename(f)

    for idx, name, a in rows:
        print("")
        print("    %s  crop %dx%d" % (name, a["size"][0], a["size"][1]))
        print("      modal ground  rgb%-18s light=%s" % (str(a["ground"]), a["groundIsLight"]))
        print("      stroke core (1st pct) vs ground = %5.2f:1" % a["cr_stroke"])
        print("      darkest antialiased pixel      = %5.2f:1  (rasteriser, not the design)" % a["cr_min"])
        print("      design ink #12233A vs ground   = %5.2f:1" % a["cr_ink"])

    print("")
    print("  WORST stroke contrast across all %d runs: %.2f:1  (%s)" % (len(files), worst, worst_at))
    ok = worst >= 4.5
    print("  4.5:1 body floor -> %s" % ("PASS" if ok else "FAIL"))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
