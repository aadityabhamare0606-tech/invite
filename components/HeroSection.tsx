"use client";
import { useEffect, useRef, useState } from "react";

/* Defined outside — no re-allocation on re-render */
const filters = ["All", "Wedding", "Save the Date", "Engagement"] as const;

const HEARTS = [
  { size: 20, color: "#D81B60", top: "8%",  left: "3%",  dur: "10s", delay: "0s"   },
  { size: 14, color: "#C2185B", top: "22%", left: "93%", dur: "13s", delay: "1.6s" },
  { size: 18, color: "#D81B60", top: "58%", left: "2%",  dur: "9s",  delay: "3.2s" },
  { size: 12, color: "#D81B60", top: "74%", left: "95%", dur: "12s", delay: "0.9s" },
  { size: 16, color: "#C2185B", top: "38%", left: "97%", dur: "11s", delay: "4.1s" },
  { size: 10, color: "#F8BBD9", top: "87%", left: "5%",  dur: "14s", delay: "2.2s" },
  { size: 22, color: "#FCE4EC", top: "6%",  left: "88%", dur: "11s", delay: "5.3s" },
];

const OCCASIONS = [
  { icon: "💍", label: "Weddings"      },
  { icon: "💌", label: "Proposals"     },
  { icon: "💝", label: "Valentine's"   },
  { icon: "🎂", label: "Anniversaries" },
  { icon: "✨", label: "Engagements"   },
];

const STATS = [
  { num: 500, suffix: "+", label: "Happy Couples",  icon: "♥" },
  { num: 9,   suffix: "",  label: "Unique Designs", icon: "✦" },
  { num: 24,  suffix: "h", label: "Fast Delivery",  icon: "⚡" },
] as const;

const MARQUEE_ITEMS = [
  "500+ happy couples", "24h delivery", "Weddings", "Proposals",
  "Valentine's Day", "Anniversaries", "Live countdown", "Animated invites",
  "Share via WhatsApp", "9 unique designs", "Personalised for you",
];

/* ── Floating heart — pure CSS animation, no JS ── */
function FloatingHeart({ size, style }: { size: number; style: React.CSSProperties }) {
  return (
    <div className="hero-petal" style={style} aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <path d="M16 28C16 28 3 19 3 10.5C3 7 5.7 4 9.5 4C12.1 4 14.3 5.6 16 7.8C17.7 5.6 19.9 4 22.5 4C26.3 4 29 7 29 10.5C29 19 16 28 16 28Z"
          fill="currentColor" opacity="0.45" />
      </svg>
    </div>
  );
}

/* ── Stat counter — minimal setState, observer disconnects immediately ── */
function StatCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return;
      started.current = true;
      obs.disconnect(); /* disconnect immediately — no lingering observer */

      /* Use requestAnimationFrame but batch updates — only ~8 setState calls */
      const STEPS = 8;
      const values = Array.from({ length: STEPS }, (_, i) =>
        Math.round(target * ((i + 1) / STEPS))
      );
      let i = 0;
      const tick = () => {
        setDisplay(values[i]);
        i++;
        if (i < STEPS) setTimeout(tick, 60); /* 60ms between each — smooth, not 117 re-renders */
      };
      setTimeout(tick, 0);
    }, { threshold: 0.5 });

    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{display}{suffix}</span>;
}

interface Props {
  activeFilter: string;
  onFilterChange: (f: string) => void;
}

export default function HeroSection({ activeFilter, onFilterChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    el.querySelectorAll(".reveal,.reveal-pop,.reveal-scale").forEach((node) => obs.observe(node));
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative w-full overflow-hidden" style={{ background: "var(--bg-hero)" }}>

      {/* Top accent band — pure CSS, zero GPU cost */}
      <div className="h-[3px] w-full" style={{
        background: "linear-gradient(to right, transparent, var(--blush-mid), var(--primary), var(--primary-light), var(--primary), var(--blush-mid), transparent)"
      }} />

      {/* Background glows — will-change promotes to own compositor layer, no re-rasterize */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 -top-20 h-[480px] w-[760px] -translate-x-1/2"
          style={{
            background: "radial-gradient(ellipse, rgba(194,24,91,0.06) 0%, transparent 65%)",
            filter: "blur(60px)",
            willChange: "transform",
          }} />
        <div className="absolute -bottom-12 -left-16 h-64 w-64 rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(248,187,217,0.5) 0%, transparent 70%)",
            filter: "blur(44px)",
            willChange: "transform",
          }} />
        <div className="absolute -bottom-8 -right-8 h-52 w-52 rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(194,24,91,0.06) 0%, transparent 70%)",
            filter: "blur(36px)",
            willChange: "transform",
          }} />
        {/* Static decorative rings — zero animation cost */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[580px] w-[580px] rounded-full border opacity-[0.04]"
          style={{ borderColor: "var(--primary)" }} />
      </div>

      {/* Floating hearts — compositor-only animation (transform + opacity) */}
      {HEARTS.map((h, i) => (
        <FloatingHeart key={i} size={h.size}
          style={{
            top: h.top, left: h.left, color: h.color,
            animation: `petal-float ${h.dur} ease-in-out ${h.delay} infinite`,
          }} />
      ))}

      {/* Main content */}
      <div className="relative mx-auto max-w-4xl px-6 pt-20 pb-10 text-center md:pt-28 md:pb-14">

        {/* Eyebrow pill — solid bg, NO backdrop-filter */}
        <div className="reveal flex justify-center mb-7">
          <span className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.28em]"
            style={{
              color: "var(--primary)",
              borderColor: "var(--blush-mid)",
              background: "#FFF0F2",   /* solid — no backdrop-filter */
            }}>
            <span className="animate-heart text-sm">♥</span>
            Express every moment of love
          </span>
        </div>

        {/* Headline */}
        <h1 className="reveal font-light leading-[1.06] tracking-tight mb-5"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(3rem,8vw,5.8rem)",
            color: "var(--text-primary)",
            transitionDelay: "0.08s",
          }}>
          Beautiful invites for{" "}
          <em className="not-italic font-semibold" style={{ color: "var(--primary)", fontStyle: "italic" }}>every</em>
          <br />love occasion
        </h1>

        {/* Sub */}
        <p className="reveal text-base sm:text-lg leading-relaxed mx-auto mb-8"
          style={{ color: "var(--text-secondary)", maxWidth: 520, transitionDelay: "0.14s" }}>
          Weddings &middot; Proposals &middot; Valentine&apos;s Day &middot; Anniversaries &middot; Engagements —
          one beautiful animated link, shared instantly.
        </p>

        {/* Occasion chips — solid bg, NO backdrop-filter */}
        <div className="reveal flex flex-wrap items-center justify-center gap-2 mb-10" style={{ transitionDelay: "0.18s" }}>
          {OCCASIONS.map((o, i) => (
            <span key={o.label}
              className={`reveal-pop stagger-${i + 1} inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[12px] font-semibold border`}
              style={{
                borderColor: "var(--border)",
                background: "#fafafa",  /* solid, no blur */
                color: "var(--text-mid)",
              }}>
              <span>{o.icon}</span>{o.label}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="reveal flex justify-center mb-12" style={{ transitionDelay: "0.22s" }}>
          <a href="#collection"
            className="btn-primary inline-flex items-center gap-2.5 rounded-full px-10 py-4 text-[15px] font-semibold text-white"
            style={{ boxShadow: "0 6px 24px rgba(194,24,91,0.28)" }}>
            Explore Collection
            <svg className="h-4 w-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>
        </div>

        {/* Stats */}
        <div className="reveal flex items-stretch justify-center gap-4 sm:gap-5 flex-wrap mb-10"
          style={{ transitionDelay: "0.28s" }}>
          {STATS.map((s, i) => (
            <div key={s.label} className={`stat-card reveal-pop stagger-${i + 1}`} style={{ minWidth: 118 }}>
              <div className="text-xl mb-1" style={{ color: "var(--primary)" }}>{s.icon}</div>
              <p className="font-semibold leading-none mb-1"
                style={{ fontFamily: "var(--font-cormorant)", color: "var(--primary)", fontSize: 34 }}>
                <StatCounter target={s.num} suffix={s.suffix} />
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="reveal flex items-center justify-center gap-3 mb-8" style={{ transitionDelay: "0.34s" }}>
          <div className="h-px flex-1 max-w-[72px]" style={{ background: "linear-gradient(to right, transparent, var(--blush-mid))" }} />
          <span className="animate-heart text-base" style={{ color: "var(--primary)" }}>♥</span>
          <div className="h-px flex-1 max-w-[72px]" style={{ background: "linear-gradient(to left, transparent, var(--blush-mid))" }} />
        </div>

        {/* Filter pills */}
        <div className="reveal flex flex-wrap items-center justify-center gap-2.5" style={{ transitionDelay: "0.40s" }}>
          {filters.map((f) => {
            const isActive = activeFilter === f;
            return (
              <button key={f} onClick={() => onFilterChange(f)}
                className="rounded-full px-6 py-2.5 text-[13px] font-semibold transition-colors duration-200 border"
                style={{
                  background:  isActive ? "var(--primary)"  : "#ffffff",
                  color:       isActive ? "#fff"            : "var(--text-mid)",
                  borderColor: isActive ? "var(--primary)"  : "var(--border)",
                  boxShadow:   isActive ? "0 3px 14px rgba(194,24,91,0.22)" : "none",
                }}>
                {f}
              </button>
            );
          })}
        </div>
      </div>

      <div className="section-divider" />

      {/* Marquee */}
      <div className="relative overflow-hidden py-3 border-y"
        style={{ background: "var(--primary-soft)", borderColor: "var(--blush-mid)" }}>
        <div className="marquee-track whitespace-nowrap select-none" aria-hidden="true">
          {[0, 1].map((ri) => (
            <span key={ri} className="inline-flex items-center">
              {MARQUEE_ITEMS.map((t) => (
                <span key={t} className="inline-flex items-center gap-2.5 px-6 text-[12px] font-semibold"
                  style={{ color: "var(--primary)" }}>
                  <span style={{ color: "var(--blush-deep)", fontSize: 8 }}>♥</span>
                  {t}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
