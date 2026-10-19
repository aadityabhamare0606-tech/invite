import Link from "next/link";
import { PHONE_TEL, PHONE_DISPLAY } from "@/lib/contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main
      className="flex min-h-screen items-center justify-center px-6 py-24 text-center"
      style={{ background: "var(--bg-hero)" }}
    >
      <div className="max-w-lg">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.32em]" style={{ color: "var(--primary)" }}>
          404
        </p>
        <h1
          className="font-light leading-tight"
          style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.2rem,6vw,3.6rem)", color: "var(--text-primary)" }}
        >
          This page isn&apos;t here
        </h1>
        <p className="mt-4 text-sm leading-relaxed sm:text-base" style={{ color: "var(--text-secondary)" }}>
          The link may have changed. Head back to our wedding invitation designs, or call us and we&apos;ll help right away.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="btn-primary inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold text-white"
            style={{ boxShadow: "0 8px 28px rgba(194,24,91,0.28)" }}
          >
            Back to OurMoment
          </Link>
          <a
            href={PHONE_TEL}
            aria-label={`Call OurMoment at ${PHONE_DISPLAY}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3.5 text-sm font-semibold"
            style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--primary)" }} aria-hidden="true">
              <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" />
            </svg>
            Call {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </main>
  );
}
