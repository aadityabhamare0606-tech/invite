"use client";
import { useEffect, useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "What is a digital invitation website?",
    a: "A personalised, mobile-friendly wedding website with your names, dates, venues, events and photos. Guests just tap the link on their phone — no app needed.",
  },
  {
    q: "How much does a wedding invitation website cost in India?",
    a: "OurMoment wedding invitation websites start at ₹1,499. Personalised wedding invitation videos start at ₹399.",
  },
  {
    q: "Can it work for an Indian multi-day wedding?",
    a: "Absolutely. Your website can include multiple events, dates and venues — Mehendi, Haldi, Sangeet, Reception — all in one beautiful site.",
  },
  {
    q: "Can I share the invite on WhatsApp?",
    a: "Yes. Your wedding website is delivered as one shareable link, and the invitation video can be sent directly to family and guests on WhatsApp.",
  },
  {
    q: "Can you include Mehendi, Haldi, Sangeet and Reception?",
    a: "Yes. Your wedding invitation website can include multiple Indian wedding events, dates and venues in one beautiful link.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard personalisation takes 2–3 working days. Rush 24-hour delivery is available for most designs — just mention it when you reach out.",
  },
];

export default function FAQ() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.08 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="faq" ref={ref} className="py-20 md:py-28" style={{ background: "var(--bg-base)" }}>
      <div className="mx-auto max-w-2xl px-5 sm:px-8">

        {/* Header */}
        <div className="reveal text-center mb-14">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.32em]" style={{ color: "var(--primary)" }}>
            Got questions?
          </p>
          <h2 className="font-light mb-3"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.2rem,5vw,3.2rem)", color: "var(--text-primary)", lineHeight: 1.1 }}>
            Frequently asked{" "}
            <em className="not-italic font-semibold" style={{ color: "var(--primary)", fontStyle: "italic" }}>questions</em>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, var(--blush-mid))" }} />
            <span className="animate-heart text-sm" style={{ color: "var(--primary)" }}>♥</span>
            <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, var(--blush-mid))" }} />
          </div>
        </div>

        {/* Accordion */}
        <div className="space-y-2.5">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i}
                className={`reveal faq-item ${isOpen ? "open" : ""}`}
                style={{ transitionDelay: `${i * 0.06}s` }}
              >
                <button
                  className="flex w-full items-center justify-between px-6 py-4 text-left gap-4"
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="text-sm font-semibold sm:text-[15px] leading-snug"
                    style={{ color: isOpen ? "var(--primary)" : "var(--text-primary)" }}>
                    {f.q}
                  </span>
                  <span className="flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center transition-all duration-200"
                    style={{
                      background: isOpen ? "var(--primary)" : "var(--primary-soft)",
                      color: isOpen ? "#fff" : "var(--primary)",
                    }}>
                    {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5">
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {f.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
