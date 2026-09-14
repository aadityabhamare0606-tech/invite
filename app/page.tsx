"use client";

import { useState, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WeddingCollection from "@/components/WeddingCollection";

/* Lazy-load everything below the fold — reduces initial JS parse cost */
const WeddingVideoSection = dynamic(() => import("@/components/WeddingVideoSection"), { ssr: false });
const HowItWorks         = dynamic(() => import("@/components/HowItWorks"),          { ssr: false });
const FAQ                = dynamic(() => import("@/components/FAQ"),                  { ssr: false });
const Footer             = dynamic(() => import("@/components/Footer"),               { ssr: false });

/* Stable wrapped components so filter state doesn't re-render them */
const StableVideoSection = memo(WeddingVideoSection);
const StableHowItWorks   = memo(HowItWorks);
const StableFAQ          = memo(FAQ);
const StableFooter       = memo(Footer);

export default function Home() {
  const [filter, setFilter] = useState("All");

  /* Stable callback — doesn't recreate on every render */
  const handleFilterChange = useCallback((f: string) => setFilter(f), []);

  /* Open demo directly in a new tab — no modal, no iframe lag */
  const handlePreview = useCallback((src: string) => {
    window.open(src, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <main>
      <Navbar />

      <HeroSection
        activeFilter={filter}
        onFilterChange={handleFilterChange}
      />

      <WeddingCollection
        activeFilter={filter}
        onPreview={handlePreview}
      />

      <StableVideoSection />
      <StableHowItWorks />
      <StableFAQ />
      <StableFooter />
    </main>
  );
}
