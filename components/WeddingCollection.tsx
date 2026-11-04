"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PHONE_TEL } from "@/lib/contact";
import DemoCard from "./DemoCard";
import {
  WEDDING_DEMOS,
  SAVE_THE_DATE_DEMOS,
  PROPOSAL_DEMOS,
} from "@/lib/demos";

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-light"
    style={{ fontFamily: "var(--font-cormorant)", color: "var(--text-primary)", fontSize: "clamp(1.8rem,4vw,2.4rem)", lineHeight: 1.1 }}>
    {children}
  </h2>
);

function CoupleCount() {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = countRef.current;
    if (!element) return;

    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) {
        setCount(1239);
        return;
      }

      const start = performance.now();
      const duration = 4500;
      const animate = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easedProgress * 1239));
        if (progress < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    }, { threshold: 0.65 });

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <span ref={countRef} className="text-3xl font-bold leading-none tracking-tight tabular-nums sm:text-4xl"
      style={{ color: "inherit" }} aria-label="Over 1,239 couples made their day personal">
      {count.toLocaleString("en-IN")}+
    </span>
  );
}

export default function WeddingCollection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target); /* unobserve after firing — clean up */
        }
      }),
      { threshold: 0.05, rootMargin: "0px 0px -30px 0px" }
    );
    /* Small delay so CSS display:none → block transition completes first */
    const t = setTimeout(() => {
      el.querySelectorAll(".reveal:not(.visible)").forEach((node) => obs.observe(node));
    }, 60);
    return () => { clearTimeout(t); obs.disconnect(); };
  }, []);

  const grid = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section id="collection" ref={ref} className="pb-16 pt-5 md:pb-24 md:pt-8" style={{ background: "var(--bg-base)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="wedding-day-banner mb-8 overflow-hidden rounded-[26px] border px-5 py-5 sm:px-7 sm:py-6 lg:px-9"
          style={{ borderColor: "rgba(194,24,91,.18)", background: "linear-gradient(112deg,#fff8f5 0%,#fffafd 55%,#fff4f6 100%)", boxShadow: "0 14px 40px rgba(112,19,57,.07)" }}>
          <div className="wedding-day-banner-inner grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:gap-8">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-semibold" style={{ color: "var(--primary)" }}>
                Your day, told your way
              </p>
              <h1 className="font-[var(--font-cormorant)] text-[clamp(1.75rem,3.4vw,2.35rem)] font-medium leading-[1.1] tracking-[-.01em]"
                style={{ color: "var(--text-primary)" }}>
                A beautiful wedding invitation website for your Indian wedding.
              </h1>
              <p className="mt-2 max-w-2xl text-[13px] leading-5 sm:text-sm sm:leading-6" style={{ color: "var(--text-secondary)" }}>
                Every celebration, every little detail—beautifully gathered in one personal link for everyone you love.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <p className="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] font-semibold leading-snug sm:text-xs"
                  style={{ borderColor: "rgba(198,144,58,.32)", background: "linear-gradient(110deg,#fffaf1,#fff5e7)", color: "#79531e" }}>
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <rect x="2.5" y="6" width="15" height="11" rx="1.5" />
                    <path d="M7 6V4.5A1.5 1.5 0 0 1 8.5 3h3A1.5 1.5 0 0 1 13 4.5V6M2.5 10h15M8 10v1.5h4V10" />
                  </svg>
                  Best for corporate wedding invites
                </p>
                <div className="inline-flex max-w-full items-center gap-3 rounded-xl border bg-white/90 px-3.5 py-2.5 transition-colors sm:px-4"
                  style={{ borderColor: "rgba(194,24,91,.16)", boxShadow: "0 5px 16px rgba(112,19,57,.055)" }}>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm text-white shadow-sm" style={{ background: "var(--gradient-rose)" }} aria-hidden="true">↗</span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>A personal link, ready to share</span>
                    <span className="mt-0.5 block break-all text-sm font-semibold sm:text-base" style={{ color: "var(--primary-deep)" }}>aarav-weds-kanika.com</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="wedding-day-proof relative flex items-center gap-3 rounded-2xl border px-4 py-4 text-white md:min-w-[240px] md:flex-col md:justify-center md:gap-2 md:px-7 md:py-6 md:text-center"
              style={{ borderColor: "rgba(255,255,255,.22)", background: "linear-gradient(145deg,#76103e 0%,#a71950 55%,#c33a68 100%)", boxShadow: "0 12px 30px rgba(112,19,57,.18)" }}>
              <span className="wedding-day-proof-ring wedding-day-proof-ring-one" aria-hidden="true" />
              <span className="wedding-day-proof-ring wedding-day-proof-ring-two" aria-hidden="true" />
              <span className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full text-base md:h-10 md:w-10" style={{ background: "rgba(255,255,255,.14)", color: "#ffe6b7" }} aria-hidden="true">♥</span>
              <div className="relative z-10">
                <div className="text-3xl font-bold leading-none tracking-tight tabular-nums sm:text-4xl">
                  <CoupleCount />
                </div>
                <p className="mt-1 text-xs font-semibold sm:text-sm">Happy couples</p>
                <p className="mt-0.5 text-[11px] text-white/80">And counting, with love</p>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .wedding-day-banner { position:relative; isolation:isolate; }
          .wedding-day-banner::before { content:""; position:absolute; z-index:-1; width:300px; height:300px; right:22%; top:-235px; border:1px solid rgba(194,24,91,.08); border-radius:50%; pointer-events:none; }
          .wedding-day-proof { isolation:isolate; }
          .wedding-day-proof-ring { position:absolute; inset:12px 20px; border:1px solid rgba(255,255,255,.13); border-radius:50%; pointer-events:none; }
          .wedding-day-proof-ring-two { inset:22px 34px; border-style:dashed; }
          @media (min-width:768px) { .wedding-day-proof-ring { inset:10px 24px; } .wedding-day-proof-ring-two { inset:20px 40px; } }
          @media (prefers-reduced-motion:reduce) { .wedding-day-proof-ring { animation:none; } }
        `}</style>

        {/* ── Wedding Collection ── */}
        {WEDDING_DEMOS.length > 0 && (
          <div className="mb-20">
            <div className="reveal mb-10 flex items-end justify-between border-b pb-5"
              style={{ borderColor: "var(--border)" }}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <SectionHeading>
                  The Wedding{" "}
                  <em className="not-italic font-semibold" style={{ color: "var(--primary)", fontStyle: "italic" }}>
                    Collection
                  </em>
                </SectionHeading>
                <p className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium leading-tight sm:text-xs"
                  style={{ borderColor: "var(--blush-mid)", background: "var(--primary-soft)", color: "var(--text-secondary)" }}>
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--primary)" }} aria-hidden="true" />
                  Personalised for you at no extra cost, and ready in just 2 days.
                </p>
              </div>
              <span className="hidden sm:block text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ color: "var(--primary)", background: "var(--primary-soft)", border: "1px solid var(--blush-mid)" }}>
                {WEDDING_DEMOS.length} design{WEDDING_DEMOS.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className={grid}>
              {WEDDING_DEMOS.map((card, i) => (
                <div key={card.id} className="reveal" style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
                  <DemoCard card={card} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Save the Date ── */}
        {SAVE_THE_DATE_DEMOS.length > 0 && (
          <div id="save-the-date" className="mb-20">
            <div className="reveal mb-10">
              <div className="flex items-end justify-between border-b pb-5" style={{ borderColor: "var(--border)" }}>
                <div>
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--primary)" }}>
                    Months before the big day
                  </p>
                  <SectionHeading>
                    Save the{" "}
                    <em className="not-italic font-semibold" style={{ color: "var(--primary)", fontStyle: "italic" }}>
                      Date
                    </em>
                  </SectionHeading>
                </div>
                <Link href="/save-the-date"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 hover:bg-[var(--primary)] hover:text-white"
                  style={{ color: "var(--primary)", background: "var(--primary-soft)", border: "1px solid var(--blush-mid)" }}>
                  View all
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </Link>
              </div>
              <p className="mt-4 text-sm leading-relaxed max-w-xl" style={{ color: "var(--text-secondary)" }}>
                Announce it months early. Two designs guests will screenshot.
              </p>
            </div>

            <div className="reveal mb-8 flex flex-col gap-5 rounded-2xl border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7"
              style={{ borderColor: "rgba(194,24,91,.16)", background: "linear-gradient(112deg,#fff8f5 0%,#fffafd 58%,#fff4f6 100%)", boxShadow: "0 8px 24px rgba(112,19,57,.05)" }}>
              <div className="max-w-3xl">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[.18em]" style={{ color: "var(--primary)" }}>
                  Your first wedding announcement
                </p>
                <h3 className="font-[var(--font-cormorant)] text-2xl font-medium leading-tight tracking-tight sm:text-[1.7rem]"
                  style={{ color: "var(--text-primary)" }}>
                  Give your date a moment of its own.
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed sm:text-sm" style={{ color: "var(--text-secondary)" }}>
                  Share a beautiful first glimpse of your celebration, personalised with your names and date at no extra fee.
                </p>
              </div>
              <a href={PHONE_TEL}
                className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full px-5 py-2.5 text-xs font-semibold text-white transition-transform hover:scale-[1.03] sm:self-center"
                style={{ background: "linear-gradient(135deg,#880E4F,#C2185B)", boxShadow: "0 4px 14px rgba(194,24,91,.2)" }}>
                Make it yours
                <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>
            </div>

            <div className={grid}>
              {SAVE_THE_DATE_DEMOS.map((card, i) => (
                <div key={card.id} className="reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <DemoCard card={card} />
                </div>
              ))}
            </div>

            <div className="reveal mt-8 rounded-2xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border"
              style={{ background: "linear-gradient(120deg, #fff5e8 0%, #fff8f2 100%)", borderColor: "var(--blush-mid)" }}>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] mb-1" style={{ color: "var(--primary)" }}>₹599</p>
                <p className="text-sm font-medium" style={{ color: "var(--text-mid)" }}>
                  Your names, your date, your story — one link, personalised at no extra fee.
                </p>
              </div>
              <a href={PHONE_TEL}
                className="shrink-0 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white transition-all hover:scale-[1.03]"
                style={{ background: "linear-gradient(135deg,#880E4F,#C2185B)", boxShadow: "0 4px 16px rgba(194,24,91,0.28)" }}>
                <svg className="h-3.5 w-3.5 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/>
                </svg>
                Call for Save the Date
              </a>
            </div>
          </div>
        )}

        {/* ── Proposal Pages ── */}
        {PROPOSAL_DEMOS.length > 0 && (
          <div id="proposals" className="mb-20">
            <div className="reveal mb-10">
              <div className="flex items-end justify-between border-b pb-5" style={{ borderColor: "var(--border)" }}>
                <div>
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--primary)" }}>
                    Say it beautifully
                  </p>
                  <SectionHeading>
                    Proposal{" "}
                    <em className="not-italic font-semibold" style={{ color: "var(--primary)", fontStyle: "italic" }}>
                      Pages
                    </em>
                  </SectionHeading>
                </div>
                <Link href="/proposals"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 hover:bg-[var(--primary)] hover:text-white"
                  style={{ color: "var(--primary)", background: "var(--primary-soft)", border: "1px solid var(--blush-mid)" }}>
                  View all
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </Link>
              </div>
              <p className="mt-4 text-sm leading-relaxed max-w-xl" style={{ color: "var(--text-secondary)" }}>
                The most important question deserves the most memorable moment.
              </p>
            </div>

            <div className={grid}>
              {PROPOSAL_DEMOS.map((card, i) => (
                <div key={card.id} className="reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <DemoCard card={card} />
                </div>
              ))}
            </div>

            <div className="reveal mt-8 rounded-2xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border"
              style={{ background: "linear-gradient(120deg, #fff0f4 0%, #fff5f9 100%)", borderColor: "var(--blush-mid)" }}>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] mb-1" style={{ color: "var(--primary)" }}>₹499</p>
                <p className="text-sm font-medium" style={{ color: "var(--text-mid)" }}>
                  Personalised to your names and your story, with no extra personalisation fee.
                </p>
              </div>
              <a href={PHONE_TEL}
                className="shrink-0 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white transition-all hover:scale-[1.03]"
                style={{ background: "linear-gradient(135deg,#880E4F,#C2185B)", boxShadow: "0 4px 16px rgba(194,24,91,0.28)" }}>
                <svg className="h-3.5 w-3.5 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/>
                </svg>
                Call for a Proposal Page
              </a>
            </div>
          </div>
        )}

        {/* ── Custom CTA ── */}
        <div className="reveal mt-4 rounded-3xl px-8 py-14 text-center overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, #880E4F 0%, #C2185B 50%, #D81B60 100%)" }}>
          <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 1px, transparent 1px, transparent 18px)" }} />
          <div className="absolute top-4 left-8 text-white/10 text-5xl select-none">♥</div>
          <div className="absolute bottom-4 right-8 text-white/10 text-5xl select-none">♥</div>
          <div className="relative">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Have something in mind?</p>
            <h3 className="mb-3 font-light text-white"
              style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.6rem,4vw,2.4rem)", lineHeight: 1.15 }}>
              Looking for something <em style={{ fontStyle: "italic" }}>specific?</em>
            </h3>
            <p className="mb-7 text-sm text-white/75 max-w-sm mx-auto leading-relaxed">
              Tell us your vision — we&apos;ll design the invite for it.
            </p>
            <a href={PHONE_TEL}
              className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
              style={{ color: "var(--primary)", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--primary)" }} aria-hidden="true">
                <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/>
              </svg>
              Call us now
            </a>
          </div>
        </div>

      </div>

    </section>
  );
}
