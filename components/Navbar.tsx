"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { PHONE_TEL } from "@/lib/contact";

/* Stable outside — no re-allocation on every render */
const NAV_LINKS = [
  { label: "Wedding Invite", href: "/", page: false, new: false },
  { label: "Wedding Moments", href: "/memories", page: true, new: false },
  { label: "Proposals", href: "/proposals", page: true, new: true },
  { label: "Save the Date", href: "/save-the-date", page: true, new: true },
] as const;

/*
const MEMORIES_LINKS = [
  { label: "Our Family Story", href: "/memories/family-story", desc: "Private family archive" },
  { label: "Wedding Memories", href: "/memories/wedding-memories", desc: "Guest photos & wishes" },
  { label: "Time Capsule", href: "/memories/time-capsule", desc: "Letters for the future" },
] as const;
*/

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

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-5 sm:px-8">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-3 group" aria-label="OurMoment home">
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

        {/* Desktop nav — the four items need ~936px in total, so the nav only
            appears from lg (1024px) and tightens its padding until xl. The
            old `md:` breakpoint let the links wrap onto three lines inside a
            64px header between 768px and ~950px. */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((n) => (
            n.page
              ? <Link key={n.label} href={n.href}
                  className="relative shrink-0 whitespace-nowrap px-3 xl:px-4 py-2 rounded-full text-[13px] font-medium transition-colors duration-150 hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] inline-flex items-center gap-1.5"
                  style={{ color: "var(--text-mid)" }}>
                  {n.label}
                  {n.new && <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em]"
                    style={{ background: "var(--primary)", color: "#fff", lineHeight: 1 }}>
                    New
                  </span>}
                </Link>
              : <a key={n.label} href={n.href}
                  className="shrink-0 whitespace-nowrap px-3 xl:px-4 py-2 rounded-full text-[13px] font-medium transition-colors duration-150 hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
                  style={{ color: "var(--text-mid)" }}>
                  {n.label}
                </a>
          ))}
          {/* Temporarily keep the full Memories collection dropdown here for later restoration.
          <div className="relative group">
            <button
              className="shrink-0 whitespace-nowrap px-3 xl:px-4 py-2 rounded-full text-[13px] font-medium transition-colors duration-150 group-hover:bg-[var(--primary-soft)] group-hover:text-[var(--primary)] inline-flex items-center gap-1.5"
              style={{ color: "var(--text-mid)" }}
              aria-haspopup="menu"
              aria-expanded="false">
              Memories
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[280px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 pointer-events-none group-hover:pointer-events-auto">
              <div className="rounded-2xl border bg-white/98 backdrop-blur-xl shadow-[0_20px_60px_rgba(136,14,79,0.12)] overflow-hidden" style={{ borderColor: "var(--border)" }}>
                <Link href="/memories" className="block px-5 py-4 border-b transition-colors hover:bg-[var(--primary-soft)]" style={{ borderColor: "var(--border)" }}>
                  <div className="text-[14px] font-semibold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-cormorant)" }}>The Memories Collection</div>
                  <div className="text-[12px] mt-1" style={{ color: "var(--text-muted)" }}>All demos in one place</div>
                </Link>
                {MEMORIES_LINKS.map((m) => (
                  <Link key={m.href} href={m.href} className="flex flex-col px-5 py-3 transition-colors hover:bg-[var(--primary-soft)]">
                    <span className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>{m.label}</span>
                    <span className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{m.desc}</span>
                  </Link>
                ))}
              </div>
            </div>
              */}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a href={PHONE_TEL}
            className="btn-primary inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-[13px] font-semibold text-white"
            style={{ boxShadow: "0 4px 16px rgba(194,24,91,0.28)" }}>
            <svg className="h-3.5 w-3.5 fill-white" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/>
            </svg>
            Call to personalise
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 hover:bg-[var(--primary-soft)]"
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
      <div className="lg:hidden overflow-hidden transition-all duration-250"
        style={{ maxHeight: open ? "520px" : "0", opacity: open ? 1 : 0 }}>
        <div className="px-5 pb-5 pt-2 space-y-1"
          style={{ background: "rgba(255,255,255,0.98)", borderTop: "1px solid var(--border)" }}>
          {NAV_LINKS.map((n) => (
            n.page
              ? <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium transition-colors duration-150 hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
                  style={{ color: "var(--text-mid)" }}>
                  <span style={{ color: "var(--primary)", fontSize: 10 }}>♥</span>
                  {n.label}
                  {n.new && <span className="ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em]"
                    style={{ background: "var(--primary)", color: "#fff" }}>
                    New
                  </span>}
                </Link>
              : <a key={n.href} href={n.href} onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium transition-colors duration-150 hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
                  style={{ color: "var(--text-mid)" }}>
                  <span style={{ color: "var(--primary)", fontSize: 10 }}>♥</span>
                  {n.label}
                </a>
          ))}
          {/* Temporarily keep the full Memories collection links here for later restoration.
          <div className="pt-2">
            <div className="px-4 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--text-muted)" }}>Memories</div>
            <Link href="/memories" onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium transition-colors duration-150 hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
              style={{ color: "var(--text-mid)" }}>
              <span style={{ color: "var(--primary)", fontSize: 10 }}>♥</span>
              Memories Collection
            </Link>
            {MEMORIES_LINKS.map((m) => (
              <Link key={m.href} href={m.href} onClick={() => setOpen(false)}
                className="flex flex-col rounded-xl px-4 py-2.5 pl-9 transition-colors duration-150 hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
                style={{ color: "var(--text-mid)" }}>
                <span className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>{m.label}</span>
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{m.desc}</span>
              </Link>
            ))}
          </div>
          */}
          <div className="pt-2">
            <a href={PHONE_TEL}
              onClick={() => setOpen(false)}
              className="btn-primary flex items-center justify-center gap-2 rounded-full py-3 text-[14px] font-semibold text-white">
              <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/></svg>
              Call Now
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
