import Navbar from "@/components/Navbar";
import DemoCard, { type DemoCardData } from "@/components/DemoCard";
import Footer from "@/components/Footer";
import FaqList from "@/components/FaqList";
import CtaBanner from "@/components/CtaBanner";
import { PHONE_TEL, PHONE_DISPLAY } from "@/lib/contact";
import { SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proposal Pages — Interactive ‘Will You Marry Me’ Websites",
  description:
    "Interactive proposal pages and 'will you marry me' websites that make the moment unforgettable. Playful, animated and personalised from ₹499, with one shareable link.",
  keywords: [
    "proposal website India",
    "will you marry me website",
    "interactive proposal page",
    "proposal idea online",
    "romantic proposal website India",
  ],
  alternates: { canonical: "/proposals" },
  openGraph: {
    title: "Proposal Pages — Say It Beautifully · OurMoment",
    description:
      "Surprise her with an interactive proposal page she'll screenshot and share forever. From ₹499.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "OurMoment interactive proposal pages from ₹499" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Proposal Pages — Say It Beautifully · OurMoment",
    description: "An interactive proposal page she'll screenshot and keep forever. From ₹499.",
    images: ["/og-image.svg"],
  },
};

const proposalCards: DemoCardData[] = [
  {
    id: "proposal-1",
    badge: "Mischievous",
    badgeStyle: "latest",
    type: "Proposal Page",
    title: "Do You Love Me?",
    description: "A playful question page — the No button slides away every time she tries to click it. Only Yes is allowed here.",
    price: "₹499",
    priceUnit: "/ page",
    demoSrc: "/demos/demo-10/index.html",
    previewImg: "/assets/proposal-preview-1.svg",
    tags: ["Interactive", "Unique Experience"],
    category: "Proposal",
  },
  {
    id: "proposal-6",
    badge: "5 Experiences",
    badgeStyle: "premium",
    type: "Proposal Page",
    title: "Our Journey Together",
    description: "A complete multi-concept proposal: LoveOS Terminal (pink), Memory Jar with animations, Romantic Adventure game, Cosmic Finale with moving NO button, and a heartfelt love letter.",
    price: "₹799",
    priceUnit: "/ page",
    demoSrc: "/demos/proposal-journey/index.html",
    previewImg: "/assets/proposal-preview-6.svg",
    tags: ["Interactive", "5 Concepts", "Love Letter", "Best Experience"],
    category: "Proposal",
  },
  {
    id: "proposal-7",
    badge: "Heart Flow",
    badgeStyle: "new",
    type: "Proposal Page",
    title: "Floating Hearts Journey",
    description: "A heart-flowing interactive experience. Click through 7 chapters of your love story with beautiful particle effects. Hearts follow your cursor, chapters animate smoothly, and the NO button gently escapes away.",
    price: "₹599",
    priceUnit: "/ page",
    demoSrc: "/demos/floating-hearts/index.html",
    previewImg: "/assets/proposal-preview-7.svg",
    previewBg: "linear-gradient(145deg, #fff8f9 0%, #fef2f7 50%, #fde8f3 100%)",
    previewAccent: "#ff4b6e",
    tags: ["Heart Particles", "Interactive", "Mobile Optimized", "Unique"],
    category: "Proposal",
  },
];

const proposalFaqs = [
  {
    q: "What is an interactive proposal page?",
    a: "It is a small personalised web page where she clicks through your story until the big question appears — with playful details like a NO button that slides away.",
  },
  {
    q: "How do I show the proposal page to her?",
    a: "Send the private link on WhatsApp, or open it on a laptop or tablet at the moment you plan to ask.",
  },
  {
    q: "Can it be customised to our story?",
    a: "Yes. Every proposal page is personalised with your names, memories and photos.",
  },
  {
    q: "How much does a proposal page cost?",
    a: "Proposal pages start at ₹499, and richer multi-concept experiences start at ₹599 and ₹799.",
  },
];

export default function ProposalsPage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Proposal Pages",
      description:
        "Interactive, personalised proposal websites for telling someone you love them.",
      url: `${SITE_URL}/proposals`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "OurMoment", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Proposal Pages", item: `${SITE_URL}/proposals` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: proposalFaqs.map((f) => ({
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

      {/* ── Hero ── */}
      <section className="px-4 pb-4 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--primary)" }}>
            Say it beautifully
          </p>
          <h1 className="max-w-3xl font-light leading-[1.02]"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.4rem,6vw,4rem)", color: "var(--text-primary)" }}>
            Proposal pages that make the moment{" "}
            <em className="not-italic font-semibold" style={{ color: "var(--primary)", fontStyle: "italic" }}>unforgettable</em>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8" style={{ color: "var(--text-secondary)" }}>
            Interactive, animated and personalised pages for the most important question you will ever ask.
            She taps through your story, and a NO button that keeps escaping makes the answer obvious. From ₹499.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a href={PHONE_TEL}
              aria-label={`Call OurMoment to order at ${PHONE_DISPLAY}`}
              className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white"
              style={{ boxShadow: "0 8px 28px rgba(194,24,91,0.28)" }}>
              <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/></svg>
              Call to order
            </a>
            <span className="font-[var(--font-cormorant)] text-3xl" style={{ color: "var(--primary)" }}>From ₹499</span>
          </div>
        </div>
      </section>

      {/* ── Proposal list ── */}
      <section className="py-12 md:py-16" style={{ background: "var(--bg-base)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {proposalCards.map((card) => (
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
          <FaqList items={proposalFaqs} />
        </div>
      </section>

      <CtaBanner
        eyebrow="Have an idea in mind?"
        title="Tell us your story — we'll build something just for you"
        subtitle="Custom proposal pages are available for any idea. Call us and we'll plan it together."
        buttonLabel="Call now"
        secondaryHref="/"
        secondaryLabel="See wedding invites"
      />

      <Footer />
    </main>
  );
}
