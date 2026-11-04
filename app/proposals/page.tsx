import Navbar from "@/components/Navbar";
import DemoShowcase from "@/components/DemoShowcase";
import PersonalizedAddress from "@/components/PersonalizedAddress";
import Footer from "@/components/Footer";
import FaqList from "@/components/FaqList";
import CtaBanner from "@/components/CtaBanner";
import { SITE_URL } from "@/lib/seo";
import { PROPOSAL_DEMOS } from "@/lib/demos";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proposal Pages — Interactive ‘Will You Marry Me’ Websites",
  description:
    "Interactive proposal pages and 'will you marry me' websites that make the moment unforgettable. Playful, animated and personalised for ₹499, with one shareable link.",
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
    a: "Every proposal page is ₹499, including personalisation with your names, memories and photos. There is no extra personalisation fee.",
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

      <PersonalizedAddress
        occasion="proposal"
        example="our-yes-moment.com"
        title="Make the big question a moment of its own."
        description="Set your story, photos and question behind one thoughtful link. Send it when the moment feels right."
      />

      {/* ── Proposal list ── */}
      <section className="py-12 md:py-16" style={{ background: "var(--bg-base)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <DemoShowcase cards={PROPOSAL_DEMOS} />
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
