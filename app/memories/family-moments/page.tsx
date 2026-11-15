import type { Metadata } from "next";
import DemoShowcase from "@/components/DemoShowcase";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PersonalizedAddress from "@/components/PersonalizedAddress";
import { MEMORY_DEMOS } from "@/lib/demos";

export const metadata: Metadata = {
  title: "Family Moments Website — Pregnancy to Childhood Memories",
  description:
    "Explore a warm family moments website sample for pregnancy, newborn days, first words, birthdays, school milestones, photos and videos.",
  alternates: { canonical: "/memories/family-moments" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/memories/family-moments",
    title: "Family Moments — A Story to Keep · OurMoment",
    description:
      "A photo-and-video family keepsake concept for pregnancy, baby milestones, birthdays and the little years that follow.",
    images: [
      {
        url: "/demos/family-moments/images/family-outdoors.webp",
        width: 1200,
        height: 1400,
        alt: "A family sharing a joyful moment outdoors",
      },
    ],
  },
};

export default function FamilyMomentsPage() {
  return (
    <main>
      <Navbar />

      <PersonalizedAddress
        occasion="family moments"
        example="mira-family-moments.com"
        title="A little life. A story to keep."
        description="A family story that grows from the waiting days through first smiles, birthdays and every little year."
      />

      <section
        id="family-demo"
        className="py-12 sm:py-14 md:py-16"
        style={{ background: "var(--bg-base)" }}
        aria-label="Family Moments sample"
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
              Mira&apos;s little world, from hello to three.
            </h2>
          </div>
          <div className="mx-auto max-w-[500px]">
            <DemoShowcase cards={MEMORY_DEMOS.familyMoments} columns={1} />
          </div>
          <p
            className="mt-5 text-center text-[10px]"
            style={{ color: "var(--text-muted)" }}
          >
            Fictional story · Licensed sample photographs and video · Preview the full journey
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
