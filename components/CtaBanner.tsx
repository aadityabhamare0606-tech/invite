import Link from "next/link";
import { PHONE_TEL, PHONE_DISPLAY } from "@/lib/contact";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  buttonLabel?: string;
  /** Optional secondary link rendered next to the call button. */
  secondaryHref?: string;
  secondaryLabel?: string;
}

const TRUST = ["Free design preview", "48-hour rush option", "Hindi · Marathi · English"];

/**
 * Reusable closing call-to-action band.
 *
 * One phone number, one unmistakable action — used at the end of the home page
 * and on every landing page so a visitor is never more than a tap away.
 */
export default function CtaBanner({
  eyebrow = "Ready when you are",
  title,
  subtitle,
  buttonLabel = "Call to order",
  secondaryHref,
  secondaryLabel,
}: Props) {
  return (
    <section className="px-5 py-16 sm:px-8 sm:py-20">
      <div
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[28px] px-6 py-12 text-center sm:px-12 sm:py-16"
        style={{ background: "var(--gradient-rose)", boxShadow: "0 24px 70px rgba(136,14,79,0.28)" }}
      >
        {/* Decoration */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.55), transparent 45%), radial-gradient(circle at 85% 85%, rgba(255,255,255,0.4), transparent 45%)",
          }}
        />

        <div className="relative">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.32em] text-white/70">{eyebrow}</p>
          <h2
            className="mx-auto mb-4 max-w-2xl font-light text-white"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.9rem,4.5vw,2.9rem)", lineHeight: 1.1 }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">{subtitle}</p>
          )}

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={PHONE_TEL}
              aria-label={`Call OurMoment to order at ${PHONE_DISPLAY}`}
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-sm font-semibold transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] sm:w-auto"
              style={{ color: "var(--primary)", boxShadow: "0 6px 24px rgba(0,0,0,0.22)" }}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" />
              </svg>
              {buttonLabel}
            </a>

            {secondaryHref && secondaryLabel && (
              <Link
                href={secondaryHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/45 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10 sm:w-auto"
              >
                {secondaryLabel}
              </Link>
            )}
          </div>

          <p className="mt-5 text-xs font-medium text-white/70">{PHONE_DISPLAY}</p>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-2 text-[12px] font-medium text-white/85">
                <span className="text-white/70" aria-hidden="true">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
