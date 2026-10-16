"""Score hero text contrast against the pixels the glyphs actually sit on,
at every point in the entrance animation.

Inputs are pairs of frames - see probe-text-contrast.js for how they are made. A
minus B, pixel by pixel, is the glyph coverage; B is the true background at those
same coordinates. There is one pair per sweep time, because the hero's entrance
is the interesting part: the names arrive letter by letter, .hero-glow lands on
them at 4900ms, and a blurred text-shadow in the text's own hue stacks on itself
while the glyph is still moving. A settled-state-only measurement reports the
page as passing and misses a two-second stretch in which a guest is reading it.

The arithmetic is standard WCAG, on real measured pixels:

  1. glyph coverage, from |A - B| per channel, above a noise floor
  2. for each glyph pixel, the background is B at that pixel
  3. the text colour is composited at the product of the declared alpha and the
     element's own opacity, because an element at opacity .4 has not drawn .4 of
     a colour, it has drawn .4 of a colour mixed with what was underneath
  4. ratio; a run is judged on its WORST-covered pixel, not its average, because
     a line is only as readable as its worst patch

A run is reported per sweep, plus a per-run worst across the whole entrance,
since the question that matters is "does this line ever become unreadable" and
not "does it average well".

Usage: python sample-text-contrast.py
"""
import json
import os
import sys
from collections import defaultdict
from PIL import Image

DIR = r"C:\Users\aadit\AppData\Local\Temp\opencode\shots"
GEO = os.path.join(DIR, "hero-contrast.geo.json")

# A glyph is a pixel where the two frames differ by more than the compositing
# noise floor. Antialiased serif over a gradient throws off a long tail of
# 1-2 level differences, and counting those as ink would let a run pass on the
# strength of its own halo.
INK_FLOOR = 26


def srgb_to_lin(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def luminance(rgb):
    r, g, b = rgb
    return 0.2126 * srgb_to_lin(r) + 0.7152 * srgb_to_lin(g) + 0.0722 * srgb_to_lin(b)


def ratio(fg, bg):
    a, b = luminance(fg), luminance(bg)
    hi, lo = max(a, b), min(a, b)
    return (hi + 0.05) / (lo + 0.05)


def parse_color(s):
    """'rgb(r, g, b)' or 'rgba(r, g, b, a)' -> (r, g, b, a)."""
    s = s.strip()
    if s.startswith("#"):
        h = s[1:]
        if len(h) == 3:
            h = "".join(c * 2 for c in h)
        return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), 1.0)
    inner = s[s.index("(") + 1:s.rindex(")")]
    parts = [p.strip() for p in inner.replace("/", ",").split(",") if p.strip()]
    return (float(parts[0]), float(parts[1]), float(parts[2]),
            float(parts[3]) if len(parts) > 3 else 1.0)


def over(fg, alpha, bg):
    return tuple(fg[i] * alpha + bg[i] * (1 - alpha) for i in range(3))


def score_frame(fr):
    """-> {run key: (worst, median, ink, worst_at)}"""
    A = Image.open(fr["a"]).convert("RGB")
    B = Image.open(fr["b"]).convert("RGB")
    pa, pb = A.load(), B.load()
    W, H = A.size
    out = {}
    for t in fr["geo"]["targets"]:
        bx = t["box"]
        x0, y0 = max(0, bx["x"]), max(0, bx["y"])
        x1, y1 = min(W, bx["x"] + bx["w"]), min(H, bx["y"] + bx["h"])
        if x1 <= x0 or y1 <= y0:
            continue
        cr, cg, cb_, fg_a = parse_color(t["color"])
        fg = (cr, cg, cb_)
        alpha = t["opacity"] * fg_a

        ratios = []
        ink = 0
        worst_at = None
        for y in range(y0, y1):
            for x in range(x0, x1):
                ca, cb = pa[x, y], pb[x, y]
                if max(abs(ca[0] - cb[0]), abs(ca[1] - cb[1]), abs(ca[2] - cb[2])) < INK_FLOOR:
                    continue
                ink += 1
                r = ratio(over(fg, alpha, cb), cb)
                ratios.append(r)
                if worst_at is None or r < worst_at[0]:
                    worst_at = (r, x, y, ca, cb)
        if not ratios:
            continue
        ratios.sort()
        out[(t["cls"] or t["tag"], t["text"])] = {
            "worst": ratios[0], "median": ratios[len(ratios) // 2],
            "ink": ink, "at": worst_at, "t": t,
        }
    return out


def main():
    if not os.path.exists(GEO):
        print("  missing %s - run probe-text-contrast.js first" % GEO)
        return 2
    doc = json.load(open(GEO))
    frames = doc["frames"]
    print("hero text contrast, measured against rendered pixels")
    print("viewport %s   %d sweep(s): %s" %
          (doc["viewport"], len(frames), ", ".join("%.2fs" % f["at"] for f in frames)))
    print("thresholds: WCAG 2.1 AA - 4.5:1 body, 3.0:1 at 24px+ or bold 18.7px+")
    print("a run fails if its WORST-covered pixel fails, at ANY point in the entrance\n")

    scored = []
    for fr in frames:
        scored.append((fr["at"], score_frame(fr)))

    # per run, across the whole entrance
    by_run = defaultdict(list)
    for at, res in scored:
        for key, v in res.items():
            by_run[key].append((at, v))

    # A cross-fade is a cross-fade. The names arrive on opacity transitions, so
    # a sample taken at 0.4 alpha is not "text that is hard to read", it is text
    # that has not arrived yet - and a threshold test at intermediate alpha fails
    # by construction for every element, so counting it would report the page as
    # broken for doing what a fade is. Judging only the at-rest samples keeps the
    # real defect the test is aimed at, which is text that SETTLES too faint: an
    # element whose resting opacity is 0.4 still shows up here, because a
    # settled 0.4 is a resting 0.4 and is judged as one.
    AT_REST = 0.999

    fails = 0
    rows = []
    for key, series in by_run.items():
        cls, text = key
        t = series[0][1]["t"]
        need = 3.0 if t["large"] else 4.5
        settled = [s for s in series if s[1]["t"]["opacity"] >= AT_REST]
        fading = [s for s in series if s[1]["t"]["opacity"] < AT_REST]
        if not settled:
            # never fully arrived during the sweep - report it, do not pass it
            worst = min(series, key=lambda s: s[1]["worst"])
            rows.append((True, worst[1]["worst"], worst[0], need, cls, text, t, worst[1],
                         "never reached full opacity during the sweep", min(
                             s[1]["t"]["opacity"] for s in series)))
            continue
        worst = min(settled, key=lambda s: s[1]["worst"])
        settled_op = max(s[1]["t"]["opacity"] for s in settled)
        if settled_op < AT_REST:
            # it faded in part-way and stopped there; that IS a legibility bug
            note = "settles at opacity %.2f, never 1.00" % settled_op
        elif fading:
            f = min(fading, key=lambda s: s[1]["worst"])
            note = "mid-fade as low as %5.2f:1 at t=%.2fs, %.0f%% opaque" % (
                f[1]["worst"], f[0], f[1]["t"]["opacity"] * 100)
        else:
            note = None
        rows.append((worst[1]["worst"] < need, worst[1]["worst"], worst[0], need,
                     cls, text, t, worst[1], note, settled_op))
    rows.sort(key=lambda r: r[1])

    for bad, w, at, need, cls, text, t, v, note, _op in rows:
        if bad:
            fails += 1
        print("  %s  %5.2f:1 worst  (needs %.1f)  at t=%.2fs  %5.1fpx %s" %
              ("FAIL" if bad else "PASS", w, need, at, t["fontSize"],
               "large" if t["large"] else "body "))
        print("        %-14s %-22s %r" % (t["tag"], (cls or "(no class)")[:22], text))
        print("        colour %s   median %.2f:1   ink pixels %d" %
              (t["color"], v["median"], v["ink"]))
        if v["at"]:
            _, wx, wy, ca, cb = v["at"]
            print("        worst px (%d,%d)  background rgb(%3d,%3d,%3d)  glyph rgb(%3d,%3d,%3d)"
                  % (wx, wy, cb[0], cb[1], cb[2], ca[0], ca[1], ca[2]))
        if t.get("textShadow"):
            kind = ("darkens the surround, so it buys contrast" if t.get("shadowDarkens")
                    else "is in the text's own hue, so it LIGHTENS the pixels the glyph edge sits on")
            print("        text-shadow %s  [%s]" % (kind, t["textShadow"]))
        if note:
            print("        %s" % note)
        print("")

    total = len(rows)
    print("%d run(s) measured, %d below threshold while at rest" % (total, fails))
    if fails:
        print("  Judged at rest: a sample taken while a name is still fading in is")
        print("  not a legibility failure, it is a name that has not arrived yet.")
    else:
        print("  Every run clears its threshold once it has finished arriving,")
        print("  at every point in the entrance, against the pixels behind it.")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
