"use client";
import { useEffect, useRef } from "react";

const TESTIMONIALS = [
  { quote: "It felt like we hired a designer for a fraction of the cost.", name: "Priya & Rahul", city: "Pune" },
  { quote: "Guests kept asking us which studio made it. Nobody believed it was this affordable.", name: "Ananya & Karan", city: "Mumbai" },
  { quote: "The countdown made everyone even more excited for our wedding.", name: "Deepika & Aditya", city: "Jaipur" },
  { quote: "Shared it on WhatsApp and our whole family loved it instantly.", name: "Meera & Sanjay", city: "Delhi" },
  { quote: "Ready in less than a day. Absolutely magical experience.", name: "Ritika & Varun", city: "Bengaluru" },
  /* Duplicated so the marquee loops seamlessly */
  { quote: "It felt like we hired a designer for a fraction of the cost.", name: "Priya & Rahul", city: "Pune" },
  { quote: "Guests kept asking us which studio made it. Nobody believed it was this affordable.", name: "Ananya & Karan", city: "Mumbai" },
  { quote: "The countdown made everyone even more excited for our wedding.", name: "Deepika & Aditya", city: "Jaipur" },
];

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.06 }
    );
    el.querySelectorAll(".reveal, .reveal-blur").forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden py-16 md:py-24"
      style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>

      {/* Decorative glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px w-2/3"
          style={{ background: "linear-gradient(to right,transparent,var(--blush-mid),transparent)" }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="reveal-blur mb-10 text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.32em]" style={{ color: "var(--primary)" }}>
            What couples say
          </p>
          <h2 className="font-light leading-[1.06]"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.8rem,4.5vw,2.8rem)", color: "var(--text-primary)" }}>
            Loved by couples{" "}
            <em className="not-italic font-semibold" style={{ color: "var(--primary)", fontStyle: "italic" }}>across India</em>
          </h2>
        </div>

        {/* The wrapper clips the strip. In reduced-motion mode it becomes a
            manually scrollable row instead — see globals.css. */}
        <div className="reveal overflow-hidden testimonial-strip">
          <div className="flex gap-4 testimonial-track">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="shrink-0 w-[280px] sm:w-[320px] rounded-2xl border px-5 py-4 testimonial-card">
                {/* Stars */}
                <div className="mb-2.5 flex gap-0.5">
                  {[0,1,2,3,4].map(j => (
                    <svg key={j} width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#F59E0B" }}>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <p className="mb-3 leading-relaxed"
                  style={{ fontFamily: "var(--font-cormorant)", fontSize: 16, color: "var(--text-mid)", fontStyle: "italic", lineHeight: 1.65 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  {/* Avatar initial */}
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                    style={{ background: "var(--gradient-rose)" }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[11.5px] font-semibold leading-none" style={{ color: "var(--primary)" }}>{t.name}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}