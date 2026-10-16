import Navbar from "@/components/Navbar";
import DemoCard, { type DemoCardData } from "@/components/DemoCard";
import Footer from "@/components/Footer";
import MiniMoon from "@/components/MiniMoon";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Save the Date — Announce Your Wedding Beautifully",
  description: "Animated save the date websites for Indian weddings. Scratch-to-reveal dates, scroll-driven mountain sunrises. Share one link on WhatsApp. From ₹789.",
  alternates: { canonical: "/save-the-date" },
  openGraph: {
    title: "Save the Date — Announce Your Wedding Beautifully · OurMoment",
    description: "Send a save the date your guests will screenshot the second it lands. Interactive, animated, shareable. From ₹789.",
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

export default function SaveTheDatePage() {
  return (
    <main>
      <Navbar />

      {/* Fixed mini moon — thin crescent at top that waxes to a full moon as
          you scroll (same motif as Demo 1: Vivaan & Anaya). */}
      <MiniMoon />

      {/* ── Save the Date list — directly under the navbar ── */}
      <section className="py-16 md:py-20" style={{ background: "var(--bg-base)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {saveDateCards.map((card) => (
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
              Want your names on a Save the Date?
            </h2>
            <p className="text-sm mb-6 max-w-sm mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Tell us your names, date and vibe — we&apos;ll craft a save the date your
              guests will screenshot the moment it lands.
            </p>
            <a href="https://wa.me/919999999999?text=I+want+a+custom+save+the+date+page"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full py-3 px-7 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "#25d366", boxShadow: "0 4px 16px rgba(37,211,102,0.25)" }}>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}