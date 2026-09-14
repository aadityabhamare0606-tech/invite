"use client";
import { useEffect, useRef } from "react";

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
            href="https://wa.me/919999999999?text=Hi%2C%20I%27d%20like%20to%20create%20my%20wedding%20invite%20website"
            target="_blank" rel="noopener noreferrer"
            className="btn-shimmer inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-[14px] font-semibold text-white"
            style={{ boxShadow: "0 6px 28px rgba(194,24,91,0.3)" }}
          >
            <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.118 1.528 5.857L.057 23.428a.5.5 0 0 0 .623.602l5.694-1.488A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.858 9.858 0 0 1-5.031-1.376l-.36-.214-3.73.976.994-3.63-.234-.374A9.859 9.859 0 0 1 2.1 12C2.1 6.53 6.53 2.1 12 2.1c5.47 0 9.9 4.43 9.9 9.9 0 5.47-4.43 9.9-9.9 9.9z"/>
            </svg>
            Start on WhatsApp — It&apos;s Free
          </a>
        </div>
      </div>
    </section>
  );
}
