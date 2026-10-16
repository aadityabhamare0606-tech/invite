"use client";
import { useEffect, useRef } from "react";
import { PHONE_TEL } from "@/lib/contact";

const steps = [
  {
    num: "01",
    title: "Choose a Style",
    desc: "Browse our collection of 9 beautifully crafted invitation websites, or describe the look you have in mind.",
    icon: "✦",
    iconBg: "radial-gradient(circle, #fdf5e0 0%, #fff 100%)",
    accent: "rgba(184,145,58,0.12)",
  },
  {
    num: "02",
    title: "Share Your Details",
    desc: "Send us your names, event dates, venue, family details and any photos you'd like to include.",
    icon: "♡",
    iconBg: "radial-gradient(circle, #f5e8ec 0%, #fff 100%)",
    accent: "rgba(194,24,91,0.08)",
  },
  {
    num: "03",
    title: "We Personalise It",
    desc: "Our designers tailor every element — text, colours, photos — so it feels completely yours.",
    icon: "✿",
    iconBg: "radial-gradient(circle, #fdf5e0 0%, #fff 100%)",
    accent: "rgba(184,145,58,0.12)",
  },
  {
    num: "04",
    title: "Share One Link",
    desc: "Your invite is live. Share it on WhatsApp, Instagram, or email — guests open it instantly.",
    icon: "⟡",
    iconBg: "radial-gradient(circle, #f5e8ec 0%, #fff 100%)",
    accent: "rgba(194,24,91,0.08)",
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.08 }
    );
    ref.current?.querySelectorAll(".reveal, .reveal-pop, .reveal-scale").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="how-it-works" ref={ref} className="relative overflow-hidden py-20 md:py-28"
      style={{ background: "var(--bg-surface)" }}>

      {/* ── Background decoration ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4"
          style={{ background: "linear-gradient(to right, transparent, var(--blush-mid), transparent)" }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-3/4"
          style={{ background: "linear-gradient(to right, transparent, var(--blush-mid), transparent)" }} />
        <div className="absolute -top-32 right-0 h-96 w-96 rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, rgba(184,145,58,0.08), transparent 70%)", filter: "blur(48px)", willChange: "transform" }} />
        <div className="absolute -bottom-24 left-0 h-80 w-80 rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, rgba(194,24,91,0.06), transparent 70%)", filter: "blur(40px)", willChange: "transform" }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">

        {/* ── Header ── */}
        <div className="reveal text-center mb-16 md:mb-20">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.32em]" style={{ color: "var(--primary)" }}>
            Simple &amp; seamless
          </p>
          <h2 className="font-light leading-[1.05] mb-4"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.4rem, 5.5vw, 3.8rem)", color: "var(--text-primary)" }}>
            Your invite, ready in{" "}
            <em className="not-italic font-semibold" style={{ color: "var(--primary)", fontStyle: "italic" }}>
              4 simple steps
            </em>
          </h2>
          <p className="text-sm sm:text-base leading-relaxed mx-auto" style={{ color: "var(--text-secondary)", maxWidth: 460 }}>
            No technical knowledge needed. We handle everything from design to delivery.
          </p>
          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px w-20" style={{ background: "linear-gradient(to right, transparent, var(--blush-mid))" }} />
            <span className="animate-heart text-base" style={{ color: "var(--primary)" }}>♥</span>
            <div className="h-px w-20" style={{ background: "linear-gradient(to left, transparent, var(--blush-mid))" }} />
          </div>
        </div>

        {/* ── Steps grid ── */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">

          {/* ── Desktop connector line ── */}
          <div className="hidden lg:block absolute top-[52px] left-[14%] right-[14%] h-px z-0"
            style={{ background: "linear-gradient(to right, transparent 0%, var(--blush-mid) 15%, var(--primary) 50%, var(--blush-mid) 85%, transparent 100%)" }}>
            {/* Animated dots along the line */}
            {[25, 50, 75].map((pct) => (
              <div key={pct} className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full animate-pulse-dot"
                style={{ left: `${pct}%`, background: "var(--blush-deep)", animationDelay: `${pct * 0.02}s` }} />
            ))}
          </div>

          {steps.map((s, i) => (
            <div key={s.num}
              className={`step-card reveal-scale stagger-${i + 1} relative z-10`}
            >
              {/* Background tint */}
              <div className="absolute inset-0 rounded-[20px] pointer-events-none"
                style={{ background: s.accent }} />

              {/* Step number badge */}
              <div className="flex justify-center mb-3">
                <div className="step-num" style={{ fontFamily: "var(--font-cormorant)" }}>
                  {s.num}
                </div>
              </div>

              {/* Icon circle */}
              <div className="flex justify-center">
                <div className="step-icon-wrap" style={{ background: s.iconBg }}>
                  <span style={{ color: i % 2 === 0 ? "var(--gold)" : "var(--maroon)", fontSize: 28 }}>
                    {s.icon}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-[17px] mb-2.5 leading-snug"
                style={{ fontFamily: "var(--font-cormorant)", color: "var(--text-primary)", fontSize: 22 }}>
                {s.title}
              </h3>

              {/* Desc */}
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)", fontSize: 13.5 }}>
                {s.desc}
              </p>

              {/* Bottom accent dot */}
              <div className="mt-5 flex justify-center">
                <div className="h-1 w-10 rounded-full"
                  style={{ background: i % 2 === 0 ? "var(--blush-mid)" : "var(--primary-soft)" }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="reveal text-center mt-16">
          <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
            Ready to get started? It takes less than 2 minutes.
          </p>
          <a
            href={PHONE_TEL}
            className="btn-shimmer inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-[14px] font-semibold text-white"
            style={{ boxShadow: "0 6px 28px rgba(194,24,91,0.3)" }}
          >
            <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/>
            </svg>
            Call Now — It&apos;s Free
          </a>
        </div>
      </div>
    </section>
  );
}
