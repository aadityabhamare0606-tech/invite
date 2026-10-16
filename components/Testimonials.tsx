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
    el.querySelectorAll(".reveal").forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden py-16 md:py-20"
      style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal overflow-hidden">
          <div className="flex gap-4 testimonial-track">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="shrink-0 w-[280px] sm:w-[320px] rounded-2xl border px-5 py-4"
                style={{ background: "#fff", borderColor: "var(--border)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div className="mb-2.5 flex gap-0.5">
                  {[0,1,2,3,4].map(j => (
                    <svg key={j} width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#F59E0B" }}>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <p className="mb-3 text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-cormorant)", fontSize: 16, color: "var(--text-mid)", fontStyle: "italic" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-[11px] font-semibold" style={{ color: "var(--primary)" }}>{t.name}</p>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{t.city}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}