"""Decide, numerically, whether the hero moon is actually painted as a crescent.

The failure this guards against is the one no other check on this page can see.

The moon's eight colours were moved out of stop-color attributes and into :root,
applied from CSS. That is the correct move for a design system that claims no
literals live outside its token block. But it creates a new way for the moon to
break: an unapplied stop-color rule leaves the stop at its initial value, black.
A black crescent on a #0C091B..#15102B sky is not a failed image. It decodes,
it occupies a correct box, it raises no console error, and it is invisible. A
screenshot reviewed by eye at thumbnail size would call that page fine.

So the moon needs a pixel proof, and the proof is two questions:

  1. Is the box painted warm? A crescent is gold, so the pixels that differ
     from the sky must be WARM - red channel above blue. If the gradient stops
     had failed, what would differ from the sky would be the earthshine disc,
     which is a dark blue-violet: blue at or above red. Measuring the hue
     separates "the moon is there" from "the moon is there but it is the
     unlit half we can see", which are very different bugs.

  2. Is it a crescent and not a disc?

On (2), the geometry needs saying out loud, because the obvious test is wrong
and this script's first version got it wrong. The mask is

    M100,14 A86,86 0 0 1 100,186 A79.98,86 0 0 0 100,14 Z

The endpoints are diametrically opposite on the r=86 circle, so the first arc
is that circle's right half. The second arc is an ellipse with rx=79.98, ry=86
spanning the same two points: both curves pass through them, so they agree at
top and bottom and can only differ in the middle, by at most 6.02 units. So the
lit region is a 6-unit sliver hugging one side of a 172-unit disc - about 3.5%
of the disc's area. Measured on wedding-invite-7, whose mask is character-for-
character the same, the filled area is 3,235 px of a 92,948 px disc, 12px wide
at its equator on a 400px raster, pinching to 2px at both poles, offset to the
right of centre. This is not a fat lune; it is a hairline crescent, and it is
deliberate.

The consequences for this script are the whole point:

  - A disc-fills-the-box test PASSES A BUG. A full gold circle is exactly what
    you get if the mask fails to apply, and it is the opposite of correct.
  - A "is the middle of the box gold" test also passes a bug, and worse, it
    fails the real thing: the sliver lives at about 91% across the disc, so
    the middle 60% of the box is almost entirely the unlit earthshine. The
    first version of this script measured the core, read 7% warm, and reported
    a healthy moon as broken.
  - So the lit region is measured on its own. Warm pixels are bucketed
    separately from the earthshine, and the crescent is then judged on the
    brighter of the two, because the gold drop-shadow is warm too and swamps
    the box if hue is the only test. The crescent is judged on shape: bowed,
    full height, and pushed to one side. The earthshine is judged on being
    broad and centred.
  - And a crescent's bounding box is much wider than its waist, so the width
    test is set at 60% of the box, not at the 3.5%-of-disc-area figure. The
    reference's own crescent is 138px across a 344px disc - 40% - while being
    only 12px at its thickest. Testing against the waist would reject the
    correct moon.

Usage: sample-moon.py <screenshot.png> <box.json written by probe-moon.js>
"""
import json
import sys
from collections import Counter
from PIL import Image


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
    print("moon box       : (%d,%d) %dx%d" % (l, t, w, h))
    print("opacity        : %s   z-index %s   display %s" %
          (meta["opacity"], meta["zIndex"], meta["display"]))

    print("\n-- do the tokens reach the stops? --")
    stops = meta.get("stops") or []
    black = [s for s in stops if s["stopColor"] in ("rgb(0, 0, 0)", "black", "#000")]
    for s in stops:
        print("  offset %-6s -> %s" % (s["offset"], s["stopColor"]))
    print("  mask path length : %s px" % meta.get("maskPathLength"))
    print("  lit circle       : fill=%s mask=%s" % (meta.get("litFill"), meta.get("litMask")))
    print("  craters / rim    : %s / %s" % (meta.get("cratersFill"), meta.get("rimStroke")))

    # clamp the box into the image
    l, t = max(0, l), max(0, t)
    r, bt = min(W, l + w), min(H, t + h)
    if r <= l or bt <= t:
        print("\n  MOON BOX IS OFF-SCREEN. Nothing was measured.")
        return 1

    # ---- 1. the sky, from the same rows but well to either side -------------
    # NOT from a band above the box. The first version of this script did that
    # and got a sky whose red channel ranged 14..111, which is not a sky: the
    # moon carries drop-shadow(0 0 60px) gold, so a band sitting inside the
    # halo measures the moon's own glow. With a tolerance derived from that
    # range the whole box "matched" and the probe reported 0.0% painted on a
    # moon that is plainly there.
    #
    # The sky is a vertical gradient with two centred radial washes on it, so
    # it is very nearly constant across a few hundred horizontal pixels at a
    # given row. Sampling the same rows 30-90px out to each side therefore
    # estimates the sky at the moon accurately while staying clear of the halo,
    # which is a circle centred on the box and has fallen off a long way by 30px.
    left_lo = max(0, l - 90)
    left_hi = max(0, l - 30)
    right_lo = min(W, r + 30)
    right_hi = min(W, r + 90)
    samples = []
    for y in range(t, bt, 2):
        for x in list(range(left_lo, left_hi, 2)) + list(range(right_lo, right_hi, 2)):
            samples.append(px[x, y])
    if len(samples) < 60:
        print("\n  not enough sky beside the box to compare against")
        return 1

    def pct(vals, q):
        s = sorted(vals)
        return s[max(0, min(len(s) - 1, int(round(q * (len(s) - 1)))))]
    lo = [pct([s[c] for s in samples], 0.02) for c in range(3)]
    hi = [pct([s[c] for s in samples], 0.98) for c in range(3)]
    mean = [sum(s[c] for s in samples) / len(samples) for c in range(3)]
    print("\n-- the sky the moon should hang in (same rows, 30-90px out to each side) --")
    print("  sampled        : %d px" % len(samples))
    print("  2nd..98th pct  : R %d..%d  G %d..%d  B %d..%d" %
          (lo[0], hi[0], lo[1], hi[1], lo[2], hi[2]))
    print("  mean           : rgb(%.0f, %.0f, %.0f)" % tuple(mean))
    print("  (mean is blue-led: R %d < B %d, which is the night, not the moon)"
          % (mean[0], mean[2]))
    spread = max(hi[c] - lo[c] for c in range(3))
    tol = max(10, spread + 10)
    print("  tolerance      : %d per channel" % tol)

    # ---- 2. inside the box -------------------------------------------------
    # Three buckets, not two. "Warm" alone is not enough, because the moon
    # carries drop-shadow(0 0 26px rgba(198,161,91,.28)) and
    # drop-shadow(0 0 60px rgba(198,161,91,.12)). That halo is gold, so warm
    # pixels sprawl across nearly the whole box and the first version of this
    # script read the lit region as 89% of the box width - and would have
    # called a failed mask on a perfectly good moon.
    #
    # Hue separates the earthshine (blue-led) from anything gold. Luminance
    # then separates the crescent from the halo. The halo is 12-28% gold over
    # a near-black sky, which lands somewhere around luminance 25-60; the
    # crescent's own gradient runs #FFF7DC (about 245) down to #9F7D4A (about
    # 135) at the limb. So there is a wide empty band between them and the
    # split is not delicate. LIT_LUM is set at 85, below the crescent's dimmest
    # gold and above the halo's brightest, and the histogram below prints both
    # sides so the margin is visible rather than asserted.
    LIT_LUM = 85
    inside = outside = 0
    warm = cool = lit = 0
    ink = litbox = coolbox = None
    brightest = 0
    tones = Counter()
    warm_lums = []
    counted = 0
    for y in range(t, bt, 2):
        for x in range(l, r, 2):
            counted += 1
            c = px[x, y]
            if all(lo[k] - tol <= c[k] <= hi[k] + tol for k in range(3)):
                inside += 1
                continue
            outside += 1
            lum = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
            brightest = max(brightest, lum)
            if ink is None:
                ink = [x, y, x, y]
            else:
                ink[0] = min(ink[0], x); ink[1] = min(ink[1], y)
                ink[2] = max(ink[2], x); ink[3] = max(ink[3], y)
            is_warm = c[0] > c[2]
            if is_warm:
                warm += 1
                warm_lums.append(lum)
                if lum >= LIT_LUM:
                    lit += 1
                    if litbox is None:
                        litbox = [x, y, x, y]
                    else:
                        litbox[0] = min(litbox[0], x); litbox[1] = min(litbox[1], y)
                        litbox[2] = max(litbox[2], x); litbox[3] = max(litbox[3], y)
            else:
                cool += 1
                if coolbox is None:
                    coolbox = [x, y, x, y]
                else:
                    coolbox[0] = min(coolbox[0], x); coolbox[1] = min(coolbox[1], y)
                    coolbox[2] = max(coolbox[2], x); coolbox[3] = max(coolbox[3], y)
            tones[(c[0] // 32 * 32, c[1] // 32 * 32, c[2] // 32 * 32)] += 1

    def report(name, bx):
        if not bx:
            print("  %-9s : none" % name)
            return None
        bw = bx[2] - bx[0] + 1
        bh = bx[3] - bx[1] + 1
        gap_l = bx[0] - l
        gap_r = (r - 1) - bx[2]
        print("  %-9s : left %d top %d right %d bottom %d  (w %d  h %d)" %
              (name, bx[0], bx[1], bx[2], bx[3], bw, bh))
        print("  %-9s   fills %.0f%% of box width, %.0f%% of height; "
              "gap to left edge %dpx, to right edge %dpx" %
              ("", 100.0 * bw / (r - l), 100.0 * bh / (bt - t), gap_l, gap_r))
        return {"w": bw, "h": bh, "gapL": gap_l, "gapR": gap_r,
                "wPct": 100.0 * bw / (r - l), "hPct": 100.0 * bh / (bt - t)}

    pct = 100.0 * outside / counted
    print("\n-- inside the moon's box --")
    print("  sampled        : %d px" % counted)
    print("  matches sky    : %6.1f%%" % (100.0 * inside / counted))
    print("  differs        : %6.1f%%   <-- earthshine + crescent + halo" % pct)
    if ink:
        iw = ink[2] - ink[0] + 1
        ih = ink[3] - ink[1] + 1
        print("  ink bbox       : left %d  top %d  right %d  bottom %d  (w %d  h %d)" %
              (ink[0], ink[1], ink[2], ink[3], iw, ih))
        print("  fills          : %.0f%% of box width, %.0f%% of box height" %
              (100.0 * iw / (r - l), 100.0 * ih / (bt - t)))
    else:
        print("  ink bbox       : none - every pixel matched the sky")
    print("\n-- the two halves, judged separately --")
    cres = report("crescent", litbox)
    disc = report("earthshine", coolbox)
    print("  brightest lum  : %.0f   (gold at the lit pole reaches ~245)" % brightest)
    print("  warm / cool    : %d / %d" % (warm, cool))
    if warm_lums:
        warm_lums.sort()
        n = len(warm_lums)
        print("  warm luminance : min %.0f  p25 %.0f  median %.0f  p75 %.0f  max %.0f"
              % (warm_lums[0], warm_lums[n // 4], warm_lums[n // 2],
                 warm_lums[3 * n // 4], warm_lums[-1]))
        print("  split at lum %d -> %d px crescent, %d px halo"
              % (LIT_LUM, lit, warm - lit))
        print("  (the gap is the point: a split inside the spread would be arbitrary)")

    if tones:
        tot = sum(tones.values())
        print("\n-- dominant moon tones --")
        for c, k in tones.most_common(6):
            lum = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
            tag = "warm" if c[0] > c[2] else "cool"
            print("  rgb%-16s lum %5.0f  %5.1f%%  %s" % (str(c), lum, 100.0 * k / tot, tag))

    print("\n-- verdict --")
    if black:
        print("  THE STOP-COLOR RULES DID NOT APPLY. Stops at %s" %
              ", ".join(s["offset"] for s in black))
        print("  resolve to black, so the lit gradient has no colour. The moon does")
        print("  not look broken - it looks absent, which is worse.")
        return 1
    if pct < 8:
        print("  THE MOON IS NOT PAINTED. Its box is indistinguishable from the sky")
        print("  beside it.")
        return 1
    if not ink:
        print("  NOTHING WAS MEASURED.")
        return 1
    if not cres:
        print("  PAINTED, BUT ONLY THE UNLIT HALF. Not one differing pixel is warm, so")
        print("  what is on screen is the earthshine disc alone. The lit crescent is")
        print("  missing, or hidden behind it. Check that the lit circle is drawn")
        print("  AFTER the earthshine circle and still carries its mask.")
        return 1
    if brightest < 100:
        print("  THE CRESCENT IS THERE BUT DIM. Brightest pixel is luminance %.0f;" % brightest)
        print("  gold at this size should reach ~180. Check opacity and the drop-shadow.")
        return 1
    if cres["wPct"] > 60:
        print("  THE LIT REGION IS TOO WIDE. It spans %.0f%% of the box." % cres["wPct"])
        print("  60% is the line, and it comes from the reference: on wedding-invite-7")
        print("  the lit region is 138px of a 344px disc, so 40% of the diameter, and")
        print("  a crescent is bowed - its bounding box is far wider than its 12px")
        print("  waist. Past 60% you are looking at a full disc, which is what a")
        print("  missing mask gives you, and it is the opposite of correct.")
        return 1
    if cres["hPct"] < 70:
        print("  THE CRESCENT DOES NOT RUN THE FULL HEIGHT. It spans %.0f%% of the box;" % cres["hPct"])
        print("  a crescent whose mask is working reaches from pole to pole, pinching")
        print("  to almost nothing at each end but still present throughout.")
        return 1
    # One-sided means ONE gap is large, not that both are small. Reading this
    # as min(gap) is wrong and was wrong here first time round: a crescent
    # hugging the right edge has gaps of about 84px and 10px, so min(gap) is
    # small by construction and the test fired on a healthy moon. What
    # distinguishes a crescent from a disc is that the two gaps are unequal.
    if min(cres["gapL"], cres["gapR"]) > (r - l) * 0.22:
        print("  THE LIT REGION IS SYMMETRIC. Gaps to the box edges are %d and %d px"
              % (cres["gapL"], cres["gapR"]))
        print("  out of a %dpx box, so it straddles the middle instead of hugging one" % (r - l))
        print("  side. That is the shape of a disc, not of a masked crescent.")
        return 1
    if meta.get("maskPathLength") in (None, 0):
        print("  THE MASK PATH IS MISSING OR DEGENERATE, so the crescent cannot form.")
        return 1
    if disc and disc["wPct"] < 50:
        print("  THE UNLIT DISC IS MISSING. Cool pixels span only %.0f%% of the box;" % disc["wPct"])
        print("  the earthshine should fill most of the circle, and its absence means")
        print("  the lit crescent is being drawn over a bare sky rather than over the")
        print("  dark side of the moon.")
        return 1

    side = "right" if cres["gapR"] < cres["gapL"] else "left"
    print("  THE MOON IS PAINTED AS A CRESCENT.")
    print("  %.1f%% of the box differs from the sky." % pct)
    print("  The lit crescent is %d px wide and %d px tall - %.0f%% of the box width," %
          (cres["w"], cres["h"], cres["wPct"]))
    print("  hugging the %s edge with a %dpx gap opposite - and it is gold, not a"
          % (side, max(cres["gapL"], cres["gapR"])))
    print("  halo, reaching luminance %.0f." % brightest)
    if disc:
        print("  The unlit earthshine fills %.0f%% of the box, so the crescent is drawn"
              % disc["wPct"])
        print("  over the dark side of the moon rather than over bare sky.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
