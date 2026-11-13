import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import DemoShowcase from "@/components/DemoShowcase";
import PersonalizedAddress from "@/components/PersonalizedAddress";
import Footer from "@/components/Footer";
import { MEMORY_DEMOS } from "@/lib/demos";

export const metadata: Metadata = {
  title: "Wedding Moments — Guest Photos, Wishes & Voice Notes | OurMoment",
  description:
    "Collect guest photos, heartfelt wishes and voice notes in one elegant digital keepsake designed to feel as personal as your celebration.",
  alternates: { canonical: "/memories" },
  robots: { index: true, follow: true },
};

export default function MemoriesPage() {
  return (
    <main className="wedding-moments-page overflow-hidden">
      <Navbar />

      <PersonalizedAddress
        occasion="wedding memories"
        example="veena-aarav-moments.com"
        title="Give your wedding a keepsake worth revisiting."
        description="Collect guest photos, heartfelt wishes and voice notes in one elegant digital keepsake designed to feel as personal as your celebration."
      />

      <section id="wedding-experiences" className="py-12 md:py-16" style={{ background: "var(--bg-base)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <DemoShowcase cards={MEMORY_DEMOS.weddingMemories} columns={2} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
