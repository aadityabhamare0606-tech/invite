import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

/* Loads fonts from same origin — no blocking cross-origin request */
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ourmoment.in"),
  title: "Wedding Invitation Website India from ₹1,499 | OurMoment",
  description:
    "Create a beautiful Indian wedding invitation website from ₹1,499 or a wedding invitation video from ₹399. Personalised designs, WhatsApp sharing and fast delivery.",
  keywords: [
    "wedding invitation website India",
    "digital wedding invitation India",
    "Indian wedding website",
    "wedding invitation video",
    "shaadi invitation video",
    "online wedding invitation",
    "wedding invite WhatsApp",
  ],
  alternates: { canonical: "/" },
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
    title: "Wedding Invitation Website India from ₹1,499 | OurMoment",
    description:
      "Personalised Indian wedding invitation websites from ₹1,499 and wedding invitation videos from ₹399. Share your wedding beautifully on WhatsApp.",
    images: [{ url: "/assets/wedding-background.avif", width: 1200, height: 630, alt: "Indian wedding invitation website by OurMoment" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding Invitation Website India from ₹1,499 | OurMoment",
    description: "Indian wedding invitation websites from ₹1,499 and wedding invitation videos from ₹399.",
    images: ["/assets/wedding-background.avif"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
