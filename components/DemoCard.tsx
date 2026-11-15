"use client";
import { PHONE_TEL } from "@/lib/contact";
import type { DemoCardData } from "@/lib/demos";

export type { DemoCardData } from "@/lib/demos";
export type { DemoBadgeStyle } from "@/lib/demos";

const badgeMap: Record<string, { bg: string; text: string }> = {
  bestseller: { bg: "#880E4F", text: "#fff"    },
  ookind:     { bg: "#4a1060", text: "#fff"    },
  popular:    { bg: "#145a32", text: "#fff"    },
  premium:    { bg: "#7a4000", text: "#fff"    },
  classic:    { bg: "#1a2a50", text: "#fff"    },
  new:        { bg: "#0a5068", text: "#fff"    },
  latest:     { bg: "#880E4F", text: "#fce4ec" },
};

const PILL_HIDDEN = new Set(["Multi-event"]);

const tagStyle: Record<string, { bg: string; color: string }> = {
  "Best for Mobile":     { bg: "#EEF4FF", color: "#1D4ED8" },
  "Best for Mobile Sharing": { bg: "#EEF4FF", color: "#1D4ED8" },
  "Best for Sharing":    { bg: "#EEF4FF", color: "#1D4ED8" },
  "Corporate Gifting":   { bg: "#FFFBEB", color: "#92400E" },
  "Most Used for Corporate Weddings": { bg: "#FFFBEB", color: "#92400E" },
  "Premium for Corporate Weddings": { bg: "#FFFBEB", color: "#92400E" },
  "More Personalised": { bg: "#FFF1F2", color: "#9F1239" },
  "Most Personalised": { bg: "#FFF1F2", color: "#9F1239" },
  "Family-Friendly": { bg: "#F0FDF4", color: "#166534" },
  "More Personalised & Family-Friendly": { bg: "#FFF1F2", color: "#9F1239" },
  "More Personalised Wedding Invite": { bg: "#FFF1F2", color: "#9F1239" },
  "Desktop Optimised":   { bg: "#FDF4FF", color: "#6B21A8" },
  "Illustrated":         { bg: "#FFFBEB", color: "#92400E" },
  "Premium Design":      { bg: "#FFF1F2", color: "#9F1239" },
  "Live Countdown":      { bg: "#F5F3FF", color: "#5B21B6" },
  "Scroll Experience":   { bg: "#F5F3FF", color: "#5B21B6" },
  "Destination Wedding": { bg: "#F0FDF4", color: "#166534" },
  "Interactive":         { bg: "#FFF1F2", color: "#9F1239" },
  "Animated":            { bg: "#FFF1F2", color: "#9F1239" },
  "Unique Experience":   { bg: "#F0FDF4", color: "#166534" },
};

function PreviewPlaceholder({ card }: { card: DemoCardData }) {
  return (
    <div className="h-full w-full" style={{ background: card.previewBg ?? "#120c20" }} />
  );
}

interface DemoCardProps {
  card: DemoCardData;
}

export default function DemoCard({ card }: DemoCardProps) {
  const bc   = badgeMap[card.badgeStyle] ?? badgeMap.bestseller;
  const pills = (card.tags ?? []).filter((tag) => !PILL_HIDDEN.has(tag)).slice(0, 2);
  const demoUrl = card.demoSrc;

  /* Flat preview — shows the screenshot / previewImg directly, exactly as
     the design looks. The phone-in-frame approach was removed: a flat crop
     communicates the design better at card size and avoids the extra DOM. */
  const previewContent = (
    <>
      {card.previewImg ? (
        <img
          src={card.previewImg}
          alt={`${card.title} — ${card.type} preview`}
          width={600}
          height={750}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top card-img-zoom"
        />
      ) : (
        <PreviewPlaceholder card={card} />
      )}

      {/* Cinematic gradient overlay — darkens bottom for readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.04) 55%, rgba(0,0,0,0.18) 100%)",
        }}
      />

      {/* Play / Preview button — centred, always visible enough on touch */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/90 bg-white/22 backdrop-blur-sm transition-transform duration-200 group-hover:scale-110"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.35)" }}
        >
          <svg className="h-5 w-5 fill-white translate-x-0.5" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>

      {/* Bottom label */}
      <span className="absolute bottom-3 left-0 right-0 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-white/90 drop-shadow">
        Preview
      </span>

      {/* Shimmer border */}
      <div className="card-shimmer-border" />

      {/* Badge */}
      <span
        className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em]"
        style={{ background: bc.bg, color: bc.text, boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}
      >
        {card.badge}
      </span>
    </>
  );

  return (
    <article
      className="demo-card-root card-hover group flex h-full flex-col overflow-hidden rounded-2xl border bg-white"
      style={{ borderColor: "var(--border)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
    >
      {/* Preview area — original aspect-ratio 4/5 */}
      <a
        href={demoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block h-[250px] overflow-hidden sm:h-[270px]"
        aria-label={`Open the ${card.title} demo in a new tab`}
      >
        {previewContent}
      </a>

      {/* Card body */}
      <div className="flex flex-1 flex-col px-5 py-4">
        <h3
          className="font-medium leading-snug"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--text-primary)", fontSize: 20 }}
        >
          {card.title}
        </h3>

        {pills.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {pills.map((tag) => {
              const ts = tagStyle[tag] ?? { bg: "#FFF1F2", color: "#9F1239" };
              return (
                <span key={tag} className="tag-pill" style={{ background: ts.bg, color: ts.color }}>
                  {tag === "Corporate Gifting" ? "Best for Corporate Weddings" : tag}
                </span>
              );
            })}
          </div>
        )}

        <div className="flex-1" />

        {!card.hidePrice && (
          <div className="mb-3 mt-3 flex items-baseline gap-1">
            <span
              className="font-semibold"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--primary)", fontSize: 26, lineHeight: 1 }}
            >
              {card.price}
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {card.priceUnit ?? "/ site"}
            </span>
          </div>
        )}

        {/* Primary CTA */}
        <a
          href={PHONE_TEL}
          aria-label={`Call to personalise — ${card.title}`}
          className="flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-[13px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: "var(--gradient-rose)", boxShadow: "0 4px 14px rgba(194,24,91,0.28)" }}
        >
          <svg className="h-3.5 w-3.5 fill-white" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/>
          </svg>
          Call to personalise
        </a>

        {/* Secondary link */}
        <a
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2.5 inline-flex items-center justify-center gap-1 text-[11.5px] font-medium transition-colors hover:text-[var(--primary)]"
          style={{ color: "var(--text-muted)" }}
        >
          Open the live design
          <svg className="h-3 w-3" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h7v7M13 3L5 11M11 13H3V5" />
          </svg>
        </a>
      </div>
    </article>
  );
}
