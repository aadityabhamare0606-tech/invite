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
    default: "Wedding Invitation Website India | OurMoment",
    template: "%s | OurMoment",
  },
  description:
    "Custom wedding invitation website India from ₹1,499, digital wedding invite cards, save the date, and WhatsApp-ready wedding invitation videos in India.",
  keywords: [
    "wedding invitation website India",
    "digital wedding invitation India",
    "online wedding invitation India",
    "wedding invite website India",
    "wedding invitation video India",
    "save the date website India",
    "wedding cards website India",
    "Indian wedding website",
    "wedding invite WhatsApp",
    "shaadi invitation website",
    "wedding invitation website for family",
    "custom wedding invitation website",
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
    title: "Wedding Invitation Website India | OurMoment",
    description:
      "Beautiful digital wedding invitation websites and personalised invitation videos for Indian weddings, from ₹1,499.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "OurMoment wedding invitation website" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding Invitation Website India | OurMoment",
    description: "Wedding invitation websites and videos in India from ₹1,499. Custom, shareable, and designed for WhatsApp.",
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
