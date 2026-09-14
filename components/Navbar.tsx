"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* Stable outside — no re-allocation on every render */
const NAV_LINKS = [
  { label: "Collection",   href: "#collection"  },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ",          href: "#faq"          },
] as const;

export default function Navbar() {
  const [open,    setOpen]    = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.80)",
        /* Only ONE backdrop-filter on the entire page in Navbar — acceptable cost */
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
        boxShadow: scrolled ? "0 2px 16px rgba(194,24,91,0.06)" : "none",
      }}>
      {/* Accent line */}
      <div className="h-[2.5px] w-full transition-opacity duration-500"
        style={{
          background: "linear-gradient(to right, transparent, var(--blush-mid), var(--primary), var(--primary-light), var(--primary), var(--blush-mid), transparent)",
          opacity: scrolled ? 1 : 0,
          willChange: "opacity",
        }} />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group" aria-label="OurMoment home">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(194,24,91,0.12)] transition-transform duration-200 group-hover:scale-105"
            style={{ background: "linear-gradient(135deg, #fff7f9 0%, #ffeaf1 100%)", boxShadow: "0 6px 18px rgba(194,24,91,0.12)" }}>
            <svg width="17" height="17" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path d="M16 28C16 28 3 19 3 10.5C3 7 5.7 4 9.5 4C12.1 4 14.3 5.6 16 7.8C17.7 5.6 19.9 4 22.5 4C26.3 4 29 7 29 10.5C29 19 16 28 16 28Z" fill="url(#logoGradient)"/>
              <defs>
                <linearGradient id="logoGradient" x1="3" y1="4" x2="29" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#880E4F"/>
                  <stop offset="0.6" stopColor="#C2185B"/>
                  <stop offset="1" stopColor="#D81B60"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span style={{ fontFamily: "var(--font-cormorant)", fontSize: 22, color: "var(--text-primary)", fontWeight: 600, letterSpacing: "0.02em", lineHeight: 1.1 }}>
              Our<span style={{ color: "var(--primary)" }}>Moment</span>
            </span>
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.38em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: 1 }}>
              Wedding Invites
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((n) => (
            <a key={n.label} href={n.href}
              className="px-4 py-2 rounded-full text-[13px] font-medium transition-colors duration-150 hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
              style={{ color: "var(--text-mid)" }}>
              {n.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="#collection"
            className="text-[13px] font-medium hover:text-[var(--primary)] transition-colors px-2"
            style={{ color: "var(--text-muted)" }}>
            View demos
          </a>
          <a href="https://wa.me/919999999999?text=Hi%2C%20I%27m%20interested%20in%20OurMoment%20digital%20invite"
            target="_blank" rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white"
            style={{ boxShadow: "0 4px 16px rgba(194,24,91,0.28)" }}>
            <svg className="h-3.5 w-3.5 fill-white" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.118 1.528 5.857L.057 23.428a.5.5 0 0 0 .623.602l5.694-1.488A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.858 9.858 0 0 1-5.031-1.376l-.36-.214-3.73.976.994-3.63-.234-.374A9.859 9.859 0 0 1 2.1 12C2.1 6.53 6.53 2.1 12 2.1c5.47 0 9.9 4.43 9.9 9.9 0 5.47-4.43 9.9-9.9 9.9z"/>
            </svg>
            Get Started Free
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-200 hover:bg-[var(--primary-soft)]"
          style={{ borderColor: "var(--border)", color: "var(--primary)" }}
          onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          <span className="flex flex-col gap-[5px] items-center justify-center w-4">
            <span className="block h-[1.5px] w-full bg-current rounded-full transition-transform duration-250"
              style={{ transform: open ? "rotate(45deg) translateY(6.5px)" : "none" }} />
            <span className="block h-[1.5px] w-full bg-current rounded-full transition-opacity duration-250"
              style={{ opacity: open ? 0 : 1 }} />
            <span className="block h-[1.5px] w-full bg-current rounded-full transition-transform duration-250"
              style={{ transform: open ? "rotate(-45deg) translateY(-6.5px)" : "none" }} />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden overflow-hidden transition-all duration-250"
        style={{ maxHeight: open ? "300px" : "0", opacity: open ? 1 : 0 }}>
        <div className="px-5 pb-5 pt-2 space-y-1"
          style={{ background: "rgba(255,255,255,0.98)", borderTop: "1px solid var(--border)" }}>
          {NAV_LINKS.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium transition-colors duration-150 hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
              style={{ color: "var(--text-mid)" }}>
              <span style={{ color: "var(--primary)", fontSize: 10 }}>♥</span>
              {n.label}
            </a>
          ))}
          <div className="pt-2">
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="btn-primary flex items-center justify-center gap-2 rounded-full py-3 text-[14px] font-semibold text-white">
              Get Started on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
