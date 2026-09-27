"""Sample the screenshot where the Ganesha should be and decide, numerically,
whether artwork is actually painted there.

I cannot look at a screenshot. This can: it counts how many pixels in the
Ganesha's box differ from the flat cover ground, and reports the brightest
colours found. If the emblem is rendering, there will be a large population of
cream/gold pixels. If it is not, the box will be flat oxblood.
"""
import sys
from PIL import Image
from collections import Counter

INK = (42, 10, 17)          # --ink-900, the cover ground
TOL = 26                    # how far a pixel may stray and still count as "ground"

path = sys.argv[1]
left, top, w, h = (int(v) for v in sys.argv[2:6])

im = Image.open(path).convert("RGB")
px = im.load()
W, H = im.size
print("screenshot      : %s  %dx%d" % (path, W, H))

# clamp the probe box into the image
l, t = max(0, left), max(0, top)
r, b = min(W, left + w), min(H, top + h)
if (l, t, r, b) != (left, top, left + w, left + h):
    print("!! box clamped to (%d,%d)-(%d,%d)" % (l, t, r, b))
print("probe box       : (%d,%d)-(%d,%d)  = %dx%d px" % (l, t, r, b, r - l, b - t))

ground = ink = other = 0
bright = Counter()
ink_box = None
step = 2   # every 2nd pixel is plenty and keeps the histogram readable
sampled = 0
for y in range(t, b, step):
    for x in range(l, r, step):
        sampled += 1
        c = px[x, y]
        d = max(abs(c[0] - INK[0]), abs(c[1] - INK[1]), abs(c[2] - INK[2]))
        if d <= TOL:
            ground += 1
        else:
            ink += 1
            if ink_box is None:
                ink_box = [x, y, x, y]
            else:
                ink_box[0] = min(ink_box[0], x); ink_box[1] = min(ink_box[1], y)
                ink_box[2] = max(ink_box[2], x); ink_box[3] = max(ink_box[3], y)
            lum = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
            if lum > 90:      # only real highlights, not the faint bloom
                bright[(c[0] // 32 * 32, c[1] // 32 * 32, c[2] // 32 * 32)] += 1

print("\n-- what is inside the Ganesha's own box --")
print("  flat ground  : %6.1f%%  (%d px)" % (100 * ground / sampled, ground))
print("  not ground   : %6.1f%%  (%d px)   <-- artwork" % (100 * ink / sampled, ink))
if ink_box:
    print("  artwork bbox : x %d..%d  y %d..%d  (w %d  h %d)" %
          (ink_box[0], ink_box[1], ink_box[2], ink_box[3],
           ink_box[2] - ink_box[0] + 1, ink_box[3] - ink_box[1] + 1))
    print("  fills %.0f%% of the box width, %.0f%% of its height" %
          (100 * (ink_box[2] - ink_box[0] + 1) / (r - l),
           100 * (ink_box[3] - ink_box[1] + 1) / (b - t)))
print("  highlight px : %d  (luminance > 90)" % sum(bright.values()))
print("  brightest    : lum %.0f" %
      (max((0.2126 * k[0] + 0.7152 * k[1] + 0.0722 * k[2]) for k in bright) if bright else 0))

if bright:
    print("\n-- top highlight colours (cream/gold artwork expected) --")
    tot = sum(bright.values())
    for c, k in bright.most_common(8):
        lum = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
        print("  rgb%-16s lum %5.0f  %5.1f%%" % (str(c), lum, 100 * k / tot))

print("\n-- verdict --")
if ink / sampled < 0.04:
    print("  ARTWORK NOT PAINTED. The box is flat cover ground.")
    print("  The image decodes but nothing is drawn -> check filter/compositing.")
elif not bright:
    print("  SOMETHING IS DRAWN BUT IT IS FAINT. No pixel clears luminance 90.")
    print("  The emblem is being washed out or dimmed by a layer above it.")
else:
    print("  ARTWORK IS PAINTED AND BRIGHT.")
    print("  %.1f%% of the box is non-ground, highlights reach luminance %.0f."
          % (100 * ink / sampled,
             max(0.2126 * k[0] + 0.7152 * k[1] + 0.0722 * k[2] for k in bright)))

# context: is the rest of the cover alive, so we know the page rendered at all?
print("\n-- whole-frame sanity --")
g = 0
for y in range(0, H, 7):
    for x in range(0, W, 7):
        c = px[x, y]
        if max(abs(c[0] - INK[0]), abs(c[1] - INK[1]), abs(c[2] - INK[2])) > TOL:
            g += 1
tot = len(range(0, H, 7)) * len(range(0, W, 7))
print("  non-ground across frame: %.1f%%" % (100 * g / tot))
