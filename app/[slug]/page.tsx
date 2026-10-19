import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaBanner from "@/components/CtaBanner";
import FaqList from "@/components/FaqList";
import { PHONE_TEL, PHONE_DISPLAY } from "@/lib/contact";
import { SITE_URL, intentPages, getIntentPage } from "@/lib/seo";

export function generateStaticParams() {
  return intentPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getIntentPage(slug);

  if (!page) {
    return {
      title: "Page not found",
      robots: { index: false, follow: true },
    };
  }

  const url = `/${slug}`;
  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      siteName: "OurMoment",
      title: `${page.title} · OurMoment`,
      description: page.description,
      images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: page.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} · OurMoment`,
      description: page.description,
      images: ["/og-image.svg"],
    },
  };
}

const TRUST = ["Free design preview", "24–48 hour rush option", "Hindi · Marathi · English"];

export default async function IntentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getIntentPage(slug);

  if (!page) notFound();

  const relatedPages = page.related
    .map((relatedSlug) => getIntentPage(relatedSlug))
    .filter((related): related is NonNullable<typeof related> => Boolean(related));

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: page.title,
      description: page.description,
      serviceType: page.eyebrow,
      provider: {
        "@type": "Organization",
        name: "OurMoment",
        url: SITE_URL,
        telephone: "+917385893966",
      },
      areaServed: { "@type": "Country", name: "India" },
      offers: {
        "@type": "Offer",
        price: page.price.replace(/[^0-9]/g, ""),
        priceCurrency: "INR",
        url: `${SITE_URL}/${slug}`,
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "OurMoment", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: page.title, item: `${SITE_URL}/${slug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--bg-hero)] text-[var(--text-primary)]">
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        />
      ))}

      <header className="border-b border-[var(--border)] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="font-[var(--font-cormorant)] text-2xl font-semibold">
            Our<span className="text-[var(--primary)]">Moment</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/#collection" className="hidden text-sm font-semibold text-[var(--text-mid)] sm:inline">
              View designs
            </Link>
            <a
              href={PHONE_TEL}
              aria-label={`Call OurMoment at ${PHONE_DISPLAY}`}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold text-white"
              style={{ background: "var(--primary)" }}
            >
              <svg className="h-3.5 w-3.5 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" />
              </svg>
              Call now
            </a>
          </div>
        </div>
      </header>

      <section className="px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16">
        <div className="mx-auto max-w-6xl">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8 text-xs" style={{ color: "var(--text-muted)" }}>
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-[var(--primary)]">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" style={{ color: "var(--text-mid)" }}>{page.title}</li>
            </ol>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--primary)]">{page.eyebrow}</p>
              <h1 className="max-w-3xl font-[var(--font-cormorant)] text-5xl font-medium leading-[0.98] sm:text-7xl">{page.title}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">{page.intro}</p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={PHONE_TEL}
                  aria-label={`Call OurMoment to order at ${PHONE_DISPLAY}`}
                  className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white"
                  style={{ boxShadow: "0 8px 28px rgba(194,24,91,0.28)" }}
                >
                  <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" />
                  </svg>
                  Call to order
                </a>
                <Link
                  href="/#collection"
                  className="inline-flex items-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold"
                  style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
                >
                  See all designs
                </Link>
                <span className="font-[var(--font-cormorant)] text-3xl text-[var(--primary)]">{page.price}</span>
              </div>

              <p className="mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
                Call <strong style={{ color: "var(--text-mid)" }}>{PHONE_DISPLAY}</strong> · free preview before you pay.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-[var(--border-strong)] bg-[linear-gradient(145deg,#160840,#5d103d)] p-4 shadow-[0_24px_70px_rgba(93,16,61,0.18)]">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-white backdrop-blur">
                <div className="flex items-center gap-2 border-b border-white/15 pb-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/35" />
                  <span className="ml-auto text-[9px] uppercase tracking-[0.25em] text-white/70">Preview</span>
                </div>
                <div className="flex min-h-[280px] flex-col items-center justify-center text-center sm:min-h-[340px]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">{page.eyebrow}</p>
                  <p className="mt-4 max-w-sm font-[var(--font-cormorant)] text-5xl leading-none sm:text-6xl">Your wedding website</p>
                  <div className="my-6 flex items-center gap-3 text-white/60">
                    <span className="h-px w-10 bg-white/40" />&#9825;<span className="h-px w-10 bg-white/40" />
                  </div>
                  <div className="grid w-full max-w-sm grid-cols-3 gap-2 text-left text-[10px] text-white/70">
                    <span className="rounded-lg bg-white/10 p-3">Story</span>
                    <span className="rounded-lg bg-white/10 p-3">Events</span>
                    <span className="rounded-lg bg-white/10 p-3">RSVP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <ul className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[var(--border)] pt-6">
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-2 text-[12.5px] font-medium" style={{ color: "var(--text-mid)" }}>
                <span className="text-[var(--primary)]" aria-hidden="true">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-white px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 font-[var(--font-cormorant)] text-4xl">What&apos;s included</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {page.points.map((point) => (
              <div key={point} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
                <span className="mb-4 block text-2xl text-[var(--primary)]">&#10003;</span>
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      {page.faqs.length > 0 && (
        <section className="px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 font-[var(--font-cormorant)] text-4xl">Frequently asked questions</h2>
            <FaqList items={page.faqs} />
          </div>
        </section>
      )}

      <section className="border-t border-[var(--border)] bg-white px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-[var(--font-cormorant)] text-4xl">Explore more from OurMoment</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {relatedPages.map((related) => (
              <Link
                key={related.slug}
                href={`/${related.slug}`}
                className="rounded-2xl border border-[var(--border)] bg-white p-5 transition-colors hover:border-[var(--blush-mid)]"
              >
                <span className="text-sm font-semibold text-[var(--text-primary)]">{related.title}</span>
                <span className="mt-2 block text-sm text-[var(--text-muted)]">{related.price}</span>
              </Link>
            ))}
          </div>
          <Link href="/" className="mt-10 inline-flex text-sm font-semibold text-[var(--primary)]">
            See all invitation designs &#8594;
          </Link>
        </div>
      </section>

      <CtaBanner
        eyebrow="Let's build yours"
        title="Your names, your date — on a beautiful invite today"
        subtitle="Tell us your details on a quick call and we'll share a free preview before you decide anything."
        buttonLabel="Call to order"
        secondaryHref="/#collection"
        secondaryLabel="Browse designs"
      />
    </main>
  );
}
