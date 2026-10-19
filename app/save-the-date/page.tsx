import Navbar from "@/components/Navbar";
import DemoCard, { type DemoCardData } from "@/components/DemoCard";
import Footer from "@/components/Footer";
import MiniMoon from "@/components/MiniMoon";
import FaqList from "@/components/FaqList";
import CtaBanner from "@/components/CtaBanner";
import { PHONE_TEL, PHONE_DISPLAY } from "@/lib/contact";
import { SITE_URL } from "@/lib/seo";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Save the Date Websites — Announce Your Wedding Beautifully",
  description:
    "Animated save the date websites for Indian weddings. Scratch-to-reveal dates and scroll-driven mountain sunrises, shareable in one link. From ₹789.",
  keywords: [
    "save the date website India",
    "save the date invitation online",
    "wedding date announcement India",
    "digital save the date card",
  ],
  alternates: { canonical: "/save-the-date" },
  openGraph: {
    title: "Save the Date — Announce Your Wedding Beautifully · OurMoment",
    description: "Send a save the date your guests will screenshot the second it lands. Interactive, animated, shareable. From ₹789.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "OurMoment animated save the date pages from ₹789" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Save the Date — Announce Your Wedding Beautifully · OurMoment",
    description: "An animated save the date your guests will screenshot the second it lands. From ₹789.",
    images: ["/og-image.svg"],
  },
};

const saveDateCards: DemoCardData[] = [
  {
    id: "save-the-date-1",
    badge: "Reveal the Date",
    badgeStyle: "popular",
    type: "Save the Date",
    title: "Scratch & Reveal",
    description: "A destination-themed save the date — guests scratch the date tokens to reveal the wedding date, location and countdown. Beautiful glass event cards included.",
    price: "₹789",
    priceUnit: "/ save the date",
    demoSrc: "/demos/save-the-date-1/index.html",
    previewImg: "/assets/demos/save-the-date-1.webp",
    previewBg: "linear-gradient(145deg, #4b2e1a 0%, #7A1021 50%, #355f58 100%)",
    previewAccent: "#7A1021",
    tags: ["Interactive", "Live Countdown", "Best for Sharing"],
    category: "Save the Date",
  },
  {
    id: "save-the-date-mountain",
    badge: "NEW",
    badgeStyle: "new",
    type: "Save the Date",
    title: "Mountain Sunrise",
    description: "Scroll and watch midnight turn to sunrise — the sky brightens, stars fade, a Himalayan panorama glows golden, and your wedding date rises with the sun. Three events, three skies: dawn mist, golden noon, violet dusk.",
    price: "₹789",
    priceUnit: "/ save the date",
    demoSrc: "/demos/save-the-date-mountain/index.html",
    previewImg: "/assets/demos/save-the-date-mountain.webp",
    previewBg: "linear-gradient(145deg, #0a0f1e 0%, #4a2060 50%, #f07030 100%)",
    previewAccent: "#f5c060",
    tags: ["Scroll Experience", "Destination Wedding", "Live Countdown", "Best for Sharing"],
    category: "Save the Date",
  },
];

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
    a: "OurMoment save the date pages start at ₹789 and include personalisation with your names, date and story.",
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

      {/* ── Hero ── */}
      <section className="px-4 pb-4 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--primary)" }}>
            Months before the big day
          </p>
          <h1 className="max-w-3xl font-light leading-[1.02]"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.4rem,6vw,4rem)", color: "var(--text-primary)" }}>
            Save the date websites guests will{" "}
            <em className="not-italic font-semibold" style={{ color: "var(--primary)", fontStyle: "italic" }}>screenshot instantly</em>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8" style={{ color: "var(--text-secondary)" }}>
            Announce your wedding months in advance with an animated, interactive save the date — your names,
            date and a live countdown in one beautiful link. From ₹789.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a href={PHONE_TEL}
              aria-label={`Call OurMoment to order at ${PHONE_DISPLAY}`}
              className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white"
              style={{ boxShadow: "0 8px 28px rgba(194,24,91,0.28)" }}>
              <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/></svg>
              Call to order
            </a>
            <Link href="/save-the-date-website-india"
              className="inline-flex items-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold"
              style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}>
              Learn more
            </Link>
            <span className="font-[var(--font-cormorant)] text-3xl" style={{ color: "var(--primary)" }}>From ₹789</span>
          </div>
        </div>
      </section>

      {/* ── Save the Date list ── */}
      <section className="py-12 md:py-16" style={{ background: "var(--bg-base)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {saveDateCards.map((card) => (
              <DemoCard key={card.id} card={card} />
            ))}
          </div>
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
        buttonLabel="Call to order"
        secondaryHref="/"
        secondaryLabel="See wedding invites"
      />

      <Footer />
    </main>
  );
}
