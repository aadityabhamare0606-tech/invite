import { PHONE_TEL, PHONE_DISPLAY } from "@/lib/contact";

const TRUST = [
  { title: "Ready fast", sub: "24–48 hour rush option" },
  { title: "Free preview", sub: "See it before you pay" },
  { title: "Every language", sub: "Hindi · Marathi · English" },
];

/**
 * Home page hero.
 *
 * The only <h1> on the storefront — keyword-led ("Wedding invitation
 * websites") with the price and a phone-first call to action right above the
 * fold, plus a real design preview so the value is obvious instantly.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      {/* Decorative glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(194,24,91,0.10), transparent 70%)", filter: "blur(40px)" }}
        />
        <div
          className="absolute -bottom-32 right-0 h-[420px] w-[420px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(184,145,58,0.14), transparent 70%)", filter: "blur(48px)" }}
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:pt-20">
        <div>
          <p
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ borderColor: "var(--blush-mid)", background: "rgba(255,255,255,0.7)", color: "var(--primary)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--primary)" }} />
            Trusted by 2,400+ Indian couples
          </p>

          <h1
            className="mt-6 font-light leading-[1.02]"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.6rem,6.2vw,4.6rem)", color: "var(--text-primary)" }}
          >
            Wedding invitation websites your family will{" "}
            <em className="font-semibold not-italic" style={{ color: "var(--primary)", fontStyle: "italic" }}>
              actually open
            </em>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 sm:text-lg" style={{ color: "var(--text-secondary)" }}>
            Personalised, animated and shareable in one link — Mehendi to Reception, venue, gallery,
            love story and RSVP. Made for Indian weddings from{" "}
            <strong style={{ color: "var(--text-primary)" }}>₹1,499</strong>, with a free preview
            before you pay.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={PHONE_TEL}
              aria-label={`Call OurMoment to order at ${PHONE_DISPLAY}`}
              className="btn-primary inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold text-white"
              style={{ boxShadow: "0 8px 28px rgba(194,24,91,0.30)" }}
            >
              <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" />
              </svg>
              Call to order
            </a>

            <a
              href="#collection"
              className="inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-white"
              style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)", background: "rgba(255,255,255,0.6)" }}
            >
              Browse designs
              <svg className="h-4 w-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
          </div>

          <p className="mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
            Or call <strong style={{ color: "var(--text-mid)" }}>{PHONE_DISPLAY}</strong> — we usually reply within minutes.
          </p>

          <ul className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {TRUST.map((t) => (
              <li key={t.title} className="flex items-start gap-2.5">
                <span
                  className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                  style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span className="leading-snug">
                  <span className="block text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>{t.title}</span>
                  <span className="block text-[11.5px]" style={{ color: "var(--text-muted)" }}>{t.sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Design preview */}
        <div className="relative mx-auto w-full max-w-[320px]">
          <div
            className="rounded-[36px] p-2.5"
            style={{ background: "linear-gradient(150deg,#1b0a24,#4C1D95)", boxShadow: "0 30px 80px rgba(45,27,105,0.35)" }}
          >
            <div className="overflow-hidden rounded-[28px]" style={{ background: "#120a1e" }}>
              <img
                src="/assets/demos/demo-1.webp"
                alt="Animated Indian wedding invitation website design — OurMoment 'Lantern Dreams' template"
                width={640}
                height={900}
                fetchPriority="high"
                className="h-[430px] w-full object-cover"
              />
            </div>
          </div>

          <span
            className="absolute -left-3 top-8 rounded-full px-3.5 py-1.5 text-[11px] font-bold text-white shadow-lg"
            style={{ background: "var(--gradient-rose)" }}
          >
            From ₹1,499
          </span>
          <span
            className="absolute -right-3 bottom-10 rounded-full border bg-white px-3.5 py-1.5 text-[11px] font-bold shadow-lg"
            style={{ borderColor: "var(--border)", color: "var(--text-mid)" }}
          >
            Ready in 48 hrs
          </span>
        </div>
      </div>
    </section>
  );
}
