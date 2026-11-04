type PersonalizedAddressProps = {
  occasion: string;
  example: string;
  title: string;
  description: string;
};

export default function PersonalizedAddress({
  occasion,
  example,
  title,
  description,
}: PersonalizedAddressProps) {
  return (
    <section
      className="px-4 pb-6 pt-5 sm:px-6 sm:pb-8 lg:px-8"
      aria-label={`${occasion} personalized link`}
    >
      <div
        className="mx-auto grid max-w-7xl items-center gap-6 rounded-[26px] border px-5 py-6 sm:px-8 sm:py-7 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:gap-10 lg:px-10"
        style={{
          borderColor: "rgba(194,24,91,.16)",
          background:
            "linear-gradient(112deg,#fff8f5 0%,#fffafd 55%,#fff4f6 100%)",
          boxShadow: "0 12px 32px rgba(112,19,57,.06)",
        }}
      >
        <div className="min-w-0">
          <p
            className="mb-2 text-[10px] font-bold uppercase tracking-[.22em]"
            style={{ color: "var(--primary)" }}
          >
            Your {occasion}, made personal
          </p>
          <h2
            className="max-w-2xl font-medium leading-[1.08]"
            style={{
              fontFamily: "var(--font-cormorant)",
              color: "var(--text-primary)",
              fontSize: "clamp(1.75rem,3.8vw,2.5rem)",
            }}
          >
            {title}
          </h2>
          <p
            className="mt-2 max-w-2xl text-[13px] leading-6 sm:text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {description}
          </p>
        </div>

        <div
          className="min-w-0 rounded-2xl border bg-white/90 p-4 sm:p-5"
          style={{
            borderColor: "rgba(194,24,91,.14)",
            boxShadow: "0 6px 20px rgba(112,19,57,.055)",
          }}
          aria-label={`Example of your personal link: ${example}`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-[#f2a6a6]" />
              <span className="h-2 w-2 rounded-full bg-[#e8c47b]" />
              <span className="h-2 w-2 rounded-full bg-[#a4c69b]" />
            </div>
            <span
              className="text-[9px] font-bold uppercase tracking-[.18em]"
              style={{ color: "var(--text-muted)" }}
            >
              A preview of your link
            </span>
          </div>

          <div
            className="mt-3 flex min-h-12 min-w-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5"
            style={{ background: "var(--primary-soft)" }}
          >
            <svg
              className="h-4 w-4 shrink-0"
              viewBox="0 0 20 20"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 11.75a3.75 3.75 0 0 0 5.3 0l2.2-2.2a3.75 3.75 0 0 0-5.3-5.3l-1.26 1.26m.81 2.74a3.75 3.75 0 0 0-5.3 0l-2.2 2.2a3.75 3.75 0 1 0 5.3 5.3l1.26-1.26"
              />
            </svg>
            <span
              className="min-w-0 break-all text-sm font-bold sm:text-base"
              style={{ color: "var(--primary-deep)" }}
            >
              {example}
            </span>
          </div>

          <p
            className="mt-2 text-[10px] font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            One thoughtful link, ready to share with the people you love.
          </p>
        </div>
      </div>
    </section>
  );
}
