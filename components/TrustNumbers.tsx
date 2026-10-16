"use client";
import { useEffect, useRef, useState } from "react";

/* ── Animated counter ── */
function Counter({ to, duration = 1600, suffix = "" }: { to: number; duration?: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const startedRef = useRef(false);
  const elRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          obs.disconnect();
          const start     = performance.now();
          const easeOut   = (t: number) => 1 - Math.pow(1 - t, 3);
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            setVal(Math.round(easeOut(p) * to));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);

  return <span ref={elRef}>{val.toLocaleString("en-IN")}{suffix}</span>;
}

const STATS = [
  {
    value: 2400,
    suffix: "+",
    label: "Invites delivered",
    sub: "Across India, every style of wedding",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    value: 99,
    suffix: "%",
    label: "Happy couples",
    sub: "Most share it with us again next year",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    value: 48,
    suffix: "h",
    label: "Average delivery",
    sub: "From order to live, shareable link",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    value: 5,
    suffix: "★",
    label: "Average rating",
    sub: "Rated by couples across India",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
];

export default function TrustNumbers() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
      }),
      { threshold: 0.06 }
    );
    el.querySelectorAll(".reveal, .reveal-pop").forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden py-20 md:py-28"
      style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[480px] w-[800px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(194,24,91,0.04) 0%, transparent 65%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="reveal mb-14 text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.32em]" style={{ color: "var(--primary)" }}>
            Trusted across India
          </p>
          <h2 className="font-light leading-[1.06]"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,5vw,3.2rem)", color: "var(--text-primary)" }}>
            Thousands of weddings —{" "}
            <em className="not-italic font-semibold" style={{ color: "var(--primary)", fontStyle: "italic" }}>one trusted team</em>
          </h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {STATS.map((s, i) => (
            <div key={s.label}
              className="reveal-pop stat-card"
              style={{ transitionDelay: `${i * 0.09}s` }}>

              {/* Icon */}
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
                {s.icon}
              </div>

              {/* Number */}
              <div className="mb-1 font-semibold leading-none"
                style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.6rem,5vw,3.6rem)", color: "var(--primary)" }}>
                <Counter to={s.value} suffix={s.suffix} duration={1800 + i * 100} />
              </div>

              {/* Label */}
              <p className="mb-1 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{s.label}</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Testimonial strip — moved to its own section (Testimonials.tsx) */}
      </div>
    </section>
  );
}
