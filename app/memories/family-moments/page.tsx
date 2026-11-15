import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const demoUrl = "/demos/family-moments/index.html";

export const metadata: Metadata = {
  title: "Family Moments Website for Baby's First Year",
  description:
    "See a photo-first family website sample for pregnancy, baby milestones, family memories and a first birthday.",
  alternates: { canonical: "/memories/family-moments" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/memories/family-moments",
    title: "Family Moments — A Baby's First-Year Website Sample",
    description:
      "A warm, photo-led family story concept for pregnancy, baby's first-year milestones, photographs and family voices.",
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

const chapters = [
  {
    number: "01",
    title: "Before the hello",
    caption: "The waiting days",
    image: "/demos/family-moments/images/expecting.webp",
    alt: "An expectant parent holding her baby bump",
  },
  {
    number: "02",
    title: "The first hello",
    caption: "A brand-new beginning",
    image: "/demos/family-moments/images/newborn.webp",
    alt: "A newborn baby resting on a soft cloth",
  },
  {
    number: "03",
    title: "Little things",
    caption: "Tiny toes, big feelings",
    image: "/demos/family-moments/images/tiny-feet.webp",
    alt: "A family member holding a baby's tiny feet",
  },
  {
    number: "04",
    title: "One candle",
    caption: "The first birthday",
    image: "/demos/family-moments/images/first-birthday.webp",
    alt: "A baby celebrating a first birthday",
  },
];

export default function FamilyMomentsPage() {
  return (
    <main className="overflow-hidden bg-[#fbf8f2]">
      <Navbar />

      <section className="relative overflow-hidden bg-[#f7f2e9]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-36 -top-40 h-[520px] w-[520px] rounded-full bg-[#e8dcbf]/45 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-36 h-[420px] w-[420px] rounded-full bg-[#e7c9bd]/35 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-9 px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-16 lg:min-h-[680px] lg:grid-cols-[0.88fr_1.12fr] lg:gap-14">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#9b563f]">
              <span aria-hidden="true">✳</span>
              Family Moments · a sample story
            </p>
            <h1
              className="mt-5 text-balance font-medium tracking-[-0.04em] text-[#302a23]"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(3.2rem, 6.2vw, 5.7rem)",
                lineHeight: 0.94,
              }}
            >
              A baby&apos;s first year,
              <span className="block italic text-[#a95139]">
                beautifully remembered.
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#665d50] sm:text-base">
              From pregnancy and first smiles to family voices and one very
              special birthday—one story to revisit together.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {["Pregnancy to birthday", "Family photos", "Little voices"].map(
                (topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-[#d8cbb7] bg-white/70 px-3.5 py-2 text-[11px] font-medium text-[#605648]"
                  >
                    {topic}
                  </span>
                ),
              )}
            </div>

            <Link
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#a95139] px-6 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(169,81,57,0.22)] transition hover:-translate-y-0.5 hover:bg-[#8f432f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8f432f]"
            >
              Open Mira&apos;s full story
              <span aria-hidden="true">↗</span>
            </Link>
            <p className="mt-3 text-[10px] leading-5 text-[#817769]">
              Opens the separate demo · fictional story · stock photographs
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[650px]">
            <div
              aria-hidden="true"
              className="absolute -left-4 top-[18%] z-10 hidden w-[25%] rotate-[-8deg] overflow-hidden rounded-[18px] border-[6px] border-white shadow-[0_16px_40px_rgba(48,38,27,0.2)] sm:block"
            >
              <Image
                src="/demos/family-moments/images/expecting.webp"
                alt=""
                width={1200}
                height={1500}
                sizes="160px"
                className="aspect-[3/4] h-auto w-full object-cover"
              />
            </div>
            <div className="absolute -right-2 top-[12%] z-10 hidden w-[24%] rotate-[7deg] overflow-hidden rounded-[18px] border-[6px] border-white shadow-[0_16px_40px_rgba(48,38,27,0.18)] sm:block">
              <Image
                src="/demos/family-moments/images/first-birthday.webp"
                alt=""
                width={1200}
                height={1400}
                sizes="155px"
                className="aspect-[4/5] h-auto w-full object-cover"
              />
            </div>

            <Link
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Mira's complete Family Moments demo in a new tab"
              className="group relative mx-auto block aspect-[0.92] w-[88%] max-w-[500px] overflow-hidden rounded-[30px] border-[7px] border-white bg-[#ded2bf] shadow-[0_32px_85px_rgba(48,38,27,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8f432f] sm:aspect-[1.02] sm:w-[82%]"
            >
              <Image
                src="/demos/family-moments/images/family-outdoors.webp"
                alt=""
                fill
                sizes="(max-width: 640px) 82vw, (max-width: 1024px) 55vw, 500px"
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#211d18]/85 via-[#211d18]/10 to-[#211d18]/10" />
              <span className="absolute left-4 top-4 rounded-full border border-white/35 bg-[#302a23]/35 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm sm:left-6 sm:top-6">
                Full story preview
              </span>
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-[43%] grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-white/20 text-white shadow-xl backdrop-blur-sm transition group-hover:scale-110"
              >
                <svg className="ml-1 h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-left text-white sm:p-7">
                <span>
                  <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-white/75">
                    The Sharma family · sample
                  </span>
                  <span
                    className="mt-1 block text-3xl italic sm:text-4xl"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    Mira&apos;s first year
                  </span>
                </span>
                <span className="mb-1 shrink-0 text-xs font-semibold">
                  Explore ↗
                </span>
              </span>
            </Link>

            <div className="absolute -bottom-4 left-0 z-10 flex items-center gap-3 rounded-2xl border border-white/90 bg-[#fffdf8] px-4 py-3 shadow-[0_14px_38px_rgba(48,38,27,0.14)] sm:left-4 sm:px-5">
              <span
                aria-hidden="true"
                className="grid h-9 w-9 place-items-center rounded-full bg-[#e9eee2] text-lg text-[#637257]"
              >
                ♡
              </span>
              <span>
                <span className="block text-xs font-semibold text-[#39342d]">
                  Twelve months, together
                </span>
                <span className="block text-[10px] text-[#817769]">
                  Tap the preview to see the full story
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fbf8f2] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4 border-b border-[#e1d8ca] pb-5 sm:mb-10">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.23em] text-[#a95139]">
                Four frames from Mira&apos;s sample
              </p>
              <h2
                className="mt-2 text-balance font-medium leading-none text-[#302a23]"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                }}
              >
                The year, frame by frame.
              </h2>
            </div>
            <span className="hidden pb-1 text-[10px] font-medium text-[#817769] sm:block">
              Waiting days · firsts · birthday
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {chapters.map((chapter) => (
              <article key={chapter.number} className="group">
                <div className="relative aspect-[0.82] overflow-hidden rounded-[20px] bg-[#e6ddcd] shadow-[0_12px_34px_rgba(58,46,32,0.08)] sm:rounded-[24px]">
                  <Image
                    src={chapter.image}
                    alt={chapter.alt}
                    fill
                    sizes="(max-width: 640px) 46vw, (max-width: 1024px) 45vw, 300px"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#211d18]/75 via-transparent to-[#211d18]/10" />
                  <span className="absolute left-3 top-3 rounded-full border border-white/40 bg-black/20 px-2.5 py-1 text-[9px] font-semibold text-white backdrop-blur-sm">
                    {chapter.number}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                    <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-white/75">
                      {chapter.caption}
                    </p>
                    <h3
                      className="mt-1 text-2xl leading-none sm:text-3xl"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      {chapter.title}
                    </h3>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eee8dc] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="relative mx-auto w-full max-w-[620px]">
            <div className="relative aspect-[1.12] overflow-hidden rounded-[28px] border-[6px] border-white bg-[#d9cdb9] shadow-[0_24px_65px_rgba(48,38,27,0.15)]">
              <Image
                src="/demos/family-moments/images/nani-and-baby.webp"
                alt="A grandmother holding her newborn grandchild"
                fill
                sizes="(max-width: 1024px) 90vw, 560px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#211d18]/55 via-transparent to-transparent" />
              <span className="absolute bottom-5 left-5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/85">
                Nani&apos;s note · sample
              </span>
            </div>
            <blockquote className="absolute -bottom-5 right-0 max-w-[82%] rounded-2xl border border-white/80 bg-[#fffdf8] px-5 py-4 shadow-[0_14px_38px_rgba(48,38,27,0.13)] sm:right-4 sm:px-6">
              <p
                className="text-lg italic leading-tight text-[#51493e] sm:text-xl"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                “May you always know how loved you are.”
              </p>
              <footer className="mt-2 text-[9px] font-bold uppercase tracking-[0.14em] text-[#9b765b]">
                A fictional family message
              </footer>
            </blockquote>
          </div>

          <div className="max-w-xl pt-5 lg:pt-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.23em] text-[#a95139]">
              The people in every picture
            </p>
            <h2
              className="mt-3 text-balance font-medium leading-[0.98] text-[#302a23]"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2.8rem, 5vw, 4.4rem)",
              }}
            >
              Their voices belong in the story, too.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-[#665d50]">
              A parent&apos;s note. A grandparent&apos;s wish. The little
              messages that make the photographs feel like family.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Family tree", "Milestones", "Voice notes", "Photo gallery"].map(
                (topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-[#d4c6b1] bg-white/60 px-3 py-1.5 text-[10px] font-medium text-[#605648]"
                  >
                    {topic}
                  </span>
                ),
              )}
            </div>
            <Link
              href="/memories/family-story"
              className="mt-7 inline-flex items-center gap-2 text-xs font-semibold text-[#8f432f] underline decoration-[#caa48c] underline-offset-4 transition hover:text-[#6f3325]"
            >
              Want the whole family tree? See Family Story
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#302a23] px-5 py-16 text-[#fbf8f2] sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-9 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Link
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Mira's photo gallery and slideshow sample in a new tab"
            className="group relative block overflow-hidden rounded-[28px] border border-white/15 bg-[#4b4032] shadow-[0_24px_70px_rgba(0,0,0,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e3bf8a]"
          >
            <div className="relative aspect-[1.2]">
              <Image
                src="/demos/family-moments/images/family-outdoors.webp"
                alt=""
                fill
                sizes="(max-width: 1024px) 90vw, 620px"
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#17140f]/80 via-[#17140f]/5 to-transparent" />
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-white/20 text-white backdrop-blur-sm transition group-hover:scale-110"
              >
                <svg className="ml-1 h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 sm:bottom-6 sm:left-6 sm:right-6">
                <span
                  className="text-2xl italic text-white sm:text-3xl"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  A year, in little frames
                </span>
                <span className="shrink-0 rounded-full bg-white px-4 py-2 text-[10px] font-bold text-[#302a23]">
                  View sample ↗
                </span>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 border-t border-white/10 bg-[#211d18] p-1.5">
              {[
                ["/demos/family-moments/images/newborn.webp", "The first hello"],
                ["/demos/family-moments/images/tiny-feet.webp", "Tiny toes"],
                ["/demos/family-moments/images/first-birthday.webp", "One candle"],
              ].map(([src, alt]) => (
                <div
                  key={src}
                  className="relative aspect-[1.65] overflow-hidden rounded-md"
                >
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(max-width: 640px) 28vw, 190px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Link>

          <div className="max-w-xl">
            <p className="text-[9px] font-bold uppercase tracking-[0.23em] text-[#d3a581]">
              Photos, chapters & a little reel
            </p>
            <h2
              className="mt-3 text-balance font-medium leading-[0.98] text-[#fbf8f2]"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2.8rem, 5vw, 4.4rem)",
              }}
            >
              One little life. So much to remember.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
              Open Mira&apos;s full sample for the timeline, family gallery,
              voices and slideshow.
            </p>
            <Link
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f4e3d1] px-6 text-sm font-semibold text-[#392c23] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Explore the full story
              <span aria-hidden="true">↗</span>
            </Link>
            <p className="mt-4 max-w-md text-[10px] leading-5 text-white/55">
              The reel is a slideshow of still photos, not a recorded video.
              This fictional demo does not save uploads.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
