"""Decide, numerically, whether the hero car is actually painted.

sample-emblem.py can answer that question for the Ganesha because the cover is a
single flat colour, so "not the ground" means "artwork". The car has no such
reference: it sits on the photographic hero ground at 30% opacity, with a warm
glow behind it, and the car is itself dark. Sampling it against a constant would
be meaningless, and sampling it against a bright highlight would call an
unpainted box correct.

So the reference is the pixels immediately around the box. The method:

  1. Take a ring of background just OUTSIDE the car's box, on the same rows.
     That is the ground the car is supposed to be standing on.
  2. Build a per-channel min/max/mean from that ring.
  3. Count how many pixels INSIDE the box fall outside the ring's range on any
     channel. An unpainted box is by construction inside its own background's
     range, so this count is near zero. A painted car is not.
  4. Report the ink's own bounding box, so "did it paint" and "did it paint in
     the right place" are separate answers.
  5. Also report the brightest highlight, because a car that painted as a flat
     silhouette is a different problem from one that painted as a black hole.

Usage: sample-car.py <screenshot.png> <box.json written by probe-car.js>
"""
import json
import sys
from collections import Counter
from PIL import Image


def stats(px, x, y):
    return px[x, y]


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        return 2
    shot, metaf = sys.argv[1], sys.argv[2]
    meta = json.load(open(metaf))

    im = Image.open(shot).convert("RGB")
    px = im.load()
    W, H = im.size
    b = meta["box"]
    l, t, w, h = b["left"], b["top"], b["w"], b["h"]

    print("screenshot     : %s  %dx%d" % (shot, W, H))
    print("viewport       : %s  scrollY %s" % (meta["viewport"], meta["scrollY"]))
    print("car box        : (%d,%d) %dx%d" % (l, t, w, h))
    print("car opacity    : %s   z-index %s" % (meta["opacity"], meta["zIndex"]))
    print("img            : %s  natural %s  ok=%s" %
          (meta.get("imgChosen"), meta.get("imgNatural"), meta.get("imgOk")))
    if meta.get("imgSrcset"):
        print("srcset         : %s" % meta["imgSrcset"])
        print("sizes          : %s" % meta.get("imgSizes"))

    # clamp the box into the image
    l, t = max(0, l), max(0, t)
    r, bt = min(W, l + w), min(H, t + h)
    if (l, t, r, bt) != (b["left"], b["top"], b["left"] + w, b["top"] + h):
        print("!! box clamped to (%d,%d)-(%d,%d)" % (l, t, r, bt))
    if r <= l or bt <= t:
        print("\n  CAR BOX IS OFF-SCREEN. Nothing was measured.")
        return 1

    # ---- 1. background ring: a band above the box, same columns -------------
    band_h = max(12, min(60, t))
    ring_top = max(0, t - band_h)
    samples = []
    for y in range(ring_top, t, 2):
        for x in range(l, r, 4):
            samples.append(px[x, y])
    if len(samples) < 30:
        print("\n  not enough background above the box to compare against")
        return 1
    lo = [min(s[c] for s in samples) for c in range(3)]
    hi = [max(s[c] for s in samples) for c in range(3)]
    mean = [sum(s[c] for s in samples) / len(samples) for c in range(3)]
    print("\n-- the ground the car should stand on (band above the box) --")
    print("  sampled        : %d px" % len(samples))
    print("  channel range  : R %d..%d  G %d..%d  B %d..%d" %
          (lo[0], hi[0], lo[1], hi[1], lo[2], hi[2]))
    print("  mean           : rgb(%.0f, %.0f, %.0f)" % tuple(mean))
    spread = max(hi[c] - lo[c] for c in range(3))
    print("  spread         : %d  (a busy background needs a wider allowance)" % spread)
    # allow a little for the ground's own gradient plus the warm glow
    tol = max(10, spread // 2 + 8)

    # ---- 2. inside the box -------------------------------------------------
    inside = 0
    outside = 0
    ink_box = None
    brightest = 0
    darks = 0
    tones = Counter()
    step = 2
    counted = 0
    for y in range(t, bt, step):
        for x in range(l, r, step):
            counted += 1
            c = px[x, y]
            if all(lo[k] - tol <= c[k] <= hi[k] + tol for k in range(3)):
                inside += 1
                continue
            outside += 1
            if ink_box is None:
                ink_box = [x, y, x, y]
            else:
                ink_box[0] = min(ink_box[0], x); ink_box[1] = min(ink_box[1], y)
                ink_box[2] = max(ink_box[2], x); ink_box[3] = max(ink_box[3], y)
            lum = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
            brightest = max(brightest, lum)
            if lum < 30:
                darks += 1
            tones[(c[0] // 32 * 32, c[1] // 32 * 32, c[2] // 32 * 32)] += 1

    pct = 100.0 * outside / counted
    print("\n-- inside the car's box --")
    print("  sampled        : %d px" % counted)
    print("  matches ground : %6.1f%%" % (100.0 * inside / counted))
    print("  differs        : %6.1f%%   <-- the car" % pct)
    if ink_box:
        iw = ink_box[2] - ink_box[0] + 1
        ih = ink_box[3] - ink_box[1] + 1
        # NB the four values are left, top, right, bottom. Written as
        # "x %d..%d  y %d..%d" the format consumes them in pairs, which prints
        # left..top then right..bottom - a box that straddles the origin and
        # looks like it escaped the sampling window entirely.
        print("  ink bbox       : left %d  top %d  right %d  bottom %d  (w %d  h %d)" %
              (ink_box[0], ink_box[1], ink_box[2], ink_box[3], iw, ih))
        print("  fills          : %.0f%% of box width, %.0f%% of box height" %
              (100.0 * iw / (r - l), 100.0 * ih / (bt - t)))
    else:
        print("  ink bbox       : none - every pixel matched the ground")
    print("  brightest lum  : %.0f" % brightest)
    print("  very dark px   : %d  (lum < 30, %.1f%% of the car)" %
          (darks, 100.0 * darks / max(outside, 1)))

    if tones:
        tot = sum(tones.values())
        print("\n-- dominant car tones --")
        for c, k in tones.most_common(6):
            lum = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
            print("  rgb%-16s lum %5.0f  %5.1f%%" % (str(c), lum, 100.0 * k / tot))

    print("\n-- verdict --")
    if pct < 8:
        print("  THE CAR IS NOT PAINTED. Its box is indistinguishable from the ground")
        print("  beside it, so the <img> decoded but nothing drew.")
        print("  Check opacity, filter, and whether an ancestor is clipping it.")
        return 1
    if not meta.get("imgOk"):
        print("  THE CAR IMAGE NEVER LOADED. The painted area must be the glow only.")
        return 1
    if ink_box and (ink_box[2] - ink_box[0] + 1) < (r - l) * 0.45:
        print("  SOMETHING PAINTED, BUT NOT A CAR. The ink covers under half the box")
        print("  width - that is the warm glow, not artwork.")
        return 1
    if brightest < 40:
        print("  PAINTED, BUT AS A FLAT BLACK SHAPE. No pixel clears luminance 40,")
        print("  so there is no light in it - check opacity and the drop-shadow.")
        return 1
    print("  THE CAR IS PAINTED AND READS AS ARTWORK.")
    print("  %.1f%% of the box differs from its surroundings," % pct)
    if ink_box:
        print("  the ink spans %.0f%% of the box width," % (100.0 * (ink_box[2] - ink_box[0] + 1) / (r - l)))
    print("  and the brightest pixel reaches luminance %.0f." % brightest)
    return 0


if __name__ == "__main__":
    sys.exit(main())
