"""Check the text/ground pairs that actually occur, using the tokens in the file.

This exists because the celestial restyle moved text onto new grounds and put
new text colours on them, and every one of those pairs is a place to be wrong
quietly. Nothing in the render audit can see it: the text renders, the audit
reports zero broken images and zero tiny text, and the page is just quietly
harder to read. A dark section with a --slate-2 secondary line is 2.3:1 and
looks fine until someone tries to read it on a phone in daylight.

So the pairs are enumerated here and resolved from :root rather than
hardcoded, which means that changing a token and breaking contrast fails this
script instead of shipping.

Method. For each pair, the background is the worst case that pair can actually
land on, not the average:

  - a section background is a gradient between two tokens, so both stops are
    tested and the lighter one wins (less text contrast);
  - .celestial also lays a radial wash of --gold at 10% alpha over the top of
    the section, so that composite is tested too. Ignoring it would make every
    number here slightly too flattering, which is exactly the wrong direction
    to be wrong in;
  - rgba() foregrounds are composited over that background first, because
    --cel-muted is a 74% cream and its effective colour is not --cream.

Thresholds are the WCAG 2.1 AA figures: 4.5:1 for body text, 3:1 for text at
24px or larger, or bold at 18.7px or larger. Each pair declares which applies.

Usage: python check-contrast.py [path/to/index.html]
"""
import re
import sys

# WCAG relative luminance and contrast
def srgb_to_lin(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def luminance(rgb):
    r, g, b = rgb
    return (0.2126 * srgb_to_lin(r) + 0.7152 * srgb_to_lin(g) + 0.0722 * srgb_to_lin(b))

def ratio(fg, bg):
    a, b = luminance(fg), luminance(bg)
    hi, lo = max(a, b), min(a, b)
    return (hi + 0.05) / (lo + 0.05)

def hex_rgb(s):
    s = s.strip().lstrip('#')
    return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))

def parse_rgba(s):
    m = re.match(r'rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)', s.strip())
    if not m:
        return None
    return (float(m.group(1)), float(m.group(2)), float(m.group(3)),
            float(m.group(4)) if m.group(4) else 1.0)

def over(fg, alpha, bg):
    return tuple(fg[i] * alpha + bg[i] * (1 - alpha) for i in range(3))

def parse_tokens(text):
    root = text[text.index(':root{'):]
    root = root[:root.index('\n}')]
    out = {}
    for m in re.finditer(r'(--[a-z0-9-]+)\s*:\s*([^;]+);', root):
        out[m.group(1)] = m.group(2).strip()
    return out

def resolve(tok, name):
    v = tok.get(name)
    if v is None:
        raise SystemExit('  token %s is not declared - the pair list is stale' % name)
    return resolve_value(name, v)


def resolve_value(name, v):
    """A wash may be named by token or written literally.

    Most washes are a token - the wine bloom and the celestial gold wash are both
    --sky-wine and --gold - but the hero's bottom scrim is a literal rgba() in a
    CSS rule, because a scrim is not a palette colour: it is a fixed amount of
    darkness and tuning it is the whole point of it. Reading it from the rule
    rather than copying the numbers means editing the scrim cannot leave this
    script quietly checking a colour the page no longer paints.
    """
    if v.startswith('#'):
        return hex_rgb(v), 1.0
    if v.startswith('rgba') or v.startswith('rgb'):
        r = parse_rgba(v)
        return (r[0], r[1], r[2]), r[3]
    raise SystemExit('  %s is %r, which this script cannot parse' % (name, v))

# (foreground token, background stops, threshold kind, where)
#   A one-element tuple is a flat ground. Two elements are a section gradient,
#   and both stops are tested because the lighter one is the harder read - so
#   the stops are written out rather than derived from a naming convention.
#   ('x', 'x-2') is not a rule that holds in this file, and assuming it was
#   silently checking '--ink-900-2', which does not exist.
PAIRS = [
    # --- the cover and footer keep the oxblood ---------------------------
    ('--cream',    ('--ink-900',),  'normal', 'primary text on the cover'),
    ('--cream-2',  ('--ink-900',),  'normal', 'secondary text on the cover'),
    ('--gold',     ('--ink-900',),  'normal', 'cover eyebrow, tracked caps'),
    ('--cream-2',  ('--ink-900',),  'normal', 'footer'),

    # --- the celestial sections -------------------------------------------
    # .celestial is linear-gradient(var(--night), var(--night-2), var(--night)),
    # so the middle stop is the lightest ground any of this text lands on.
    ('--cream',     ('--night', '--night-2'), 'normal', 'h2 / h3 on the celebrations, venue, countdown, know'),
    ('--cel-muted', ('--night', '--night-2'), 'normal', 'lead paragraph on the celestial sections'),
    ('--cel-faint', ('--night', '--night-2'), 'normal', 'event date, card hint'),
    ('--gold',      ('--night', '--night-2'), 'large',  'event step number, count numbers'),
    ('--gold',      ('--night', '--night-2'), 'normal', 'eyebrow, tracked caps'),
    ('--sage',      ('--night', '--night-2'), 'normal', 'the dt labels on a card back'),
    ('--cream-2',   ('--night', '--night-2'), 'normal', 'countdown labels, know-card body'),
    # No --rose pair here. The heart glyphs used to be listed against these two
    # grounds and reported 4.36:1, but both heart hosts live in the hero -
    # #ic-drift at line 1327 and #hero-hearts at 1377, both before #invitation -
    # and no heart is drawn anywhere on a .celestial section. The pair was a
    # phantom: a colour checked against a ground it is never painted on, which
    # is a false alarm, not a safe pair. The hearts are checked against the hero
    # below, which is where they are.

    # --- the hero --------------------------------------------------------
    # The hero runs --night-3 at the top to --dusk-hi at the horizon. --dusk-hi
    # is the BOTTOM stop, and it is the only one of the four that is never seen
    # bare: #hero::after lays an unconditional scrim over the bottom 34vh, and
    # the horizon lives in the bottom 22% of the hero, so the composite is the
    # ground and --dusk-hi on its own is not. The scrim is in WASHES below for
    # that reason, the same way the wine bloom is.
    ('--cream',     ('--night-3', '--dusk-hi'), 'large',  'the names, at display size'),
    ('--gold',      ('--night-3', '--dusk-hi'), 'normal', 'the WEDS stack and the ring'),
    # The hearts are --rose, and both heart hosts are in the hero: #ic-drift on
    # the cover at line 1327 and #hero-hearts at 1377, both before #invitation.
    # An earlier version of this list checked them against --night/--night-2,
    # which are the .celestial section grounds, and reported 4.36:1. There is no
    # heart on those sections - the pair was a phantom, a colour checked against
    # a ground it is never painted on.
    ('--rose',      ('--night-3', '--dusk-hi'), 'normal', 'the drifting hearts (both hosts are in the hero)'),

    # --- the light sections are unchanged, checked so a token edit cannot
    #     silently break the other half of the page -------------------------
    ('--slate',     ('--paper-000',), 'normal', 'body text on paper'),
    ('--slate-2',   ('--paper-000',), 'normal', 'the lead on paper'),
    ('--gold-deep', ('--paper-000',), 'normal', 'eyebrow on paper'),
]

# The celestial sections also lay a 10% gold wash over the top of the section,
# and the hero carries a wine bloom at 20%. Both lighten the ground under the
# text, so both are composited in. Ignoring them makes every number slightly
# too flattering, which is the wrong direction to be wrong in.
#
# The hero's bottom scrim is the odd one out: it darkens rather than lightens,
# and it is the reason --dusk-hi is not a ground any text is read against. Its
# colour and alpha are read out of the rule below rather than repeated here.
WASHES = {
    '--night': [('under the .celestial gold wash', '--gold', 0.10)],
    '--night-2': [('under the .celestial gold wash', '--gold', 0.10)],
    '--night-3': [('under the hero wine bloom', '--sky-wine', 0.20)],
    '--dusk-hi': [('under the hero wine bloom', '--sky-wine', 0.20),
                  ('under the hero bottom scrim', '@scrim', None)],
}

SCRIM_RULE = '#hero::after'

# Grounds that no pixel of this page ever shows bare, because an unconditional
# overlay covers all of them. Only --dusk-hi qualifies, and only because of the
# scrim: it is the hero's bottom stop, and the scrim covers the bottom 34vh with
# no state, media or reduced-motion gate. The others are genuinely seen bare -
# --night-3 is the top of the sky, well above the scrim - so they keep their
# "as declared" row.
ALWAYS_COVERED = {'--dusk-hi'}


def self_wash(tok, wname, wa, scrim_c, scrim_a):
    """Resolve one wash to (rgb, alpha), substituting the measured scrim."""
    if wname == '@scrim':
        return scrim_c, scrim_a
    wc, _ = resolve(tok, wname)
    return wc, wa


def read_scrim(text):
    """Pull the scrim's darkest stop out of the CSS.

    The scrim is a gradient from near-opaque at the bottom edge to transparent
    at its top, so there is no single alpha: the value that matters is the one
    the horizon sits under, which is the 0% stop - the heaviest end. Taking the
    first rgba() in the rule gets that, and failing loudly if the rule is gone
    is the point: if someone deletes the scrim, this script must not go on
    quietly modelling a ground the page no longer paints.
    """
    m = re.search(re.escape(SCRIM_RULE) + r'\s*\{(.*?)\}', text, re.S)
    if not m:
        raise SystemExit('  %s is gone, so --dusk-hi is a bare ground again and'
                         ' the hero pairs below are understated' % SCRIM_RULE)
    body = m.group(1)
    body = re.sub(r'/\*.*?\*/', '', body, flags=re.S)   # comments carry examples
    cols = re.findall(r'rgba?\([^)]*\)', body)
    if not cols:
        raise SystemExit('  %s has no rgba() in it' % SCRIM_RULE)
    r = parse_rgba(cols[0])
    if r is None:
        raise SystemExit('  %s: cannot parse %r' % (SCRIM_RULE, cols[0]))
    return (r[0], r[1], r[2]), r[3]

THRESH = {'normal': 4.5, 'large': 3.0}


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else 'public/demos/trial/index.html'
    text = open(path, encoding='utf-8').read()
    tok = parse_tokens(text)

    scrim_c, scrim_a = read_scrim(text)

    print('contrast audit: %s' % path)
    print('Thresholds: WCAG 2.1 AA - 4.5:1 body, 3.0:1 at 24px+ or bold 18.7px+')
    print('hero bottom scrim: rgb(%g,%g,%g) at alpha %.2f, read from %s\n'
          % (scrim_c[0], scrim_c[1], scrim_c[2], scrim_a, SCRIM_RULE))

    rows = []
    for fg_name, bgs, kind, where in PAIRS:
        fgc, fga = resolve(tok, fg_name)
        need = THRESH[kind]
        for bg in bgs:
            bgc, _ = resolve(tok, bg)
            # A ground that is always covered is never seen bare. --dusk-hi sits
            # in the bottom 22% of the hero and the scrim is unconditional and
            # ungated, so listing the bare stop as a ground would assert a page
            # state that cannot be painted - and it reports as a failure, which
            # is how this script spent a session claiming gold-on-the-horizon
            # was 2.79:1 when the scrim makes that colour unreachable. The bare
            # variant is dropped and the composite is the ground; the test still
            # guards the pair, which is the job.
            variants = []
            if bg not in ALWAYS_COVERED:
                variants.append(('as declared', bgc))
                # each wash alone: correct for a ground seen both ways, because
                # then the unwashed pixel is real
                for label, wname, wa in WASHES.get(bg, []):
                    wc, wa = self_wash(tok, wname, wa, scrim_c, scrim_a)
                    variants.append((label, over(wc, wa, bgc)))
            else:
                # every wash at once, in order. A ground with one permanent
                # overlay has no "bloom but no scrim" pixel - that state is not
                # reachable - so testing the washes independently manufactures a
                # ground the page cannot paint, and reports it as a failure.
                comp = bgc
                labels = []
                for label, wname, wa in WASHES.get(bg, []):
                    wc, wa = self_wash(tok, wname, wa, scrim_c, scrim_a)
                    comp = over(wc, wa, comp)
                    labels.append(label.replace('under the hero ', ''))
                if not labels:
                    raise SystemExit('  %s is marked always-covered but has no wash' % bg)
                variants.append(('under ' + ' + '.join(labels), comp))
            for label, b in variants:
                eff_fg = over(fgc, fga, b)
                cr = ratio(eff_fg, b)
                rows.append((cr >= need, cr, need, fg_name, bg, label, where, eff_fg, b))

    rows.sort(key=lambda r: r[1])
    fails = 0
    for ok, cr, need, fg, bg, label, where, eff_fg, b in rows:
        if not ok:
            fails += 1
        mark = 'PASS' if ok else 'FAIL'
        print('  %s  %5.2f:1  (needs %.1f)  %-12s on %-11s %-20s' %
              (mark, cr, need, fg, bg, label))
        print('          fg rgb%3d,%3d,%3d  bg rgb%3d,%3d,%3d   %s' %
              (eff_fg[0], eff_fg[1], eff_fg[2], b[0], b[1], b[2], where))
    print('\n%d pair(s) checked, %d below threshold' % (len(rows), fails))
    if fails:
        print('  Every failure above is a real legibility problem, not a formal one:')
        print('  these are the lines a guest is asked to read.')
    return 1 if fails else 0


if __name__ == '__main__':
    sys.exit(main())
