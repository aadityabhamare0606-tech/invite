import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://our-moments.in";
const whatsappNumber = "919999999999";

const pageData = {
  "wedding-invitation-website-india": {
    title: "Wedding Invitation Website India",
    description: "Create a personalised wedding invitation website in India with your events, venue, photos, RSVP and one WhatsApp-ready link from ₹1,499.",
    eyebrow: "Digital wedding invitations",
    price: "₹1,499",
    intro: "A beautiful wedding website for every ceremony, guest and family member.",
    points: ["Mehendi, Haldi, Sangeet and Reception details", "Venue, map, gallery, story and RSVP in one link", "Mobile-first design made for WhatsApp sharing"],
    related: ["wedding-invitation-video-india", "save-the-date-website-india", "wedding-invitation-cost-india"],
  },
  "wedding-invitation-video-india": {
    title: "Wedding Invitation Video India",
    description: "Order a personalised Indian wedding invitation video for WhatsApp and Instagram. Elegant animated designs, fast delivery and direct support from OurMoment.",
    eyebrow: "Wedding invitation videos",
    price: "₹399",
    intro: "Turn your wedding details into a shareable invitation video guests remember.",
    points: ["Personalised names, dates, venues and ceremonies", "Designed for WhatsApp Status, chats and Instagram", "Fast, lightweight video delivery with direct support"],
    related: ["wedding-invitation-website-india", "save-the-date-website-india", "wedding-invitation-cost-india"],
  },
  "save-the-date-website-india": {
    title: "Save The Date Website India",
    description: "Share your wedding date early with a personalised save the date website in India, including your story, date, countdown and a simple mobile-friendly link.",
    eyebrow: "Save the date websites",
    price: "₹789",
    intro: "Give family and friends a beautiful first look at the date that matters.",
    points: ["Your names, wedding date and countdown", "A simple mobile page guests can open instantly", "Perfect for sharing months before the wedding"],
    related: ["wedding-invitation-website-india", "wedding-invitation-video-india", "wedding-invitation-cost-india"],
  },
  "wedding-invitation-cost-india": {
    title: "Wedding Invitation Website Cost India",
    description: "See the cost of a digital wedding invitation website and video in India. OurMoment websites start at ₹1,499 and invitation videos start at ₹399.",
    eyebrow: "Simple, transparent pricing",
    price: "From ₹399",
    intro: "Choose the format that fits your wedding, guest list and budget.",
    points: ["Wedding invitation website: from ₹1,499", "Wedding invitation video: from ₹399", "Save the date website: from ₹789"],
    related: ["wedding-invitation-website-india", "wedding-invitation-video-india", "save-the-date-website-india"],
  },
} as const;

type PageSlug = keyof typeof pageData;

export function generateStaticParams() {
  return Object.keys(pageData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = pageData[slug as PageSlug];

  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: `/${slug}`,
      siteName: "OurMoment",
      title: page.title,
      description: page.description,
      images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: page.title }],
    },
  };
}

export default async function IntentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pageData[slug as PageSlug];

  if (!page) {
    return <main className="min-h-screen bg-white px-6 py-24 text-center"><Link href="/">Return to OurMoment</Link></main>;
  }

  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi, I want to order a ${page.title} from OurMoment.`)}`;
  const relatedPages = page.related.map((relatedSlug) => ({ slug: relatedSlug, page: pageData[relatedSlug as PageSlug] }));

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: page.title,
      description: page.description,
      provider: { "@type": "Organization", name: "OurMoment", url: siteUrl },
      areaServed: { "@type": "Country", name: "India" },
      offers: { "@type": "Offer", price: page.price.replace(/[^0-9]/g, ""), priceCurrency: "INR", url: `${siteUrl}/${slug}` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "OurMoment", item: siteUrl },
        { "@type": "ListItem", position: 2, name: page.title, item: `${siteUrl}/${slug}` },
      ],
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--bg-hero)] text-[var(--text-primary)]">
      {structuredData.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
      <header className="border-b border-[var(--border)] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="font-[var(--font-cormorant)] text-2xl font-semibold">Our<span className="text-[var(--primary)]">Moment</span></Link>
          <Link href="/" className="text-sm font-semibold text-[var(--text-mid)]">View designs</Link>
        </div>
      </header>

      <section className="px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--primary)]">{page.eyebrow}</p>
            <h1 className="max-w-3xl font-[var(--font-cormorant)] text-5xl font-medium leading-[0.98] sm:text-7xl">{page.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">{page.intro}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full bg-[var(--primary)] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pink-900/10 transition-transform hover:-translate-y-0.5">Start on WhatsApp</a>
              <span className="font-[var(--font-cormorant)] text-3xl text-[var(--primary)]">{page.price}</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-[var(--border-strong)] bg-[linear-gradient(145deg,#160840,#5d103d)] p-4 shadow-[0_24px_70px_rgba(93,16,61,0.18)]">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-white backdrop-blur">
              <div className="flex items-center gap-2 border-b border-white/15 pb-3"><span className="h-2.5 w-2.5 rounded-full bg-white/90" /><span className="h-2.5 w-2.5 rounded-full bg-white/60" /><span className="h-2.5 w-2.5 rounded-full bg-white/35" /><span className="ml-auto text-[9px] uppercase tracking-[0.25em] text-white/70">Preview</span></div>
              <div className="flex min-h-[300px] flex-col items-center justify-center text-center sm:min-h-[360px]">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">{page.eyebrow}</p>
                <p className="mt-4 max-w-sm font-[var(--font-cormorant)] text-5xl leading-none sm:text-6xl">Your wedding website</p>
                <div className="my-6 flex items-center gap-3 text-white/60"><span className="h-px w-10 bg-white/40" />&#9825;<span className="h-px w-10 bg-white/40" /></div>
                <div className="grid w-full max-w-sm grid-cols-3 gap-2 text-left text-[10px] text-white/70"><span className="rounded-lg bg-white/10 p-3">Story</span><span className="rounded-lg bg-white/10 p-3">Events</span><span className="rounded-lg bg-white/10 p-3">RSVP</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-white px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 md:grid-cols-3">
            {page.points.map((point) => <div key={point} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 text-sm leading-7 text-[var(--text-secondary)]"><span className="mb-4 block text-2xl text-[var(--primary)]">&#10003;</span>{point}</div>)}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-[var(--font-cormorant)] text-4xl">Explore more from OurMoment</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {relatedPages.map(({ slug: relatedSlug, page: relatedPage }) => <Link key={relatedSlug} href={`/${relatedSlug}`} className="rounded-2xl border border-[var(--border)] bg-white p-5 transition-colors hover:border-[var(--blush-mid)]"><span className="text-sm font-semibold text-[var(--text-primary)]">{relatedPage.title}</span><span className="mt-2 block text-sm text-[var(--text-muted)]">{relatedPage.price}</span></Link>)}
          </div>
          <Link href="/" className="mt-10 inline-flex text-sm font-semibold text-[var(--primary)]">See all invitation designs &#8594;</Link>
        </div>
      </section>
    </main>
  );
}
