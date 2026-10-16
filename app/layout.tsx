import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://our-moments.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "OurMoment",
  authors: [{ name: "OurMoment" }],
  category: "wedding",
  title: {
    default: "Beautiful Digital Wedding Invites from ₹1,499 · OurMoment",
    template: "%s · OurMoment",
  },
  description:
    "India's most beautiful animated wedding invitation websites — share with family in one link. Cinematic scroll effects, live countdown, multi-event cards. Personalised for your wedding from ₹1,499.",
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
  ],
  alternates: {
    canonical: siteUrl,
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
    title: "Beautiful Digital Wedding Invites from ₹1,499 · OurMoment",
    description:
      "India's most beautiful animated wedding invitation websites. Cinematic scroll effects, live countdown, multi-event cards — share with family in one link.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "OurMoment — beautiful Indian wedding invitation websites from ₹1,499" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Beautiful Digital Wedding Invites from ₹1,499 · OurMoment",
    description: "Animated wedding invitation websites for Indian weddings. Share with everyone in one WhatsApp link. From ₹1,499.",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body className="motion-disabled">{children}</body>
    </html>
  );
}
