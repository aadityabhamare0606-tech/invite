"use client";

import { memo } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import WeddingCollection from "@/components/WeddingCollection";
import CorporateWeddingInvite from "@/components/CorporateWeddingInvite";
import CtaBanner from "@/components/CtaBanner";
import { SITE_URL } from "@/lib/seo";

const structuredData = [
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
          description:
            "A mobile-friendly wedding website with personalised names, dates, venues, events, photos and a shareable link.",
          brand: { "@type": "Brand", name: "OurMoment" },
          offers: {
            "@type": "Offer",
            price: "1299",
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: SITE_URL,
          },
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Product",
          name: "Indian wedding invitation video",
          description:
            "A personalised wedding invitation video made for sharing with family and guests on WhatsApp and Instagram.",
          brand: { "@type": "Brand", name: "OurMoment" },
          offers: {
            "@type": "Offer",
            price: "399",
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/wedding-invitation-video-india`,
          },
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "Product",
          name: "Save the date website",
          description:
            "An animated save the date page with your names, wedding date and a live countdown, shareable as one link.",
          brand: { "@type": "Brand", name: "OurMoment" },
          offers: {
            "@type": "Offer",
            price: "599",
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/save-the-date-website-india`,
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
        acceptedAnswer: {
          "@type": "Answer",
          text: "It is a personalised, mobile-friendly wedding website with your names, dates, venues, events and photos that you can share as one link on WhatsApp.",
        },
      },
      {
        "@type": "Question",
        name: "How much does a wedding invitation website cost in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Wedding invitation websites are Rs 1,299, save the date pages are Rs 599, proposal pages are Rs 499, Wedding Memories experiences are Rs 1,299 each, and wedding invitation videos start at Rs 399.",
        },
      },
      {
        "@type": "Question",
        name: "Can the website include Mehendi, Haldi, Sangeet and Reception?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The wedding invitation website can include multiple Indian wedding events, dates and venues in one shareable link.",
        },
      },
      {
        "@type": "Question",
        name: "How do I share the wedding invitation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Once your invite is ready, share the link or video directly with guests through WhatsApp, Instagram or email.",
        },
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ "@type": "ListItem", position: 1, name: "OurMoment", item: SITE_URL }],
  },
];

/* Lazy-load below-the-fold sections for a lighter first paint. They still
   server-render, so the copy and links remain crawlable. */
const FeelSection = dynamic(() => import("@/components/FeelSection"));
const WeddingVideoSection = dynamic(() => import("@/components/WeddingVideoSection"));
const HowItWorks = dynamic(() => import("@/components/HowItWorks"));
const FAQ = dynamic(() => import("@/components/FAQ"));
const Footer = dynamic(() => import("@/components/Footer"));
const TrustNumbers = dynamic(() => import("@/components/TrustNumbers"));

/* Stable wrapped components so filter state doesn't re-render them */
const StableFeelSection = memo(FeelSection);
const StableVideoSection = memo(WeddingVideoSection);
const StableHowItWorks = memo(HowItWorks);
const StableFAQ = memo(FAQ);
const StableFooter = memo(Footer);
const StableTrust = memo(TrustNumbers);

export default function Home() {
  return (
    <main>
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        />
      ))}
      <Navbar />

      {/* 1 — Website invite designs + Save the Date + Proposals, with
          use-case filters and an in-page live preview of each design. */}
      <WeddingCollection />
      <CorporateWeddingInvite />

      {/* 3 — Feel the experience (mini invite preview + feature cards) */}
      <StableFeelSection />

      {/* 4 — Video demo */}
      <StableVideoSection />

      {/* 5 — The stat cards (99% happy couples etc.) */}
      <StableTrust />

      {/* 7 — How It Works, FAQ */}
      <StableHowItWorks />
      <StableFAQ />

      {/* 8 — Closing call to action */}
      <CtaBanner
        eyebrow="Your wedding deserves this"
        title="One beautiful link for your whole wedding"
        subtitle="We’ll personalise the experience for your day. Tell us what matters to you, and we’ll shape the details together—with no extra personalisation fee."
        buttonLabel="Call to personalise"
        secondaryHref="/save-the-date"
        secondaryLabel="See save the date"
      />

      <StableFooter />
    </main>
  );
}
