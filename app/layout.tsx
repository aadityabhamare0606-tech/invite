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
    default: "Wedding Invitation Websites India from ₹1,499 · OurMoment",
    template: "%s · OurMoment",
  },
  description:
    "India's most beautiful animated wedding invitation websites — share with family in one link. Cinematic scroll effects, live countdown, multi-event cards and RSVP. Personalised for your wedding from ₹1,499.",
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
    title: "Wedding Invitation Websites India from ₹1,499 · OurMoment",
    description:
      "India's most beautiful animated wedding invitation websites. Cinematic scroll effects, live countdown, multi-event cards and RSVP — share with family in one link.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "OurMoment — beautiful Indian wedding invitation websites from ₹1,499",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding Invitation Websites India from ₹1,499 · OurMoment",
    description:
      "Animated wedding invitation websites for Indian weddings. Share with everyone in one link. From ₹1,499.",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/logo.svg",
  },
};

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
      <body className="motion-disabled">
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
