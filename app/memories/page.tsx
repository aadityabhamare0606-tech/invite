import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import DemoShowcase from "@/components/DemoShowcase";
import PersonalizedAddress from "@/components/PersonalizedAddress";
import Footer from "@/components/Footer";
import { PHONE_TEL, PHONE_DISPLAY } from "@/lib/contact";
import { MEMORY_DEMOS } from "@/lib/demos";

export const metadata: Metadata = {
  title: "Wedding Moments — Guest Photos & Wishes | OurMoment",
  description:
    "Keep every celebration close. Explore wedding guest photos, heartfelt wishes and voice notes in two beautiful keepsake experiences.",
  alternates: { canonical: "/memories" },
  robots: { index: true, follow: true },
};

const keepsakeFeatures = [
  {
    number: "01",
    title: "Every function, together",
    description: "Bring Haldi, Mehendi, Sangeet, the ceremony and reception into one shared celebration.",
    icon: "✳",
  },
  {
    number: "02",
    title: "More than photographs",
    description: "Keep the candid frames, heartfelt wishes and familiar voices that make the day yours.",
    icon: "♡",
  },
  {
    number: "03",
    title: "Made to revisit",
    description: "Give your guests one lovely place to share, and your family a keepsake to return to.",
    icon: "↗",
  },
];

export default function MemoriesPage() {
  return (
    <main className="wedding-moments-page overflow-hidden">
      <style>{`
        @keyframes keepsake-sheen {
          from { transform: translateX(-140%) rotate(18deg); }
          to { transform: translateX(240%) rotate(18deg); }
        }
        .keepsake-feature { transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease; }
        .keepsake-feature:hover { transform: translateY(-5px); box-shadow: 0 18px 42px rgba(90,35,54,.09); border-color: rgba(194,24,91,.22); }
        .keepsake-cta-sheen { position: relative; isolation: isolate; overflow: hidden; }
        .keepsake-cta-sheen::after { content: ""; position: absolute; z-index: -1; top: -40%; left: -20%; width: 25%; height: 180%; background: linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent); animation: keepsake-sheen 8s ease-in-out infinite; pointer-events: none; }
        @media (prefers-reduced-motion: reduce) {
          .keepsake-cta-sheen::after { animation: none !important; }
          .keepsake-feature { transition: none; }
        }
      `}</style>

      <Navbar />

      <PersonalizedAddress
        occasion="wedding memories"
        example="veena-aarav-moments.com"
        title="Let every guest leave you with a little more to keep."
        description="Bring celebration photos, wishes and familiar voices together in one keepsake to revisit."
      />

      <section
        id="wedding-experiences"
        className="py-12 md:py-16"
        style={{ background: "var(--bg-base)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <DemoShowcase cards={MEMORY_DEMOS.weddingMemories} columns={2} />
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-rose-100/80 bg-[linear-gradient(135deg,#fff7f4,#fffafd_55%,#fff8f1)] px-4 py-14 sm:px-8 sm:py-20">
        <div className="pointer-events-none absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-rose-200/60 sm:right-[5%]" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-8 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full border border-rose-200/50 sm:right-[9%]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 max-w-2xl">
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[.25em] text-rose-700">A little more than an album</p>
            <h2 className="font-light leading-[1.02] tracking-[-.02em] text-[#33252a]" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.35rem,5vw,4.2rem)" }}>
              When the music fades, <em className="font-medium text-rose-700">the stories stay.</em>
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            {keepsakeFeatures.map((feature) => (
              <article key={feature.number} className="keepsake-feature rounded-2xl border border-rose-100/90 bg-white/75 p-5 backdrop-blur-sm sm:p-6">
                <div className="mb-7 flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-rose-50 text-lg text-rose-700">{feature.icon}</span>
                  <span className="font-mono text-[9px] tracking-[.18em] text-rose-300">{feature.number}</span>
                </div>
                <h3 className="font-[var(--font-cormorant)] text-[23px] font-semibold text-[#3b2b30]">{feature.title}</h3>
                <p className="mt-2 text-[12px] leading-6 text-stone-500">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-8 sm:py-20">
        <div className="keepsake-cta-sheen relative mx-auto max-w-6xl rounded-[28px] px-6 py-10 text-center text-white shadow-[0_26px_75px_rgba(112,19,57,.23)] sm:px-12 sm:py-14" style={{ background: "linear-gradient(120deg,#76103e 0%,#a71950 48%,#cc4774 100%)" }}>
          <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" style={{ background: "radial-gradient(circle at 12% 18%,rgba(255,255,255,.42),transparent 30%),radial-gradient(circle at 90% 82%,rgba(255,227,201,.28),transparent 32%)" }} />
          <div className="relative">
            <p className="mb-3 text-[9px] font-bold uppercase tracking-[.28em] text-white/70">Your people. Your day. Your story.</p>
            <h2 className="mx-auto max-w-3xl font-light leading-[1.02]" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.5rem,5vw,4.35rem)" }}>
              Let every guest leave you <em className="font-medium">with a little more to keep.</em>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/75">Tell us about your celebration. We’ll help you choose the experience that feels most like you.</p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={PHONE_TEL} className="inline-flex min-w-56 items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-rose-800 shadow-lg transition-transform hover:-translate-y-0.5">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" /></svg>
                Let’s make yours
              </a>
              <a href="#wedding-experiences" className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                Explore the demos <span aria-hidden="true">↑</span>
              </a>
            </div>
            <p className="mt-4 text-xs text-white/65">{PHONE_DISPLAY}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] font-medium tracking-wide text-white/75">
              <span>✓ Free design preview</span>
              <span>✓ Personalised for your celebration</span>
              <span>✓ Ready to share with guests</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
