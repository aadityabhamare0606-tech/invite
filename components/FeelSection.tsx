"use client";
import { useEffect, useRef, useState } from "react";

/* ── Mini animated invite preview — pure CSS + JS, no iframe ── */
function MiniInvitePreview({ isVisible }: { isVisible: boolean }) {
  const [phase, setPhase] = useState(0);
  // phases: 0=blank, 1=bg, 2=names, 3=crest, 4=tagline, 5=events, 6=countdown

  useEffect(() => {
    if (!isVisible) return;
    const timings = [0, 400, 1000, 1700, 2300, 3100, 4000];
    const timers = timings.map((t, i) => setTimeout(() => setPhase(i), t));
    return () => timers.forEach(clearTimeout);
  }, [isVisible]);

  return (
    <div className="mini-invite" aria-hidden="true">
      {/* Dark background with gradient */}
      <div className="mi-bg" style={{ opacity: phase >= 1 ? 1 : 0 }} />

      {/* Floating lanterns */}
      {phase >= 1 && [
        { x: "8%",  y: "12%", size: 18, delay: "0s"    },
        { x: "80%", y: "8%",  size: 14, delay: "0.4s"  },
        { x: "70%", y: "55%", size: 16, delay: "0.8s"  },
        { x: "5%",  y: "60%", size: 12, delay: "0.3s"  },
      ].map((l, i) => (
        <div key={i} className="mi-lantern"
          style={{ left: l.x, top: l.y, width: l.size, height: l.size * 1.4,
            animation: `mi-rise 1s ${l.delay} cubic-bezier(0.22,1,0.36,1) both, mi-sway ${5 + i}s ${parseFloat(l.delay) + 1}s ease-in-out infinite` }} />
      ))}

      {/* Names */}
      <div className="mi-names" style={{ opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? "translateY(0)" : "translateY(20px)" }}>
        <span className="mi-name">Rahul</span>
        <span className="mi-weds">weds</span>
        <span className="mi-name">Namita</span>
      </div>

      {/* Crest */}
      <div className="mi-crest" style={{ opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? "scale(1)" : "scale(0.7)" }}>
        R <span style={{ opacity: 0.6 }}>✦</span> N
      </div>

      {/* Date tagline */}
      <div className="mi-tagline" style={{ opacity: phase >= 4 ? 1 : 0, transform: phase >= 4 ? "translateY(0)" : "translateY(8px)" }}>
        February 21 · 2027 · Pune
      </div>

      {/* Event pills */}
      <div className="mi-events" style={{ opacity: phase >= 5 ? 1 : 0 }}>
        {["Mehendi", "Haldi", "Wedding", "Reception"].map((ev, i) => (
          <span key={ev} className="mi-event-pill"
            style={{ animationDelay: `${i * 0.1}s`, animation: phase >= 5 ? `mi-pop 0.4s ${i * 0.1}s cubic-bezier(0.34,1.56,0.64,1) both` : "none" }}>
            {ev}
          </span>
        ))}
      </div>

      {/* Live countdown */}
      <div className="mi-countdown" style={{ opacity: phase >= 6 ? 1 : 0 }}>
        {[["127", "Days"], ["14", "Hours"], ["32", "Mins"], ["18", "Secs"]].map(([n, l]) => (
          <div key={l} className="mi-count-unit">
            <span className="mi-count-n">{n}</span>
            <span className="mi-count-l">{l}</span>
          </div>
        ))}
      </div>

      {/* Halo ring */}
      {phase >= 2 && <div className="mi-halo" />}
    </div>
  );
}

/* ── Feature cards ── */
const FEATURES = [
  {
    icon: "✦",
    title: "Animated name reveal",
    desc: "Your names bloom into view — blur-in on a giant serif, perfectly timed.",
    delay: "0s",
  },
  {
    icon: "⏱",
    title: "Live countdown",
    desc: "Days, hours, minutes, seconds. Ticking in real time for every guest.",
    delay: "0.1s",
  },
  {
    icon: "♥",
    title: "Multi-event cards",
    desc: "Mehendi, Haldi, Sangeet, Reception — all in one shareable link.",
    delay: "0.2s",
  },
  {
    icon: "📱",
    title: "WhatsApp-ready",
    desc: "One tap to share. Guests open it instantly — no app, no login.",
    delay: "0.3s",
  },
  {
    icon: "✿",
    title: "Your photos & story",
    desc: "Gallery, couple story, blessings and venue map — all included.",
    delay: "0.4s",
  },
  {
    icon: "⟡",
    title: "Scroll animations",
    desc: "Every section comes alive as guests scroll — lanterns, petals, sparks.",
    delay: "0.5s",
  },
];

export default function FeelSection() {
  const ref  = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          if (!visible) setVisible(true);
        }
      }),
      { threshold: 0.06 }
    );
    el.querySelectorAll(".reveal, .reveal-pop, .reveal-scale").forEach((n) => obs.observe(n));
    // Section-level observer for the mini-invite
    const secObs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    secObs.observe(el);
    return () => { obs.disconnect(); secObs.disconnect(); };
  }, [visible]);

  return (
    <section ref={ref} id="feel" className="relative overflow-hidden py-20 md:py-28"
      style={{ background: "var(--bg-base)" }}>

      {/* Top divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-14 text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.32em]" style={{ color: "var(--primary)" }}>
            See it come alive
          </p>
          <h2 className="font-light leading-[1.06] mb-4"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,5.5vw,3.4rem)", color: "var(--text-primary)" }}>
            Not just a card —{" "}
            <em className="not-italic font-semibold" style={{ color: "var(--primary)", fontStyle: "italic" }}>an experience</em>
          </h2>
          <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Every invite is a miniature cinematic experience. Watch how it unfolds the moment a guest opens the link.
          </p>
        </div>

        {/* Two-col: preview left, features right */}
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16">

          {/* Mini invite preview */}
          <div className="reveal-scale shrink-0 lg:sticky lg:top-24" style={{ width: "min(320px, 90vw)" }}>
            <div style={{
              background: "linear-gradient(145deg, #0a0520 0%, #160840 50%, #1e0a4e 100%)",
              borderRadius: 20,
              padding: "4px",
              boxShadow: "0 24px 72px rgba(0,0,0,0.5), 0 4px 20px rgba(194,24,91,0.15)",
            }}>
              {/* Phone notch bar */}
              <div style={{ height: 10, background: "#0a0520", borderRadius: "16px 16px 0 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 40, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.1)" }} />
              </div>
              <MiniInvitePreview isVisible={visible} />
              {/* Bottom bar */}
              <div style={{ height: 8, background: "#0a0520", borderRadius: "0 0 16px 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 28, height: 2, borderRadius: 1, background: "rgba(255,255,255,0.15)" }} />
              </div>
            </div>
            {/* Caption */}
            <p className="mt-3 text-center text-[11px]" style={{ color: "var(--text-muted)" }}>
              ↑ Watch the invite animate in real-time
            </p>
          </div>

          {/* Features */}
          <div className="flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title}
                className="reveal flex items-start gap-3.5 rounded-2xl border p-4"
                style={{
                  transitionDelay: f.delay,
                  borderColor: "var(--border)",
                  background: "var(--bg-card)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                }}>
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base"
                  style={{ background: "var(--primary-soft)", color: "var(--primary)", fontWeight: 700 }}>
                  {f.icon}
                </div>
                <div>
                  <p className="mb-0.5 text-[13.5px] font-semibold" style={{ color: "var(--text-primary)" }}>{f.title}</p>
                  <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="reveal mt-14 text-center">
          <a href="#collection"
            className="btn-primary inline-flex items-center gap-2.5 rounded-full px-9 py-3.5 text-[14px] font-semibold text-white"
            style={{ boxShadow: "0 6px 24px rgba(194,24,91,0.28)" }}>
            See all designs
            <svg className="h-4 w-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
