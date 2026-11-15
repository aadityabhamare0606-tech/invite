import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import DemoShowcase from "@/components/DemoShowcase";
import PersonalizedAddress from "@/components/PersonalizedAddress";
import { MEMORY_DEMOS } from "@/lib/demos";

export const metadata: Metadata = {
  /* No trailing "· OurMoment" — the root layout template already adds it. */
  title: "Our Family Story — Family Website Demo",
  description:
    "A real family website with sections for family history, stories, timeline, voices and contributions. View live-style demo.",
  alternates: { canonical: "/memories/family-story" },
  robots: { index: true, follow: true },
};

export default function FamilyStoryPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(1000px_560px_at_50%_0%,rgba(255,234,241,0.42),rgba(255,255,255,0))]" />
        <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-14 pb-8 sm:pt-20 sm:pb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-sm backdrop-blur-sm bg-white/90" style={{ borderColor: "var(--border)", color: "var(--primary)" }}>
            Our Family Story
          </div>
          <h1 className="mt-6 text-balance font-semibold tracking-tight" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(48px, 8vw, 86px)", lineHeight: 1.08, color: "var(--text-primary)" }}>
            Every family has a thousand little stories.
          </h1>
          <p className="mt-5 mx-auto max-w-3xl text-balance text-lg sm:text-xl" style={{ color: "var(--text-mid)", lineHeight: 1.95 }}>
            A real, living family website — just like you&apos;d share with relatives.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/memories" className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[13px] font-medium transition-colors hover:bg-[var(--primary-soft)]" style={{ borderColor: "var(--border)", color: "var(--text-mid)" }}>
              ← Back to Memories
            </Link>
            <Link href="/memories/wedding-memories" className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[13px] font-medium transition-colors hover:bg-[var(--primary-soft)]" style={{ borderColor: "var(--border)", color: "var(--text-mid)" }}>
              See Wedding Memories →
            </Link>
            <Link href="/memories/family-moments" className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[13px] font-medium transition-colors hover:bg-[var(--primary-soft)]" style={{ borderColor: "var(--border)", color: "var(--text-mid)" }}>
              Explore Family Moments →
            </Link>
          </div>
        </div>
      </section>

      <PersonalizedAddress
        occasion="family story"
        example="shah-family-stories.com"
        title="Keep every generation's story close."
        description="Gather family history, little rituals and voices into a living story your relatives can revisit."
      />

      <section className="relative py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <DemoShowcase cards={MEMORY_DEMOS.familyStory} />
        </div>
      </section>

    </main>
  );
}
