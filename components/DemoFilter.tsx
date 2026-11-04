"use client";

import { activeFilters, countByTag, USE_CASE_TAGS, STYLE_TAGS } from "@/lib/demos";

interface Props {
  value: string;
  onChange: (value: string) => void;
  total: number;
}

/**
 * Visitor-facing filter chips.
 *
 * "Best for mobile · Best for sharing · Corporate gifting" answers the
 * question a couple actually asks — what is this design good for? The style
 * chips answer the second question — what does it look like? Both groups
 * come from the same tag vocabulary the cards use, so a chip can never
 * appear without matching designs behind it.
 */
export default function DemoFilter({ value, onChange, total }: Props) {
  const filters = activeFilters();
  const shown = value === "All" ? total : countByTag(value);

  const isUseCase = (id: string) => (USE_CASE_TAGS as readonly string[]).includes(id);
  const isStyle = (id: string) => (STYLE_TAGS as readonly string[]).includes(id);

  const renderChip = (id: string, label: string) => {
    const count = id === "All" ? total : countByTag(id);
    const active = value === id;
    return (
      <button
        key={id}
        type="button"
        aria-pressed={active}
        onClick={() => onChange(id)}
        className="filter-chip"
      >
        {label}
        <span className="filter-chip-count">{count}</span>
      </button>
    );
  };

  return (
    <div className="reveal">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.28em]"
          style={{ color: "var(--primary)" }}
        >
          Browse by what you need
        </p>
        <p className="text-[11.5px]" style={{ color: "var(--text-muted)" }}>
          {value === "All"
            ? `${total} designs`
            : `Showing ${shown} of ${total}`}
        </p>
      </div>

      <div className="filter-bar" role="group" aria-label="Filter designs">
        {filters.map((f) => {
          const id = f.id as string;
          if (isUseCase(id)) {
            return renderChip(id, f.label);
          }
          if (isStyle(id)) {
            return (
              <span key={id} className="contents">
                <span className="filter-group-label" aria-hidden="true">Style</span>
                {renderChip(id, f.label)}
              </span>
            );
          }
          return renderChip(id, f.label);
        })}

        {value !== "All" && (
          <button
            type="button"
            onClick={() => onChange("All")}
            className="filter-chip"
            style={{ color: "var(--primary)", borderColor: "var(--blush-mid)" }}
          >
            Clear
            <svg className="h-3 w-3" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
