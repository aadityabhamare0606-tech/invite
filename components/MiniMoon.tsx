"use client";

import { useEffect, useId, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   MiniMoon — a small fixed moon at the top-right of the page.

   Borrowed from Demo 1 (Vivaan & Anaya): it starts as a thin right-hand
   crescent and slowly waxes to a full moon as the page is scrolled. It
   fades in once you scroll past 30% of the viewport and fades away again
   if you return to the very top. Purely decorative (pointer-events:none).
   ───────────────────────────────────────────────────────────────────────── */

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/* Mask path for the lit portion — a waxing moon:
   k=0   → a very thin right-hand crescent
   k≈0.48 → half moon (terminator vertical, straight down the middle)
   k=1   → full disc
   The unlit area keeps the warm ivory "earthshine" disc underneath. */
function moonMaskD(cx: number, cy: number, r: number, k: number) {
  const rho = r * (0.93 - 1.93 * clamp(k, 0, 1)); // +0.93r thin cres → 0 half → -r full
  const sweep = rho > 0 ? 0 : 1; // crescent bulges right, gibbous bulges left
  return (
    `M${cx},${cy - r}` +
    ` A${r},${r} 0 0 1 ${cx},${cy + r}` + // right limb — the lit edge
    ` A${Math.abs(rho).toFixed(2)},${r} 0 0 ${sweep} ${cx},${cy - r} Z` // terminator
  );
}

export default function MiniMoon() {
  const uid = useId();
  const pathRef = useRef<SVGPathElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    let visible = false;

    const update = () => {
      raf = 0;
      const path = pathRef.current;
      if (!path) return;
      const st = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const t = maxScroll > 0 ? clamp(st / maxScroll, 0, 1) : 0;

      if (st > window.innerHeight * 0.3 && !visible) {
        visible = true;
        setShow(true);
      } else if (st < window.innerHeight * 0.15 && visible) {
        visible = false;
        setShow(false);
      }

      path.setAttribute("d", moonMaskD(100, 100, 86, easeInOutCubic(t)));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update(); // cover restored/hash scroll on mount + size the mask
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="mini-moon"
      style={{
        position: "fixed",
        top: 82,
        right: 18,
        zIndex: 40,
        pointerEvents: "none",
        width: 94,
        height: 94,
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(-10px)",
        transition:
          "opacity .7s ease, transform .7s cubic-bezier(.16,1,.3,1)",
        willChange: "opacity, transform",
        filter:
          "drop-shadow(0 10px 22px rgba(122,60,10,.16)) drop-shadow(0 0 18px rgba(247,201,93,.4))",
      }}
    >
      <svg width="94" height="94" viewBox="0 0 200 200">
        <defs>
          {/* lit side — warm brand gold, light from the top-left */}
          <radialGradient id={`${uid}-lit`} cx="38%" cy="34%" r="80%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="55%" stopColor="#E9B949" />
            <stop offset="100%" stopColor="#B45309" />
          </radialGradient>
          {/* unlit side — soft porcelain/ivory (earthshine) */}
          <radialGradient id={`${uid}-unlit`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FBF3E1" stopOpacity="0.98" />
            <stop offset="70%" stopColor="#F4E6CB" stopOpacity="0.94" />
            <stop offset="100%" stopColor="#EBDCB9" stopOpacity="0.8" />
          </radialGradient>
        </defs>

        {/* faint craters, visible on both sides */}
        <g fill="rgba(122,60,10,0.10)">
          <circle cx="86" cy="88" r="8" />
          <circle cx="118" cy="122" r="5" />
        </g>

        {/* unlit disc (always underneath the lit crescent) */}
        <circle
          cx="100"
          cy="100"
          r="86"
          fill={`url(#${uid}-unlit)`}
          stroke="rgba(180,83,9,0.16)"
          strokeWidth="1.5"
        />

        {/* lit portion — waxing crescent → full as you scroll */}
        <circle cx="100" cy="100" r="86" fill={`url(#${uid}-lit)`} mask={`url(#${uid}-mask)`} />
        <mask id={`${uid}-mask`}>
          <path
            ref={pathRef}
            fill="#fff"
            d="M100,14 A86,86 0 0 1 100,186 A79.98,86 0 0 0 100,14 Z"
          />
        </mask>
      </svg>
    </div>
  );
}