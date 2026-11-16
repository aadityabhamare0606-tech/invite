"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import DemoCard from "./DemoCard";
import {
  WEDDING_DEMOS,
  SAVE_THE_DATE_DEMOS,
  PROPOSAL_DEMOS,
} from "@/lib/demos";

const HOMEPAGE_WEDDING_DEMOS = WEDDING_DEMOS.filter((demo) => demo.id !== "demo-15-mountain");
const DIVINE_WEDDING_DEMO = HOMEPAGE_WEDDING_DEMOS.find((demo) => demo.id === "divine-wedding");
const OTHER_HOMEPAGE_WEDDING_DEMOS = HOMEPAGE_WEDDING_DEMOS.filter((demo) => demo.id !== "divine-wedding");
const HOMEPAGE_INVITATION_DEMOS = [
  ...OTHER_HOMEPAGE_WEDDING_DEMOS.slice(0, 1),
  ...(DIVINE_WEDDING_DEMO ? [DIVINE_WEDDING_DEMO] : []),
  ...OTHER_HOMEPAGE_WEDDING_DEMOS.slice(1),
  ...SAVE_THE_DATE_DEMOS,
];
const COUPLE_COUNT = 234;

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-light"
    style={{ fontFamily: "var(--font-cormorant)", color: "var(--text-primary)", fontSize: "clamp(1.8rem,4vw,2.4rem)", lineHeight: 1.1 }}>
    {children}
  </h2>
);

function CoupleCount() {
  return (
    <span className="text-3xl font-bold leading-none tracking-tight tabular-nums sm:text-4xl"
      style={{ color: "inherit" }} aria-label={`Over ${COUPLE_COUNT} couples made their day personal`}>
      {COUPLE_COUNT.toLocaleString("en-IN")}+
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
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="inline-flex max-w-full items-center gap-3 rounded-xl border bg-white/90 px-3.5 py-2.5 transition-colors sm:px-4"
                  style={{ borderColor: "rgba(194,24,91,.16)", boxShadow: "0 5px 16px rgba(112,19,57,.055)" }}>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm text-white shadow-sm" style={{ background: "var(--gradient-rose)" }} aria-hidden="true">↗</span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>A personal link, ready to share</span>
                    <span className="mt-0.5 block break-all font-[var(--font-sans)] text-base font-bold leading-snug sm:text-lg" style={{ color: "var(--primary-deep)" }}>aarav-weds-kanika.com</span>
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
        {HOMEPAGE_INVITATION_DEMOS.length > 0 && (
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
                {HOMEPAGE_INVITATION_DEMOS.length} designs
              </span>
            </div>
            <p className="reveal mb-6 -mt-5 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Six wedding invitation websites, plus two Save the Date designs to share your plans early.
            </p>
            <div className={grid}>
              {HOMEPAGE_INVITATION_DEMOS.map((card, i) => (
                <div key={card.id} className="reveal" style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
                  <DemoCard card={card} />
                </div>
              ))}
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

          </div>
        )}

      </div>

    </section>
  );
}
