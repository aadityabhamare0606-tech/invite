"use client";
import { PHONE_TEL } from "@/lib/contact";

export type DemoCardData = {
  id: string;
  badge: string;
  badgeStyle: "bestseller" | "ookind" | "popular" | "premium" | "classic" | "new" | "latest";
  type: string;
  title: string;
  description: string;
  price: string;
  priceUnit?: string;
  demoSrc: string;
  previewImg?: string;
  previewBg?: string;
  previewAccent?: string;
  category: string;
  tags?: string[];
};

interface DemoCardProps {
  card: DemoCardData;
  onPreview?: (src: string, title: string) => void;
}

const badgeMap: Record<string, { bg: string; text: string }> = {
  bestseller: { bg: "#880E4F", text: "#fff"    },
  ookind:     { bg: "#4a1060", text: "#fff"    },
  popular:    { bg: "#145a32", text: "#fff"    },
  premium:    { bg: "#7a4000", text: "#fff"    },
  classic:    { bg: "#1a2a50", text: "#fff"    },
  new:        { bg: "#0a5068", text: "#fff"    },
  latest:     { bg: "#880E4F", text: "#fce4ec" },
};

const tagStyle: Record<string, { bg: string; color: string }> = {
  "Best for Mobile":   { bg: "#EEF4FF", color: "#1D4ED8" },
  "Best for Sharing":  { bg: "#EEF4FF", color: "#1D4ED8" },
  "Multi-event":       { bg: "#F0FDF4", color: "#166534" },
  "Corporate Gifting": { bg: "#FFFBEB", color: "#92400E" },
  "Desktop Optimised": { bg: "#FDF4FF", color: "#6B21A8" },
  "Illustrated":       { bg: "#FFFBEB", color: "#92400E" },
  "Premium Design":    { bg: "#FFF1F2", color: "#9F1239" },
  "Live Countdown":    { bg: "#F5F3FF", color: "#5B21B6" },
  "Animated":          { bg: "#FFF1F2", color: "#9F1239" },
  "Unique Experience": { bg: "#F0FDF4", color: "#166534" },
};

function PreviewPlaceholder({ card }: { card: DemoCardData }) {
  return (
    <div
      className="h-full w-full"
      style={{ background: card.previewBg ?? "#120c20" }}
    />
  );
}

export default function DemoCard({ card }: DemoCardProps) {
  const bc = badgeMap[card.badgeStyle] ?? badgeMap.bestseller;

  const demoUrl = card.demoSrc;

  return (
    <article
      className="card-hover flex flex-col overflow-hidden rounded-2xl border bg-white"
      style={{ borderColor: "var(--border)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
    >
      <a
        href={demoUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${card.title} demo`}
        className="relative block h-[250px] overflow-hidden sm:h-[270px]"
      >
        {card.previewImg
          ? <img
              src={card.previewImg}
              alt={`${card.title} — ${card.type} wedding invitation design by OurMoment`}
              width={600}
              height={400}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover card-img-zoom"
            />
          : <PreviewPlaceholder card={card} />
        }
        <div className="play-overlay absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.15)" }}>
          <span
            aria-hidden="true"
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/90 bg-white/20 backdrop-blur-sm transition-all duration-200 group-hover:scale-110"
          >
            <svg className="h-5 w-5 fill-white translate-x-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </span>
        </div>
        <div className="card-shimmer-border" />
        <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em]"
          style={{ background: bc.bg, color: bc.text }}>
          {card.badge}
        </span>
      </a>

      <div className="flex flex-1 flex-col px-5 py-4">
        <h3 className="font-medium leading-snug mb-4"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--text-primary)", fontSize: 20 }}>
          {card.title}
        </h3>

        {card.tags && card.tags.filter((tag) => tag !== "Live Countdown" && tag !== "Animated").length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {card.tags.filter((tag) => tag !== "Live Countdown" && tag !== "Animated").slice(0, 2).map((tag) => {
              const ts = tagStyle[tag] ?? { bg: "#FFF1F2", color: "#9F1239" };
              return <span key={tag} className="tag-pill" style={{ background: ts.bg, color: ts.color }}>{tag}</span>;
            })}
          </div>
        )}

        <div className="flex-1" />

        <div className="flex items-baseline gap-1 mb-3">
          <span className="font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: "var(--primary)", fontSize: 24, lineHeight: 1 }}>
            {card.price}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{card.priceUnit ?? "/ site"}</span>
        </div>

        <a href={PHONE_TEL}
          aria-label={`Call OurMoment to order the ${card.title} invitation`}
          className="flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-[13px] font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "var(--primary)", boxShadow: "0 2px 10px rgba(194,24,91,0.2)" }}>
          <svg className="h-3.5 w-3.5 fill-white" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/>
          </svg>
          Call to Order
        </a>
      </div>
    </article>
  );
}
