"use client";

import { useEffect, useRef, useState } from "react";

export type DemoCardData = {
  id: string;
  badge: string;
  badgeStyle: "bestseller" | "ookind" | "popular" | "premium" | "classic" | "new" | "latest";
  type: string;
  title: string;
  description: string;  /* kept in data but NOT shown on card */
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
  onPreview: (src: string, title: string) => void;
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

/* Tag colour map - clean, minimal */
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

/* Show the same real demo homepage that opens from the card CTA. */
function PreviewPlaceholder({ card }: { card: DemoCardData }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px 0px", threshold: 0.01 }
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frameRef} className="relative h-full w-full overflow-hidden bg-[#120c20]">
      {shouldLoad && <iframe
          src={card.demoSrc}
          title={`${card.title} website preview`}
          loading="lazy"
          scrolling="no"
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full border-0"
        />}
    </div>
  );
}

export default function DemoCard({ card, onPreview }: DemoCardProps) {
  const bc = badgeMap[card.badgeStyle] ?? badgeMap.bestseller;

  return (
    <article
      className="card-hover flex flex-col overflow-hidden rounded-2xl border bg-white"
      style={{ borderColor: "var(--border)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
    >
      {/* Preview */}
      <div className="relative h-[250px] overflow-hidden sm:h-[270px]">
        {card.previewImg
          ? <img src={card.previewImg} alt={card.title} loading="lazy" className="h-full w-full object-cover card-img-zoom" />
          : <PreviewPlaceholder card={card} />
        }
        {/* Click overlay */}
        <div className="play-overlay absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.15)" }}>
          <button onClick={() => onPreview(card.demoSrc, card.title)} aria-label={`Preview ${card.title}`}
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/90 bg-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110">
            <svg className="h-5 w-5 fill-white translate-x-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </button>
        </div>
        <div className="card-shimmer-border" />
        {/* Badge */}
        <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em]"
          style={{ background: bc.bg, color: bc.text }}>
          {card.badge}
        </span>
      </div>

      {/* Card body — clean, no description */}
      <div className="flex flex-1 flex-col px-5 py-4">
        {/* Title */}
        <h3 className="font-medium leading-snug mb-4"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--text-primary)", fontSize: 20 }}>
          {card.title}
        </h3>

        {/* Tags — max 2 shown */}
        {card.tags && card.tags.filter((tag) => tag !== "Live Countdown" && tag !== "Animated").length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {card.tags.filter((tag) => tag !== "Live Countdown" && tag !== "Animated").slice(0, 2).map((tag) => {
              const ts = tagStyle[tag] ?? { bg: "#FFF1F2", color: "#9F1239" };
              return <span key={tag} className="tag-pill" style={{ background: ts.bg, color: ts.color }}>{tag}</span>;
            })}
          </div>
        )}

        <div className="flex-1" />

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-3">
          <span className="font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: "var(--primary)", fontSize: 24, lineHeight: 1 }}>
            {card.price}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{card.priceUnit ?? "/ site"}</span>
        </div>

        {/* Open Demo */}
        <button onClick={() => onPreview(card.demoSrc, card.title)}
          className="mb-2.5 flex w-full items-center justify-center gap-1.5 rounded-full border py-2.5 text-[13px] font-semibold transition-all duration-200 hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)]"
          style={{ borderColor: "var(--border-strong)", color: "var(--text-mid)" }}>
          Open Demo
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4"/></svg>
        </button>

        {/* WhatsApp */}
        <a href={`https://wa.me/919999999999?text=Hi%2C%20I%27m%20interested%20in%20%22${encodeURIComponent(card.title)}%22`}
          target="_blank" rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-[13px] font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "#25d366", boxShadow: "0 2px 10px rgba(37,211,102,0.2)" }}>
          <svg className="h-3.5 w-3.5 fill-white" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.118 1.528 5.857L.057 23.428a.5.5 0 0 0 .623.602l5.694-1.488A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.858 9.858 0 0 1-5.031-1.376l-.36-.214-3.73.976.994-3.63-.234-.374A9.859 9.859 0 0 1 2.1 12C2.1 6.53 6.53 2.1 12 2.1c5.47 0 9.9 4.43 9.9 9.9 0 5.47-4.43 9.9-9.9 9.9z"/>
          </svg>
          Purchase on WhatsApp
        </a>
      </div>
    </article>
  );
}
