"use client";

import { useEffect, useState } from "react";
import { PHONE_TEL, PHONE_DISPLAY } from "@/lib/contact";

/**
 * Mobile-only sticky call bar.
 *
 * Appears once the visitor has scrolled past the hero, so the single
 * conversion action — a phone call — is always one tap away on the device
 * where most wedding guests and couples browse.
 */
export default function StickyCallBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[70] transition-transform duration-300 md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div
        className="mx-3 mb-3 flex items-center gap-3 rounded-2xl px-4 py-3"
        style={{
          background: "rgba(26,10,14,0.95)",
          boxShadow: "0 12px 34px rgba(0,0,0,0.34)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold text-white">Wedding invites from ₹1,499</p>
          <p className="truncate text-[10px] text-white/60">Free preview · 48-hour rush option</p>
        </div>
        <a
          href={PHONE_TEL}
          aria-label={`Call OurMoment at ${PHONE_DISPLAY}`}
          className="inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-semibold text-white"
          style={{ background: "var(--gradient-rose)" }}
        >
          <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" />
          </svg>
          Call
        </a>
      </div>
    </div>
  );
}
