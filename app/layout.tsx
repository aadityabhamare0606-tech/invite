import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import StickyCallBar from "@/components/StickyCallBar";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: true,
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  themeColor: "#C2185B",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "OurMoment",
  authors: [{ name: "OurMoment", url: SITE_URL }],
  creator: "OurMoment",
  publisher: "OurMoment",
  category: "wedding",
  title: {
    default: "Wedding Invitation Websites in India | OurMoment",
    template: "%s · OurMoment",
  },
  description:
    "Animated wedding invitation websites — share with family in one link. Cinematic scroll effects, live countdown, multi-event cards and RSVP. Personalised for your wedding, all designs ₹1,299.",
  keywords: [
    "wedding invitation website India",
    "digital wedding invitation India",
    "online wedding invitation India",
    "animated wedding invite India",
    "best wedding invitation website India",
    "wedding invite website India",
    "wedding invitation video India",
    "save the date website India",
    "WhatsApp wedding invitation India",
    "shaadi invitation website",
    "wedding cards website India",
    "Indian wedding website",
    "custom wedding invitation website",
    "personalised wedding invite link",
    "wedding website with RSVP",
    "Marathi wedding invitation website",
    "Hindi wedding invitation website",
    "destination wedding invitation website",
    "proposal website India",
  ],
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "ysQ8_WZGcWxBFZe0NO5nxj1pHp6yAdzrbySKnTljRiA",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "OurMoment",
    title: "Wedding Invitation Websites in India | OurMoment",
    description:
      "India's most beautiful animated wedding invitation websites. Cinematic scroll effects, live countdown, multi-event cards and RSVP — share with family in one link.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "OurMoment — beautiful Indian wedding invitation websites",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding Invitation Websites in India | OurMoment",
    description:
      "Animated wedding invitation websites for Indian weddings. Share with everyone in one link. All designs ₹1,299.",
    images: ["/og-image.svg"],
  },
  /* Icons come from the file conventions — app/favicon.ico, app/icon.svg and
     app/apple-icon.png each emit their own <link>, so there is nothing to
     declare here. Declaring them as well produced three duplicate icon
     links. */
};

/* Runs before any .reveal element is parsed.

   It injects the hidden start state for scroll reveals into <head> rather
   than declaring it in globals.css, so the content is simply rendered in its
   final state when JavaScript is unavailable — no class on <html> either,
   which would trip React's hydration diff on the root element.

   It also carries the safety net. The `.visible` class that fades a reveal in
   is added by JavaScript, so if hydration never happens (a blocked chunk, a
   script error) the page would render blank. These guards make that
   impossible:

     1. after a short delay, anything already in the viewport is revealed
     2. if NO reveal has been revealed by then, hydration has failed, so
        everything is revealed
     3. any script load error reveals everything immediately */
const jsFlag = `(function(){
  var d = document, W = window;
  try {
    var s = d.createElement('style');
    s.textContent = '.reveal{opacity:0;transform:translateY(22px)}' +
      '.reveal-left{opacity:0;transform:translateX(-28px)}' +
      '.reveal-right{opacity:0;transform:translateX(28px)}' +
      '.reveal-pop{opacity:0;transform:scale(.88)}' +
      '.reveal-scale{opacity:0;transform:scale(.95) translateY(12px)}' +
      '.reveal-blur{opacity:0;transform:translateY(18px);filter:blur(6px)}' +
      '.reveal-fade{opacity:0}' +
      '.reveal-line{opacity:0;transform:scaleX(0)}' +
      '.section-enter{opacity:0;transform:translateY(16px)}';
    (d.head || d.documentElement).appendChild(s);
  } catch (e) { /* styling is cosmetic — never block the page on it */ }
  var SEL = '.reveal,.reveal-left,.reveal-right,.reveal-pop,.reveal-scale,.reveal-blur,.reveal-fade,.reveal-line,.section-enter';
  function revealAll(){
    var els = d.querySelectorAll(SEL);
    for (var i = 0; i < els.length; i++) els[i].classList.add('visible');
  }
  if (!('IntersectionObserver' in W)) {
    if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', revealAll);
    else revealAll();
    return;
  }
  W.addEventListener('error', revealAll, true);
  W.setTimeout(function(){
    var all = d.querySelectorAll(SEL);
    var any = d.querySelectorAll('.reveal.visible').length;
    var inView = [];
    for (var i = 0; i < all.length; i++) {
      var r = all[i].getBoundingClientRect();
      if (r.top < W.innerHeight && r.bottom > 0 && r.width > 0) inView.push(all[i]);
    }
    if (any === 0 && inView.length > 0) { revealAll(); return; }
    for (var j = 0; j < inView.length; j++) inView[j].classList.add('visible');
  }, 2500);
})();`;

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "OurMoment",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  image: `${SITE_URL}/og-image.svg`,
  description:
    "Personalised Indian wedding invitation websites, wedding invitation videos and save the date pages, delivered as a single shareable link.",
  telephone: "+917385893966",
  areaServed: { "@type": "Country", name: "India" },
  availableLanguage: ["English", "Hindi", "Marathi"],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: "+917385893966",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Marathi"],
    },
  ],
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "OurMoment",
  url: SITE_URL,
  inLanguage: "en-IN",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
        {children}
        <StickyCallBar />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd).replace(/</g, "\\u003c") }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
