import type { Metadata } from "next";
import Link from "next/link";
import DemoShowcase from "@/components/DemoShowcase";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PersonalizedAddress from "@/components/PersonalizedAddress";
import { MEMORY_DEMOS } from "@/lib/demos";

export const metadata: Metadata = {
  title: "Family Moments Website for Baby's First Year",
  description:
    "Explore a photo-led family moments website sample for pregnancy, baby milestones, birthday memories and family voices.",
  alternates: { canonical: "/memories/family-moments" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/memories/family-moments",
    title: "Family Moments — A Baby's First-Year Website Sample",
    description:
      "A warm family website concept for pregnancy, a baby's milestones, photographs and messages from loved ones.",
    images: [
      {
        url: "/demos/family-moments/images/family-outdoors.webp",
        width: 1200,
        height: 1400,
        alt: "Parents lifting their child together outdoors",
      },
    ],
  },
};

export default function FamilyMomentsPage() {
  return (
    <main>
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(1000px_560px_at_50%_0%,rgba(255,234,241,0.5),rgba(255,255,255,0))]" />
        <div className="mx-auto max-w-6xl px-5 pb-9 pt-14 text-center sm:px-8 sm:pb-10 sm:pt-20">
          <div
            className="inline-flex items-center gap-2 rounded-full border bg-white/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-sm backdrop-blur-sm"
            style={{ borderColor: "var(--border)", color: "var(--primary)" }}
          >
            Family Moments
          </div>
          <h1
            className="mt-6 text-balance font-semibold tracking-tight"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(48px, 8vw, 86px)",
              lineHeight: 1.04,
              color: "var(--text-primary)",
            }}
          >
            A little life. A story to keep.
          </h1>
          <p
            className="mx-auto mt-5 max-w-3xl text-balance text-base sm:text-xl"
            style={{ color: "var(--text-mid)", lineHeight: 1.8 }}
          >
            Pregnancy, first smiles, family photographs and the milestones
            everyone wants to remember.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/memories"
              className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[13px] font-medium transition-colors hover:bg-[var(--primary-soft)]"
              style={{ borderColor: "var(--border)", color: "var(--text-mid)" }}
            >
              ← Back to Memories
            </Link>
            <Link
              href="/demos/family-moments/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white transition-transform hover:scale-[1.03]"
              style={{
                background: "var(--gradient-rose)",
                boxShadow: "0 4px 16px rgba(194,24,91,0.22)",
              }}
            >
              Explore Mira&apos;s sample
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <PersonalizedAddress
        occasion="family moments"
        example="mira-family-moments.com"
        title="Every first, in one place to revisit."
        description="A family keepsake concept for pregnancy, early milestones, birthday memories and the people who make every year special."
      />

      <section
        id="family-demo"
        className="py-10 sm:py-14"
        style={{ background: "var(--bg-base)" }}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 text-center">
            <p
              className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em]"
              style={{ color: "var(--primary)" }}
            >
              A sample family story
            </p>
            <h2
              className="font-[var(--font-cormorant)] text-3xl font-medium sm:text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              Meet Mira and explore her first year.
            </h2>
          </div>
          <div className="mx-auto max-w-[430px]">
            <DemoShowcase cards={MEMORY_DEMOS.familyMoments} columns={1} />
          </div>
          <p
            className="mt-5 text-center text-[10px]"
            style={{ color: "var(--text-muted)" }}
          >
            Fictional family · Stock photographs · Sample interactions
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
