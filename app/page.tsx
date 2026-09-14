"use client";

import { useState, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WeddingCollection from "@/components/WeddingCollection";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ourmoment.in";

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "OurMoment",
    url: siteUrl,
    logo: `${siteUrl}/assets/heart.svg`,
    description: "Personalised Indian wedding invitation websites and wedding invitation videos.",
    areaServed: { "@type": "Country", name: "India" },
    availableLanguage: ["English", "Hindi", "Marathi"],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "OurMoment",
    url: siteUrl,
    inLanguage: "en-IN",
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "OurMoment Indian wedding invitation services",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Product",
          name: "Personalised Indian wedding invitation website",
          description: "A mobile-friendly wedding website with personalised names, dates, venues, events, photos and a shareable link.",
          brand: { "@type": "Brand", name: "OurMoment" },
          offers: {
            "@type": "Offer",
            price: "1499",
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: siteUrl,
          },
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Product",
          name: "Indian wedding invitation video",
          description: "A personalised wedding invitation video made for sharing with family and guests on WhatsApp.",
          brand: { "@type": "Brand", name: "OurMoment" },
          offers: {
            "@type": "Offer",
            price: "399",
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: siteUrl,
          },
        },
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a digital wedding invitation website?",
        acceptedAnswer: { "@type": "Answer", text: "It is a personalised, mobile-friendly wedding website with your names, dates, venues, events and photos that you can share as one link on WhatsApp." },
      },
      {
        "@type": "Question",
        name: "How much does a wedding invitation website cost in India?",
        acceptedAnswer: { "@type": "Answer", text: "OurMoment wedding invitation websites start at ₹1,499. Wedding invitation videos start at ₹399." },
      },
      {
        "@type": "Question",
        name: "Can the website include Mehendi, Haldi, Sangeet and Reception?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. The wedding invitation website can include multiple Indian wedding events, dates and venues in one shareable link." },
      },
      {
        "@type": "Question",
        name: "How do I share the wedding invitation?",
        acceptedAnswer: { "@type": "Answer", text: "Once your invite is ready, share the link or video directly with guests through WhatsApp, Instagram or email." },
      },
    ],
  },
];

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
      {structuredData.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
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
