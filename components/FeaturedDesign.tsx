import type { DemoCardData } from "@/lib/demos";

interface Props {
  card: DemoCardData;
}

/**
 * The one design shown in the hero of a keyword landing page.
 *
 * A full DemoCard is too much for the narrow hero column — the title, tags,
 * and price all wrap into a mess at that width. This is the
 * stripped-down version: image, name, price, and a tap to open the live
 * design. The full cards live in the section below it.
 */
export default function FeaturedDesign({ card }: Props) {
  return (
    <div>
      <a
        href={card.demoSrc}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block w-full overflow-hidden rounded-2xl border"
        style={{ borderColor: "var(--border-strong)", boxShadow: "0 24px 60px rgba(0,0,0,0.14)" }}
        aria-label={`Open the ${card.title} demo in a new tab`}
      >
        {card.previewImg ? (
          <img
            src={card.previewImg}
            alt={`${card.title} — ${card.type} wedding invitation design by OurMoment`}
            width={600}
            height={400}
            fetchPriority="high"
            decoding="async"
            className="aspect-[4/5] w-full object-cover object-[center_22%]"
          />
        ) : (
          <div
            className="aspect-[4/5] w-full"
            style={{ background: card.previewBg ?? "#120c20" }}
          />
        )}

        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.42), rgba(0,0,0,0.02) 58%, rgba(0,0,0,0.2))" }}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/90 bg-white/25 backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
            <svg className="h-6 w-6 fill-white translate-x-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="absolute bottom-4 left-0 right-0 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-white drop-shadow">
            Tap to preview
          </span>
        </span>

        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em]"
          style={{ background: "var(--primary)", color: "#fff" }}
        >
          {card.badge}
        </span>
      </a>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p
            className="truncate font-medium"
            style={{ fontFamily: "var(--font-cormorant)", color: "var(--text-primary)", fontSize: 22 }}
          >
            {card.title}
          </p>
        </div>
        <span
          className="shrink-0 font-semibold"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--primary)", fontSize: 26, lineHeight: 1 }}
        >
          {card.price}
        </span>
      </div>
    </div>
  );
}
