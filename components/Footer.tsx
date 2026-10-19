import Link from "next/link";
import { PHONE_TEL, PHONE_DISPLAY } from "@/lib/contact";

export default function Footer() {
  return (
    <footer id="footer" className="py-16"
      style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)" }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* ── Brand ── */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: "var(--gradient-rose)", boxShadow: "0 3px 14px rgba(194,24,91,0.28)" }}>
                <span className="text-white text-lg animate-heart">♥</span>
              </div>
              <div className="flex flex-col leading-none">
                <span style={{ fontFamily: "var(--font-cormorant)", fontSize: 20, color: "var(--text-primary)", fontWeight: 600, letterSpacing: "0.02em" }}>
                  Our<span style={{ color: "var(--primary)" }}>Moment</span>
                </span>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.36em", textTransform: "uppercase" as const, color: "var(--text-muted)", marginTop: 1 }}>
                  Digital Invites
                </span>
              </div>
            </div>
            <p className="mb-6 max-w-xs text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Personalised Indian wedding invitation websites from ₹1,499 and wedding invitation videos from ₹399 — made for sharing with family and guests on WhatsApp.
            </p>
            <a href={PHONE_TEL}
              aria-label={`Call us at ${PHONE_DISPLAY}`}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--primary)", boxShadow: "0 3px 14px rgba(194,24,91,0.22)" }}>
              <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/>
              </svg>
              Call us: {PHONE_DISPLAY}
            </a>
          </div>

          {/* ── Quick links ── */}
          <div>
            <h4 className="mb-5 text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--primary)" }}>
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm" style={{ color: "var(--text-secondary)" }}>
              {([["#collection","All Designs"],["#how-it-works","How It Works"],["#faq","FAQ"]] as [string,string][]).map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="hover:text-[var(--primary)] transition-colors inline-flex items-center gap-2">
                    <span style={{ color: "var(--blush-deep)", fontSize: 8 }}>♥</span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Occasions ── */}
          <div>
            <h4 className="mb-5 text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--primary)" }}>
              Occasions
            </h4>
            <ul className="space-y-3 text-sm" style={{ color: "var(--text-secondary)" }}>
              {([
                ["💍", "Wedding Websites", "/wedding-invitation-website-india"],
                ["🎬", "Wedding Videos", "/wedding-invitation-video-india"],
                ["📱", "Save the Date", "/save-the-date-website-india"],
                ["✨", "Wedding Invite Cost", "/wedding-invitation-cost-india"],
                ["🌐", "Digital Invitations", "/digital-wedding-invitation-india"],
                ["💬", "WhatsApp Invites", "/whatsapp-wedding-invitation"],
                ["📝", "RSVP Websites", "/wedding-website-with-rsvp-india"],
                ["🌸", "Mehendi & Sangeet", "/mehendi-haldi-sangeet-invitation"],
                ["🏝️", "Destination Weddings", "/destination-wedding-invitation-website"],
                ["💌", "Proposal Pages", "/proposals"],
                ["🪔", "Hindi Invitations", "/hindi-wedding-invitation-website"],
                ["🌾", "Marathi Invitations", "/marathi-wedding-invitation-website"],
              ] as [string, string, string][]).map(([icon, t, href]) => (
                <li key={t}>
                  <Link href={href} className="hover:text-[var(--primary)] transition-colors inline-flex items-center gap-2">
                    <span aria-hidden="true">{icon}</span>{t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t pt-8 sm:flex-row"
          style={{ borderColor: "var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} OurMoment. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
            Made with <span className="animate-heart text-sm" style={{ color: "var(--primary)" }}>♥</span> for every love story
          </div>
        </div>
      </div>
    </footer>
  );
}
