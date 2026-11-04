import Navbar from "@/components/Navbar";
import DemoShowcase from "@/components/DemoShowcase";
import PersonalizedAddress from "@/components/PersonalizedAddress";
import Footer from "@/components/Footer";
import MiniMoon from "@/components/MiniMoon";
import FaqList from "@/components/FaqList";
import CtaBanner from "@/components/CtaBanner";
import { SITE_URL } from "@/lib/seo";
import { SAVE_THE_DATE_DEMOS } from "@/lib/demos";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Save the Date Websites — Announce Your Wedding Beautifully",
  description:
    "Animated save the date websites for Indian weddings. Scratch-to-reveal dates and scroll-driven mountain sunrises, shareable in one link. ₹599.",
  keywords: [
    "save the date website India",
    "save the date invitation online",
    "wedding date announcement India",
    "digital save the date card",
  ],
  alternates: { canonical: "/save-the-date" },
  openGraph: {
    title: "Save the Date — Announce Your Wedding Beautifully · OurMoment",
    description: "Send a save the date your guests will screenshot the second it lands. Interactive, animated, shareable. ₹599.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "OurMoment animated save the date pages" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Save the Date — Announce Your Wedding Beautifully · OurMoment",
    description: "An animated save the date your guests will screenshot the second it lands. ₹599.",
    images: ["/og-image.svg"],
  },
};

const saveDateFaqs = [
  {
    q: "When should we send a save the date?",
    a: "For weddings with outstation guests, send it six to twelve months ahead. For local weddings, three to six months works well.",
  },
  {
    q: "What is the difference between a save the date and the invitation?",
    a: "A save the date announces the date early so guests can plan. The full invitation later carries every event, venue, timing and RSVP.",
  },
  {
    q: "How much does a save the date website cost?",
    a: "Every save the date design is ₹599 and includes personalisation with your names, date and story, with no extra personalisation fee.",
  },
];

export default function SaveTheDatePage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Save the Date Websites",
      description: "Animated save the date pages for Indian weddings, shareable as one link.",
      url: `${SITE_URL}/save-the-date`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "OurMoment", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Save the Date", item: `${SITE_URL}/save-the-date` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: saveDateFaqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

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

      {/* Fixed mini moon — thin crescent at top that waxes to a full moon as you scroll. */}
      <MiniMoon />

      <PersonalizedAddress
        occasion="save the date"
        example="veena-weds-aarav.com"
        title="Give your date a first look they'll remember."
        description="Share your names, wedding date and countdown in one beautiful link—easy to send while everyone makes plans."
      />

      {/* ── Save the Date list ── */}
      <section className="py-12 md:py-16" style={{ background: "var(--bg-base)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <DemoShowcase cards={SAVE_THE_DATE_DEMOS} />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8" style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 font-[var(--font-cormorant)] text-4xl" style={{ color: "var(--text-primary)" }}>
            Frequently asked questions
          </h2>
          <FaqList items={saveDateFaqs} />
        </div>
      </section>

      <CtaBanner
        eyebrow="Want your names on a save the date?"
        title="Tell us your date — we'll craft the announcement"
        subtitle="Send your names, date and vibe and we'll create a save the date your guests will screenshot the moment it lands."
        buttonLabel="Call to personalise"
        secondaryHref="/"
        secondaryLabel="See wedding invites"
      />

      <Footer />
    </main>
  );
}
