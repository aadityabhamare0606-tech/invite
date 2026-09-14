"use client";
import { useEffect, useRef, useCallback } from "react";
import DemoCard, { type DemoCardData } from "./DemoCard";

/* ── All 9 demos — intentionally varied order so no same style sits together ── */
const allCards: DemoCardData[] = [
  {
    id: "demo-9",
    badge: "Latest",
    badgeStyle: "latest",
    type: "Premium",
    title: "Veerendra & Meera — Udaipur",
    description: "The Leela Palace, Udaipur. Train arrival animation, sky lanterns, per-event flip cards, live countdown with seconds and a typewriter closing message.",
    price: "₹1,899",
    demoSrc: "/demos/demo-9/index.html",
    previewBg: "linear-gradient(145deg, #0d0a2e 0%, #1a0e4e 50%, #120830 100%)",
    previewAccent: "#2D1B69",
    tags: ["Live Countdown", "Animated", "Multi-event"],
    category: "Wedding",
  },
  {
    id: "demo-3",
    badge: "Royal",
    badgeStyle: "ookind",
    type: "Illustrated",
    title: "Rajwada Royale",
    description: "Inspired by Marathi heritage — rich saffron, deep crimson, royal motifs and scroll-driven animations. For couples who want their invite to feel like a palace.",
    price: "₹1,899",
    demoSrc: "/demos/demo-3/index.html",
    previewBg: "linear-gradient(145deg, #1e0840 0%, #341860 50%, #4e2c80 100%)",
    previewAccent: "#341860",
    tags: ["Illustrated", "Desktop Optimised", "Multi-event"],
    category: "Wedding",
  },
  {
    id: "demo-1",
    badge: "Best Seller",
    badgeStyle: "bestseller",
    type: "Classic",
    title: "Rahul Weds Namita",
    description: "Cinematic floating lanterns, animated name reveal, live countdown and a clean scroll-driven story. Elegant enough for any celebration.",
    price: "₹1,899",
    demoSrc: "/demos/demo-1/index.html",
    previewBg: "linear-gradient(145deg, #072e32 0%, #0a4e52 50%, #0e6e72 100%)",
    previewAccent: "#0a4e52",
    tags: ["Live Countdown", "Animated", "Best for Mobile"],
    category: "Wedding",
  },
  {
    id: "demo-6",
    badge: "New",
    badgeStyle: "new",
    type: "Premium",
    title: "Aarav & Meera",
    description: "Opens like a real letter — tap the wax seal to reveal. Cinematic mandap reveal, gold shimmer names, alternating timeline and a live vintage countdown.",
    price: "₹1,899",
    demoSrc: "/demos/demo-6/index.html",
    previewBg: "linear-gradient(145deg, #0a0520 0%, #160840 50%, #1e0a4e 100%)",
    previewAccent: "#160840",
    tags: ["Animated", "Unique Experience", "Best for Mobile"],
    category: "Wedding",
  },
  {
    id: "demo-5",
    badge: "Elegant",
    badgeStyle: "classic",
    type: "Premium",
    title: "Rahul & Namita — Jaipur",
    description: "An opening envelope that unfolds into a royal invite. Rambhag Palace venue, animated hero, journey milestones, gallery slideshow and live countdown.",
    price: "₹1,899",
    demoSrc: "/demos/demo-5/index.html",
    previewBg: "linear-gradient(145deg, #160840 0%, #1e0a4e 50%, #2D1B69 100%)",
    previewAccent: "#1e0a4e",
    tags: ["Best for Mobile", "Animated", "Live Countdown"],
    category: "Wedding",
  },
  {
    id: "demo-4",
    badge: "Heritage",
    badgeStyle: "premium",
    type: "Illustrated",
    title: "Rajwada Royale v2",
    description: "A bolder take on the royal aesthetic — deeper crimson, golden shimmer accents and cinematic scroll animations. Designed to impress from the first scroll.",
    price: "₹1,899",
    demoSrc: "/demos/demo-4/index.html",
    previewBg: "linear-gradient(145deg, #0F0720 0%, #1e0a4e 50%, #880E4F 100%)",
    previewAccent: "#1e0a4e",
    tags: ["Illustrated", "Premium Design", "Desktop Optimised"],
    category: "Wedding",
  },
  {
    id: "demo-2",
    badge: "Modern",
    badgeStyle: "popular",
    type: "Premium",
    title: "Abhishek & Kanika",
    description: "Three beautifully designed event cards — Mehendi, Haldi, Reception — with soft blush tones and rich typography. Share your entire wedding in one link.",
    price: "₹1,899",
    demoSrc: "/demos/demo-2/index.html",
    previewBg: "linear-gradient(145deg, #0F0720 0%, #1e0a4e 50%, #2D1B69 100%)",
    previewAccent: "#1e0a4e",
    tags: ["Multi-event", "Best for Sharing", "Premium Design"],
    category: "Wedding",
  },
  {
    id: "demo-7",
    badge: "Classic",
    badgeStyle: "classic",
    type: "Classic",
    title: "Classic — Rahul Weds Namita",
    description: "The original classic design with floating lanterns, animated name reveal and scroll-driven storytelling. Timeless and loved by guests across all age groups.",
    price: "₹1,899",
    demoSrc: "/demos/demo-7/index.html",
    previewBg: "linear-gradient(145deg, #0F0720 0%, #1a0e4e 50%, #2D1B69 100%)",
    previewAccent: "#1a0e4e",
    tags: ["Live Countdown", "Animated", "Best for Sharing"],
    category: "Wedding",
  },
  {
    id: "demo-8",
    badge: "One of a Kind",
    badgeStyle: "ookind",
    type: "Illustrated",
    title: "Rajwada Royale — Extended",
    description: "The extended royal Marathi edition with additional illustrations, deeper colour palette and enhanced scroll transitions. A truly premium experience.",
    price: "₹1,899",
    demoSrc: "/demos/demo-8/index.html",
    previewBg: "linear-gradient(145deg, #0F0720 0%, #1e0a4e 50%, #2D1B69 100%)",
    previewAccent: "#1e0a4e",
    tags: ["Illustrated", "Multi-event", "Premium Design"],
    category: "Wedding",
  },
];

const saveDateCards: DemoCardData[] = [
  {
    id: "save-1",
    badge: "Popular",
    badgeStyle: "popular",
    type: "Save the Date",
    title: "Classic Save the Date",
    description: "Elegant, minimal save the date with your names, wedding date and a live countdown. Goes out months before the wedding — guests love the simplicity.",
    price: "₹789",
    demoSrc: "/demos/demo-1/index.html",
    previewBg: "linear-gradient(145deg, #072e32 0%, #0a4e52 50%, #0e6e72 100%)",
    previewAccent: "#0a4e52",
    tags: ["Best for Mobile", "Live Countdown"],
    category: "Save the Date",
  },
  {
    id: "save-2",
    badge: "Premium",
    badgeStyle: "premium",
    type: "Save the Date",
    title: "Royal Save the Date",
    description: "Rich crimson and golden accents with your names and date front and centre. Guests will screenshot and share it the moment it lands.",
    price: "₹789",
    demoSrc: "/demos/demo-4/index.html",
    previewBg: "linear-gradient(145deg, #0F0720 0%, #1e0a4e 50%, #880E4F 100%)",
    previewAccent: "#1e0a4e",
    tags: ["Best for Sharing", "Animated"],
    category: "Save the Date",
  },
  {
    id: "save-3",
    badge: "New",
    badgeStyle: "new",
    type: "Save the Date",
    title: "Udaipur Save the Date",
    description: "The full Leela Palace experience in a single-scroll save the date. Lanterns, countdown and a typewriter message. Sets the tone for the big day.",
    price: "₹789",
    demoSrc: "/demos/demo-9/index.html",
    previewBg: "linear-gradient(145deg, #0d0a2e 0%, #1a0e4e 50%, #120830 100%)",
    previewAccent: "#2D1B69",
    tags: ["Live Countdown", "Animated", "Best for Mobile"],
    category: "Save the Date",
  },
];

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-light"
    style={{ fontFamily: "var(--font-cormorant)", color: "var(--text-primary)", fontSize: "clamp(1.8rem,4vw,2.4rem)", lineHeight: 1.1 }}>
    {children}
  </h2>
);

interface Props {
  activeFilter: string;
  onPreview: (src: string, title: string) => void;
}

export default function WeddingCollection({ activeFilter, onPreview }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  /* Re-run observer whenever filter changes — cards may have re-appeared */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target); /* unobserve after firing — clean up */
        }
      }),
      { threshold: 0.05, rootMargin: "0px 0px -30px 0px" }
    );
    /* Small delay so CSS display:none → block transition completes first */
    const t = setTimeout(() => {
      el.querySelectorAll(".reveal:not(.visible)").forEach((node) => obs.observe(node));
    }, 60);
    return () => { clearTimeout(t); obs.disconnect(); };
  }, [activeFilter]); /* re-register when filter changes */

  const weddingVisible  = activeFilter === "All" || activeFilter === "Wedding";
  const saveDateVisible = activeFilter === "All" || activeFilter === "Save the Date";

  return (
    <section id="collection" ref={ref} className="py-16 md:py-24" style={{ background: "var(--bg-base)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Wedding Collection ── */}
        {weddingVisible && (
          <div className="mb-20">
            <div className="reveal mb-10 flex items-end justify-between border-b pb-5"
              style={{ borderColor: "var(--border)" }}>
              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--primary)" }}>
                  Full wedding website
                </p>
                <SectionHeading>
                  The Wedding{" "}
                  <em className="not-italic font-semibold" style={{ color: "var(--primary)", fontStyle: "italic" }}>
                    Collection
                  </em>
                </SectionHeading>
              </div>
              <span className="hidden sm:block text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ color: "var(--primary)", background: "var(--primary-soft)", border: "1px solid var(--blush-mid)" }}>
                {allCards.length} designs
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allCards.map((card, i) => (
                <div key={card.id} className="reveal" style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
                  <DemoCard card={card} onPreview={onPreview} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Save the Date ── */}
        {saveDateVisible && (
          <div className="mb-20">
            <div className="reveal mb-10 flex items-end justify-between border-b pb-5"
              style={{ borderColor: "var(--border)" }}>
              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--primary)" }}>
                  Share it months before
                </p>
                <SectionHeading>
                  Save{" "}
                  <em className="not-italic font-semibold" style={{ color: "var(--primary)", fontStyle: "italic" }}>
                    the Date
                  </em>
                </SectionHeading>
              </div>
              <span className="hidden sm:block text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ color: "var(--primary)", background: "var(--primary-soft)", border: "1px solid var(--blush-mid)" }}>
                {saveDateCards.length} designs
              </span>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {saveDateCards.map((card, i) => (
                <div key={card.id} className="reveal" style={{ transitionDelay: `${i * 0.09}s` }}>
                  <DemoCard card={card} onPreview={onPreview} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!weddingVisible && !saveDateVisible && (
          <div className="reveal py-24 text-center">
            <p style={{ color: "var(--text-muted)" }}>
              Coming soon — <a href="https://wa.me/919999999999" style={{ color: "var(--primary)" }}>WhatsApp us</a> for a custom design.
            </p>
          </div>
        )}

        {/* ── Custom CTA ── */}
        <div className="reveal mt-4 rounded-3xl px-8 py-14 text-center overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, #880E4F 0%, #C2185B 50%, #D81B60 100%)" }}>
          <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 1px, transparent 1px, transparent 18px)" }} />
          {/* Decorative hearts */}
          <div className="absolute top-4 left-8 text-white/10 text-5xl select-none">♥</div>
          <div className="absolute bottom-4 right-8 text-white/10 text-5xl select-none">♥</div>
          <div className="relative">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Have something in mind?</p>
            <h3 className="mb-3 font-light text-white"
              style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.6rem,4vw,2.4rem)", lineHeight: 1.15 }}>
              Looking for something <em style={{ fontStyle: "italic" }}>specific?</em>
            </h3>
            <p className="mb-7 text-sm text-white/70 max-w-sm mx-auto leading-relaxed">
              Share your vision on WhatsApp — we&apos;ll design the perfect invite for your celebration.
            </p>
            <a href="https://wa.me/919999999999?text=Hi%2C%20I%27m%20looking%20for%20a%20custom%20invite"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
              style={{ color: "var(--primary)", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#25d366" }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.118 1.528 5.857L.057 23.428a.5.5 0 0 0 .623.602l5.694-1.488A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.858 9.858 0 0 1-5.031-1.376l-.36-.214-3.73.976.994-3.63-.234-.374A9.859 9.859 0 0 1 2.1 12C2.1 6.53 6.53 2.1 12 2.1c5.47 0 9.9 4.43 9.9 9.9 0 5.47-4.43 9.9-9.9 9.9z"/>
              </svg>
              Chat with us on WhatsApp
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
