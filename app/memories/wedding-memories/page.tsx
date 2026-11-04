import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import DemoShowcase from "@/components/DemoShowcase";
import PersonalizedAddress from "@/components/PersonalizedAddress";
import { MEMORY_DEMOS } from "@/lib/demos";

export const metadata: Metadata = {
  /* No trailing "· OurMoment" — the root layout template already adds it. */
  title: "Wedding Memories — Guest Photo & Wish Collection",
  description:
    "A real-looking wedding memory archive. Organised by Haldi, Mehendi, Sangeet, Wedding & Reception. Add-on to your wedding invitation.",
  alternates: { canonical: "/memories/wedding-memories" },
  robots: { index: true, follow: true },
};

export default function WeddingMemoriesPage() {
  return (
    <main>
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(1000px_560px_at_50%_0%,rgba(255,234,241,0.42),rgba(255,255,255,0))]" />
        <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-14 pb-8 sm:pt-20 sm:pb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-sm backdrop-blur-sm bg-white/90" style={{ borderColor: "var(--border)", color: "var(--primary)" }}>
            Wedding Memories
          </div>
          <h1 className="mt-6 text-balance font-semibold tracking-tight" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(48px, 8vw, 86px)", lineHeight: 1.08, color: "var(--text-primary)" }}>
            Your wedding happens once.
          </h1>
          <p className="mt-5 mx-auto max-w-3xl text-balance text-lg sm:text-xl" style={{ color: "var(--text-mid)", lineHeight: 1.95 }}>
            The memories keep growing — collect photos, wishes &amp; voice notes from your guests.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/memories" className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[13px] font-medium transition-colors hover:bg-[var(--primary-soft)]" style={{ borderColor: "var(--border)", color: "var(--text-mid)" }}>
              ← Back to Memories
            </Link>
          </div>
        </div>
      </section>

      <PersonalizedAddress
        occasion="wedding memories"
        example="veena-aarav-moments.com"
        title="The dancing ends. The memories stay."
        description="Gather guests' photos, wishes and voice notes from every celebration in one shared keepsake."
      />

      <section className="relative py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <DemoShowcase cards={MEMORY_DEMOS.weddingMemories} />
        </div>
      </section>

    </main>
  );
}
