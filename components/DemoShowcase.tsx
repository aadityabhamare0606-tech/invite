"use client";

import { useEffect, useRef } from "react";
import DemoCard from "./DemoCard";
import type { DemoCardData } from "@/lib/demos";

interface Props {
  cards: DemoCardData[];
  /** Grid width. 3 for a full row, 2 for a pair. */
  columns?: 2 | 3;
}

/**
 * A set of designs that open their live demos in a new tab.
 *
 * Used on the keyword landing pages, which previously showed a hand-drawn
 * mockup that said "Your wedding website" — a picture of nothing.
 */
export default function DemoShowcase({ cards, columns = 3 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  /* The `.reveal` start state is gated behind `.js`, so the observer has to
     run here or the cards stay invisible. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.05, rootMargin: "0px 0px -30px 0px" }
    );
    el.querySelectorAll(".reveal:not(.visible)").forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, [cards]);

  if (cards.length === 0) return null;

  return (
    <>
      <div
        ref={ref}
        className={`grid gap-6 ${columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}
      >
        {cards.map((card, i) => (
          <div key={card.id} className="reveal" style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
            <DemoCard
              card={card}
            />
          </div>
        ))}
      </div>

    </>
  );
}
