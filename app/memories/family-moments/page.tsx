import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const demoUrl = "/demos/family-moments/index.html";

export const metadata: Metadata = {
  title: "Family Moments Website for Baby's First Year",
  description:
    "Explore a family moments website sample for pregnancy, newborn milestones, a baby's first year, birthday memories, photos and family voices.",
  alternates: { canonical: "/memories/family-moments" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/memories/family-moments",
    title: "Family Moments — A Baby's First-Year Website Sample",
    description:
      "A warm family website concept for pregnancy, baby's first-year milestones, photographs and messages from the people who love them.",
    images: [
      {
        url: "/demos/family-moments/images/newborn.webp",
        width: 1200,
        height: 1400,
        alt: "A newborn baby lying on a soft cloth",
      },
    ],
  },
};

const moments = [
  {
    number: "01",
    title: "The waiting",
    description: "Save the little notes, weekly changes and hopes from before the first hello.",
    icon: "✳",
  },
  {
    number: "02",
    title: "The first hello",
    description: "Keep the first photograph, the first tiny details and the words everyone remembers.",
    icon: "♡",
  },
  {
    number: "03",
    title: "A year of firsts",
    description: "Give milestones, everyday photos and birthday wishes a place in one growing story.",
    icon: "☼",
  },
  {
    number: "04",
    title: "The family around them",
    description: "Bring parents, grandparents and loved ones into the story with their own messages.",
    icon: "⌂",
  },
];

export default function FamilyMomentsPage() {
  return (
    <main className="overflow-hidden">
      <Navbar />

      <section className="relative overflow-hidden bg-[#fbf8f2]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-36 -top-40 h-[520px] w-[520px] rounded-full bg-[#e8dcbf]/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-36 h-[420px] w-[420px] rounded-full bg-[#e7c9bd]/35 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c9b894]/60 bg-white/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b5a3c] shadow-sm">
              <span aria-hidden="true" className="text-sm">✳</span>
              A family story, in the making
            </span>
            <h1
              className="mt-7 text-balance font-medium tracking-[-0.035em] text-[#2e2a24]"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(3.2rem, 7vw, 6.25rem)",
                lineHeight: 0.98,
              }}
            >
              A year of tiny firsts.
              <span className="block italic text-[#a75c42]">A lifetime of love.</span>
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-8 text-[#655c50] sm:text-lg">
              From the months of waiting to the first birthday, imagine one
              beautiful family page for the photographs, voices and little
              stories you never want to lose.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#a95139] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(169,81,57,0.22)] transition hover:-translate-y-0.5 hover:bg-[#8f432f]"
              >
                Explore Mira&apos;s sample story
                <span aria-hidden="true">↗</span>
              </Link>
              <a
                href="#what-it-holds"
                className="inline-flex items-center gap-2 rounded-full border border-[#d8cdbb] bg-white/55 px-6 py-3.5 text-sm font-semibold text-[#51493e] transition hover:border-[#a95139] hover:text-[#8f432f]"
              >
                What could it hold?
                <span aria-hidden="true">↓</span>
              </a>
            </div>

            <p className="mt-5 text-xs leading-5 text-[#817769]">
              A design sample with fictional names and stock photographs. It
              does not collect or save family uploads.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[560px]">
            <div
              aria-hidden="true"
              className="absolute -left-3 top-12 z-20 hidden w-[34%] -rotate-[8deg] overflow-hidden rounded-[22px] border-[7px] border-white bg-white shadow-[0_20px_50px_rgba(48,38,27,0.18)] sm:block"
            >
              <Image
                src="/demos/family-moments/images/expecting.webp"
                alt=""
                width={1200}
                height={1500}
                sizes="180px"
                className="aspect-[3/4] h-auto w-full object-cover"
              />
            </div>
            <div className="relative ml-auto aspect-[0.82] w-[82%] max-w-[410px] overflow-hidden rounded-t-[48%] rounded-b-[34px] border-[8px] border-white bg-[#dfd2bd] shadow-[0_36px_90px_rgba(48,38,27,0.2)] sm:w-[76%]">
              <Image
                src="/demos/family-moments/images/newborn.webp"
                alt="A newborn baby lying on a soft cloth"
                width={1200}
                height={1400}
                sizes="(max-width: 640px) 78vw, (max-width: 1024px) 42vw, 390px"
                preload
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#211d18]/80 via-[#211d18]/15 to-transparent px-5 pb-6 pt-20 text-white sm:px-7 sm:pb-8">
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/75">
                  The Sharma family · sample
                </p>
                <p
                  className="mt-1 text-3xl italic sm:text-4xl"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Mira&apos;s first year
                </p>
              </div>
            </div>
            <div className="absolute -bottom-5 left-0 z-20 flex items-center gap-3 rounded-2xl border border-white/80 bg-[#fffdf8]/95 px-4 py-3 shadow-[0_14px_38px_rgba(48,38,27,0.14)] sm:left-4 sm:px-5">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e9eee2] text-lg text-[#637257]" aria-hidden="true">
                ♡
              </span>
              <span>
                <span className="block text-sm font-semibold text-[#39342d]">12 months, together</span>
                <span className="block text-[11px] text-[#817769]">A story across generations</span>
              </span>
            </div>
            <div className="absolute -right-1 top-8 z-20 hidden w-[27%] rotate-[7deg] overflow-hidden rounded-[20px] border-[6px] border-white bg-white shadow-[0_18px_42px_rgba(48,38,27,0.16)] sm:block">
              <Image
                src="/demos/family-moments/images/first-birthday.webp"
                alt=""
                width={1200}
                height={1400}
                sizes="150px"
                className="aspect-[4/5] h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="what-it-holds" className="bg-[#f3eee4] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a95139]">
              Every chapter belongs
            </p>
            <h2
              className="mt-4 text-balance font-medium leading-[1.02] text-[#302a23]"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2.5rem, 5vw, 4.25rem)",
              }}
            >
              More than a gallery. A little life, told beautifully.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#6e6356] sm:text-base">
              The sample follows one family from the waiting days through a
              first birthday, with room for the people and memories around them.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {moments.map((moment) => (
              <article
                key={moment.number}
                className="rounded-[24px] border border-[#ddd2c0] bg-[#fbf8f2] p-6 shadow-[0_12px_34px_rgba(58,46,32,0.045)] transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-[#eee4d3] text-xl text-[#a95139]" aria-hidden="true">
                    {moment.icon}
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.18em] text-[#a6957d]">
                    {moment.number}
                  </span>
                </div>
                <h3
                  className="mt-6 text-2xl font-medium text-[#302a23]"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  {moment.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#6e6356]">
                  {moment.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbf8f2] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[#ddd1bd] shadow-[0_28px_70px_rgba(48,38,27,0.16)]">
              <Image
                src="/demos/family-moments/images/nani-and-baby.webp"
                alt="A grandmother holding a newborn baby"
                width={1200}
                height={1200}
                sizes="(max-width: 1024px) 90vw, 42vw"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="absolute -bottom-4 right-4 rounded-full border border-white bg-[#fffdf8] px-4 py-2 text-xs font-medium text-[#605648] shadow-md sm:right-8">
              A note from Nani, kept close
            </p>
          </div>
          <div className="max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a95139]">
              A place for every voice
            </p>
            <h2
              className="mt-4 text-balance font-medium leading-[1.02] text-[#302a23]"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2.7rem, 5vw, 4.5rem)",
              }}
            >
              Let the whole family be part of the story.
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#6e6356] sm:text-base">
              A grandparent&apos;s lullaby, a parent&apos;s note from the first
              night home, or a favorite memory from the birthday table can sit
              beside the photographs—not disappear into a chat thread.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {["Pregnancy notes", "Milestone timeline", "Family voices", "Photo & reel ideas"].map((item) => (
                <span key={item} className="rounded-full border border-[#d9cdb9] bg-white/70 px-3.5 py-2 text-xs font-medium text-[#62584b]">
                  {item}
                </span>
              ))}
            </div>
            <Link
              href="/memories/family-story"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#8f432f] underline decoration-[#caa48c] underline-offset-4 transition hover:text-[#6f3325]"
            >
              Looking for a generations-spanning family archive?
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#e9e3d6] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-8 rounded-[32px] border border-[#d4c8b3] bg-[#f7f3eb] p-6 shadow-[0_24px_70px_rgba(58,46,32,0.08)] sm:p-10 lg:grid-cols-[1fr_auto] lg:p-14">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a95139]">
              Step inside the sample
            </p>
            <h2
              className="mt-3 text-balance font-medium leading-[1.02] text-[#302a23]"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2.7rem, 5vw, 4.5rem)",
              }}
            >
              Meet Mira. Turn the pages of her first year.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#6e6356] sm:text-base">
              The demo is a visual concept with sample photographs, a family
              timeline, a voice-note transcript and a reel-style slideshow.
              Nothing is uploaded or saved.
            </p>
          </div>
          <Link
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#a95139] px-7 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(169,81,57,0.2)] transition hover:-translate-y-0.5 hover:bg-[#8f432f]"
          >
            Open the family demo
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
