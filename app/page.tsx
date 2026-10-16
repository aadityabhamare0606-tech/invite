"use client";

import { memo } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import WeddingCollection from "@/components/WeddingCollection";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://our-moments.in";

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "OurMoment",
    url: siteUrl,
    logo: `${siteUrl}/logo.svg`,
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
        acceptedAnswer: { "@type": "Answer", text: "OurMoment wedding invitation websites start at Rs 1,499. Wedding invitation videos start at Rs 399." },
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
const FeelSection           = dynamic(() => import("@/components/FeelSection"),           { ssr: false });
const WeddingVideoSection  = dynamic(() => import("@/components/WeddingVideoSection"),  { ssr: false });
const HowItWorks           = dynamic(() => import("@/components/HowItWorks"),           { ssr: false });
const FAQ                  = dynamic(() => import("@/components/FAQ"),                   { ssr: false });
const Footer               = dynamic(() => import("@/components/Footer"),                { ssr: false });
const TrustNumbers         = dynamic(() => import("@/components/TrustNumbers"),          { ssr: false });
const Testimonials         = dynamic(() => import("@/components/Testimonials"),          { ssr: false });

/* Stable wrapped components so filter state doesn't re-render them */
const StableFeelSection    = memo(FeelSection);
const StableVideoSection   = memo(WeddingVideoSection);
const StableHowItWorks     = memo(HowItWorks);
const StableFAQ            = memo(FAQ);
const StableFooter         = memo(Footer);
const StableTrust          = memo(TrustNumbers);
const StableTestimonials   = memo(Testimonials);

export default function Home() {
  return (
    <main>
      {structuredData.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <Navbar />

      {/* 0 — Website invite designs + Save the Date + Proposals */}
      <WeddingCollection activeFilter="All" />

      {/* 1 — Feel the experience (mini invite preview + feature cards) */}
      <StableFeelSection />

      {/* 2 — Video demo */}
      <StableVideoSection />

      {/* 3 — The stat cards (99% happy couples etc.) */}
      <StableTrust />

      {/* 4 — Testimonial marquee */}
      <StableTestimonials />

      {/* 5 — How It Works, FAQ, Footer */}
      <StableHowItWorks />
      <StableFAQ />
      <StableFooter />
    </main>
  );
}