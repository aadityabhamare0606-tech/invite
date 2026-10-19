import { Plus } from "lucide-react";

export type FaqItem = { q: string; a: string };

/**
 * Accessible, SEO-friendly FAQ list.
 *
 * Uses native <details>/<summary> so every answer is present in the HTML for
 * crawlers (no client-side JavaScript required to reveal it).
 */
export default function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="space-y-2.5">
      {items.map((f) => (
        <details key={f.q} className="faq-item group">
          <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 [&::-webkit-details-marker]:hidden">
            <span className="text-sm font-semibold leading-snug sm:text-[15px]" style={{ color: "var(--text-primary)" }}>
              {f.q}
            </span>
            <span
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-200 group-open:bg-[var(--primary)] group-open:text-white"
              style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
            >
              <Plus className="h-3.5 w-3.5 transition-transform duration-200 group-open:rotate-45" />
            </span>
          </summary>
          <div className="px-6 pb-5">
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {f.a}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
