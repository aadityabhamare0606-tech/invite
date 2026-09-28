"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import DemoCard, { type DemoCardData } from "./DemoCard";

/* ── All wedding demos — intentionally varied order so no same style sits together ── */
const allCards: DemoCardData[] = [
  {
    id: "demo-1",
    badge: "Best Seller",
    badgeStyle: "bestseller",
    type: "Classic",
    title: "Rahul Weds Namita",
    description: "Cinematic floating lanterns, animated name reveal, live countdown and a clean scroll-driven story. Elegant enough for any celebration.",
    price: "₹1,499",
    demoSrc: "/demos/demo-1/index.html",
    previewImg: "/assets/demos/demo-1.webp",
    previewBg: "linear-gradient(145deg, #072e32 0%, #0a4e52 50%, #0e6e72 100%)",
    previewAccent: "#0a4e52",
    tags: ["Live Countdown", "Animated", "Our Best Seller"],
    category: "Wedding",
  },
  {
    id: "demo-8",
    badge: "One of a Kind",
    badgeStyle: "ookind",
    type: "Illustrated",
    title: "Rajwada Royale — Extended",
    description: "The extended royal Marathi edition with additional illustrations and enhanced scroll transitions.",
    price: "₹1,499",
    demoSrc: "/demos/demo-8/index.html",
    previewImg: "/assets/demos/demo-8.webp",
    previewBg: "linear-gradient(145deg, #0F0720 0%, #1e0a4e 50%, #2D1B69 100%)",
    previewAccent: "#1e0a4e",
    tags: ["Illustrated", "Multi-event", "Premium Design"],
    category: "Wedding",
  },
  {
    id: "wedding-invite-7",
    badge: "Celestial Story",
    badgeStyle: "ookind",
    type: "Premium",
    title: "Vivaan & Anaya — A Moonlit Wedding",
    description: "A complete celestial wedding invitation with a seal-opening reveal, scroll-filled moon, interactive love story, five celebrations, Udaipur venue, live countdown, RSVP, sharing and calendar downloads.",
    price: "₹1,999",
    demoSrc: "/demos/wedding-invite-7/index.html",
    previewImg: "/assets/demos/wedding-invite-7.webp",
    previewBg: "linear-gradient(145deg, #0c091b 0%, #2b1b3a 52%, #355f58 100%)",
    previewAccent: "#e6c97c",
    tags: ["Premium Design", "Multi-event", "Live Countdown", "Best for Sharing"],
    category: "Wedding",
  },
  {
    id: "demo-trial",
    badge: "Trial",
    badgeStyle: "new",
    type: "Premium",
    title: "Trial — Abhishek & Kanika",
    description: "Our most advanced wedding demo yet — a tall cinematic hero for Abhishek & Kanika, three event cards each in their own light blue that flip in 3D to reveal the details, a date-reveal section before the venue, a live countdown with per-digit flips, floating hearts, a photo carousel, and the couple's story on a drawn timeline. Fully self-contained, no internet needed.",
    price: "₹1,499",
    demoSrc: "/demos/trial/index.html",
    previewImg: "/assets/demos/trial.webp",
    previewBg: "linear-gradient(145deg, #0F0720 0%, #1e0a4e 50%, #2D1B69 100%)",
    previewAccent: "#1e0a4e",
    tags: ["Multi-event", "Best for Sharing", "Premium Design"],
    category: "Wedding",
  },
  {
    id: "demo-9",
    badge: "Latest",
    badgeStyle: "latest",
    type: "Premium",
    title: "Aarav & Meera — The Letter",
    description: "Opens like a hand-written letter — tap the wax seal to enter. Cinematic bloom reveal, flickering diyas, a secret P.S. letter, 3D-flip event cards with add-to-calendar, hidden story memories and a live countdown.",
    price: "₹1,499",
    demoSrc: "/demos/demo-9/index.html",
    previewImg: "/assets/demos/demo-9.webp",
    previewBg: "linear-gradient(145deg, #2d1220 0%, #1a0a20 50%, #0e0810 100%)",
    previewAccent: "#7a1e35",
    tags: ["Animated", "Unique Experience", "Best for Sharing", "Live Countdown"],
    category: "Wedding",
  },
  {
    id: "demo-3",
    badge: "Royal",
    badgeStyle: "ookind",
    type: "Illustrated",
    title: "Rajwada Royale",
    description: "Deep royal purple meets golden shimmer — Marathi heritage inspired with scroll-driven animations, 3D flip event cards, and cinematic transitions.",
    price: "₹1,499",
    demoSrc: "/demos/demo-3/index.html",
    previewImg: "/assets/demos/demo-3.webp",
    previewBg: "linear-gradient(145deg, #0F0720 0%, #1e0a4e 50%, #2D1B69 100%)",
    previewAccent: "#1e0a4e",
    tags: ["Illustrated", "Premium Design", "Multi-event"],
    category: "Wedding",
  }
];

const saveDateCards: DemoCardData[] = [
  {
    id: "save-the-date-1",
    badge: "Reveal the Date",
    badgeStyle: "popular",
    type: "Save the Date",
    title: "Reveal the Date",
    description: "A destination-themed save the date — guests scratch the date tokens to reveal Vivaan & Anaya's 21 Nov 2027 wedding in Udaipur, with a live countdown and glass event cards.",
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
    id: "save-the-date-2",
    badge: "Cinematic",
    badgeStyle: "premium",
    type: "Save the Date",
    title: "The Golden Invitation",
    description: "A dark wine-and-gold envelope experience — tap the wax seal to open the invite for Kabir & Aarohi's 18 Dec 2027 wedding, with ambient music, gold sparkles and 3D-tilt event cards.",
    price: "₹789",
    priceUnit: "/ save the date",
    demoSrc: "/demos/save-the-date-2/index.html",
    previewImg: "/assets/demos/save-the-date-2.webp",
    previewBg: "linear-gradient(145deg, #1c0a13 0%, #3d0f1e 50%, #8a5a00 100%)",
    previewAccent: "#3d0f1e",
    tags: ["Animated", "Unique Experience", "Best for Sharing"],
    category: "Save the Date",
  },
  {
    id: "save-the-date-3",
    badge: "Love in Bloom",
    badgeStyle: "new",
    type: "Save the Date",
    title: "Love in Bloom",
    description: "A pastel rose story page for Ishaan & Myra's 14 Feb 2028 wedding — a rolling 'Save the Date' stamp, floating hearts, polaroids, countdown and hashtag #MyraAurIshaan.",
    price: "₹789",
    priceUnit: "/ save the date",
    demoSrc: "/demos/save-the-date-3/index.html",
    previewImg: "/assets/demos/save-the-date-3.webp",
    previewBg: "linear-gradient(145deg, #fdeef4 0%, #fbd7e6 50%, #f7b7cc 100%)",
    previewAccent: "#f7b7cc",
    tags: ["Animated", "Best for Mobile", "Live Countdown"],
    category: "Save the Date",
  },
];

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
    previewBg: "linear-gradient(145deg, #0a0010 0%, #3d0020 50%, #6b0035 100%)",
    previewAccent: "#6b0035",
    tags: ["Interactive", "Unique Experience"],
    category: "Proposal",
  },
  {
    id: "proposal-2",
    badge: "Heartfelt",
    badgeStyle: "ookind",
    type: "Proposal Page",
    title: "A Letter, Just for You",
    description: "Tap the wax-sealed envelope on a candlelit desk. It opens, and the letter types itself out line by line with floating hearts.",
    price: "₹499",
    priceUnit: "/ page",
    demoSrc: "/demos/demo-11/index.html",
    previewImg: "/assets/proposal-preview-2.svg",
    previewBg: "linear-gradient(145deg, #0e0702 0%, #1a0e06 50%, #140804 100%)",
    previewAccent: "#1a0e06",
    tags: ["Animated", "Unique Experience"],
    category: "Proposal",
  },
  {
    id: "proposal-3",
    badge: "Hacker",
    badgeStyle: "new",
    type: "Proposal Page",
    title: "LoveOS Terminal",
    description: "Boots like a hacker's terminal — matrix rain, typewriter boot sequence, love stats panel, No button shrinks and vanishes. Unmistakably nerdy and unforgettably romantic.",
    price: "₹499",
    priceUnit: "/ page",
    demoSrc: "/demos/demo-12/index.html",
    previewImg: "/assets/proposal-preview-3.svg",
    previewBg: "linear-gradient(145deg, #020c06 0%, #040f08 50%, #020c06 100%)",
    previewAccent: "#004422",
    tags: ["Interactive", "Unique Experience"],
    category: "Proposal",
  },
  {
    id: "proposal-4",
    badge: "Memory Jar",
    badgeStyle: "premium",
    type: "Proposal Page",
    title: "A Jar of Memories",
    description: "Tap the mason jar to release 5 folded notes — each one a heartfelt memory that flips open one by one. Warm, tactile, completely original.",
    price: "₹499",
    priceUnit: "/ page",
    demoSrc: "/demos/demo-13/index.html",
    previewImg: "/assets/proposal-preview-4.svg",
    previewBg: "linear-gradient(145deg, #FFF8F0 0%, #FFF4E8 50%, #FFF0EC 100%)",
    previewAccent: "#f5e0c0",
    tags: ["Interactive", "Unique Experience"],
    category: "Proposal",
  },
  {
    id: "proposal-5",
    badge: "Cute",
    badgeStyle: "classic",
    type: "Proposal Page",
    title: "Will You Be Mine?",
    description: "Full-screen pink, a floating GIF in a circle frame, canvas-confetti dual burst on Yes, and a warm second page — the classic done beautifully.",
    price: "₹499",
    priceUnit: "/ page",
    demoSrc: "/demos/demo-14/index.html",
    previewImg: "/assets/proposal-preview-5.svg",
    previewBg: "linear-gradient(145deg, #ff6b9d 0%, #ff8ba7 50%, #ffd1dc 100%)",
    previewAccent: "#ff8ba7",
    tags: ["Animated", "Best for Mobile"],
    category: "Proposal",
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
  onPreview?: (src: string, title: string) => void;
}

export default function WeddingCollection({ activeFilter }: Props) {
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

  const weddingVisible = activeFilter === "All" || activeFilter === "Wedding";

  /* one card per demo — the letter experience is demo-9, shown once */

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
                  <DemoCard card={card} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Save the Date ── */}
        <div id="save-the-date" className="mb-20">
          {/* Section divider */}
          <div className="reveal mb-10">
            <div className="flex items-end justify-between border-b pb-5" style={{ borderColor: "var(--border)" }}>
              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--primary)" }}>
                  Months before the big day
                </p>
                <SectionHeading>
                  Save the{" "}
                  <em className="not-italic font-semibold" style={{ color: "var(--primary)", fontStyle: "italic" }}>
                    Date
                  </em>
                </SectionHeading>
              </div>
              <Link href="/save-the-date"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 hover:bg-[var(--primary)] hover:text-white"
                style={{ color: "var(--primary)", background: "var(--primary-soft)", border: "1px solid var(--blush-mid)" }}>
                View all
                <svg className="h-3 w-3" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
            </div>
            {/* Teaser text */}
            <p className="mt-4 text-sm leading-relaxed max-w-xl" style={{ color: "var(--text-secondary)" }}>
              Announce your wedding months in advance with a save the date your guests
              will screenshot the second it lands. Three fresh designs — scratch-to-reveal,
              a cinematic envelope, and a blooming love story.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {saveDateCards.map((card, i) => (
              <div key={card.id} className="reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                <DemoCard card={card} />
              </div>
            ))}
          </div>

          {/* Save the Date teaser CTA strip */}
          <div className="reveal mt-8 rounded-2xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border"
            style={{ background: "linear-gradient(120deg, #fff5e8 0%, #fff8f2 100%)", borderColor: "var(--blush-mid)" }}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] mb-1" style={{ color: "var(--primary)" }}>Starting at ₹789</p>
              <p className="text-sm font-medium" style={{ color: "var(--text-mid)" }}>
                Your names, your date, your story — shareable with one link.
              </p>
            </div>
            <a href="https://wa.me/919999999999?text=Hi%2C%20I%27m%20interested%20in%20a%20Save%20the%20Date"
              target="_blank" rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white transition-all hover:scale-[1.03]"
              style={{ background: "linear-gradient(135deg,#880E4F,#C2185B)", boxShadow: "0 4px 16px rgba(194,24,91,0.28)" }}>
              <svg className="h-3.5 w-3.5 fill-white" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.118 1.528 5.857L.057 23.428a.5.5 0 0 0 .623.602l5.694-1.488A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.858 9.858 0 0 1-5.031-1.376l-.36-.214-3.73.976.994-3.63-.234-.374A9.859 9.859 0 0 1 2.1 12C2.1 6.53 6.53 2.1 12 2.1c5.47 0 9.9 4.43 9.9 9.9 0 5.47-4.43 9.9-9.9 9.9z"/>
              </svg>
              Get your Save the Date
            </a>
          </div>
        </div>

        {/* ── Proposal Pages ── */}
        <div id="proposals" className="mb-20">
          {/* Section divider */}
          <div className="reveal mb-10">
            <div className="flex items-end justify-between border-b pb-5" style={{ borderColor: "var(--border)" }}>
              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--primary)" }}>
                  Say it beautifully
                </p>
                <SectionHeading>
                  Proposal{" "}
                  <em className="not-italic font-semibold" style={{ color: "var(--primary)", fontStyle: "italic" }}>
                    Pages
                  </em>
                </SectionHeading>
              </div>
              <Link href="/proposals"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 hover:bg-[var(--primary)] hover:text-white"
                style={{ color: "var(--primary)", background: "var(--primary-soft)", border: "1px solid var(--blush-mid)" }}>
                View all
                <svg className="h-3 w-3" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
            </div>
            {/* Teaser text */}
            <p className="mt-4 text-sm leading-relaxed max-w-xl" style={{ color: "var(--text-secondary)" }}>
              Because the most important question deserves the most memorable moment.
              Each page is a one-of-a-kind interactive experience — personalised and shareable with one link.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {proposalCards.map((card, i) => (
              <div key={card.id} className="reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                <DemoCard card={card} />
              </div>
            ))}
          </div>

          {/* Proposal teaser CTA strip */}
          <div className="reveal mt-8 rounded-2xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border"
            style={{ background: "linear-gradient(120deg, #fff0f4 0%, #fff5f9 100%)", borderColor: "var(--blush-mid)" }}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] mb-1" style={{ color: "var(--primary)" }}>Starting at ₹499</p>
              <p className="text-sm font-medium" style={{ color: "var(--text-mid)" }}>
                Personalised to your names, your story, your moment.
              </p>
            </div>
            <a href="https://wa.me/919999999999?text=Hi%2C%20I%27m%20interested%20in%20a%20Proposal%20Page"
              target="_blank" rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white transition-all hover:scale-[1.03]"
              style={{ background: "linear-gradient(135deg,#880E4F,#C2185B)", boxShadow: "0 4px 16px rgba(194,24,91,0.28)" }}>
              <svg className="h-3.5 w-3.5 fill-white" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.118 1.528 5.857L.057 23.428a.5.5 0 0 0 .623.602l5.694-1.488A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.858 9.858 0 0 1-5.031-1.376l-.36-.214-3.73.976.994-3.63-.234-.374A9.859 9.859 0 0 1 2.1 12C2.1 6.53 6.53 2.1 12 2.1c5.47 0 9.9 4.43 9.9 9.9 0 5.47-4.43 9.9-9.9 9.9z"/>
              </svg>
              Get your Proposal Page
            </a>
          </div>
        </div>

        {/* ── Custom CTA ── */}
        <div className="reveal mt-4 rounded-3xl px-8 py-14 text-center overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, #880E4F 0%, #C2185B 50%, #D81B60 100%)" }}>
          <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 1px, transparent 1px, transparent 18px)" }} />
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
