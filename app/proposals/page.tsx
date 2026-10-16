import Navbar from "@/components/Navbar";
import DemoCard, { type DemoCardData } from "@/components/DemoCard";
import Footer from "@/components/Footer";
import { PHONE_TEL } from "@/lib/contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proposal Pages — Say It Beautifully",
  description: "Interactive proposal pages that make the moment unforgettable. Playful, animated, personalised — she won't be able to say no. From ₹499.",
  alternates: { canonical: "/proposals" },
  openGraph: {
    title: "Proposal Pages — Say It Beautifully · OurMoment",
    description: "Surprise her with an interactive proposal page she'll screenshot and share forever. From ₹499.",
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

export default function ProposalsPage() {
  return (
    <main>
      <Navbar />

      {/* ── Proposal list — directly under the navbar ── */}
      <section className="py-16 md:py-20" style={{ background: "var(--bg-base)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {proposalCards.map((card) => (
              <DemoCard key={card.id} card={card} />
            ))}
          </div>

          {/* More coming soon */}
          <div className="mt-12 rounded-2xl border px-8 py-10 text-center"
            style={{ borderColor: "var(--blush-mid)", background: "linear-gradient(120deg, #fff0f4, #fff8f9)" }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] mb-2" style={{ color: "var(--primary)" }}>
              More coming soon
            </p>
            <h2 className="font-light mb-3"
              style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.6rem,4vw,2.2rem)", color: "var(--text-primary)" }}>
              Have an idea in mind?
            </h2>
            <p className="text-sm mb-6 max-w-sm mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Tell us your story and we&apos;ll build something just for you.
              Custom proposal pages are available for any idea.
            </p>
            <a href={PHONE_TEL}
              className="inline-flex items-center gap-2 rounded-full py-3 px-7 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "var(--primary)", boxShadow: "0 4px 16px rgba(194,24,91,0.25)" }}>
              <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/></svg>
              Call Now
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
