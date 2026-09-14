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
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "#25d366", boxShadow: "0 3px 14px rgba(37,211,102,0.22)" }}>
              <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.118 1.528 5.857L.057 23.428a.5.5 0 0 0 .623.602l5.694-1.488A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.858 9.858 0 0 1-5.031-1.376l-.36-.214-3.73.976.994-3.63-.234-.374A9.859 9.859 0 0 1 2.1 12C2.1 6.53 6.53 2.1 12 2.1c5.47 0 9.9 4.43 9.9 9.9 0 5.47-4.43 9.9-9.9 9.9z"/>
              </svg>
              Chat with us on WhatsApp
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
              {[["💍","Wedding Websites"],["🎬","Wedding Videos"],["📱","WhatsApp Invites"],["✨","Custom Wedding Design"]].map(([icon, t]) => (
                <li key={t}>
                  <a href="#collection" className="hover:text-[var(--primary)] transition-colors inline-flex items-center gap-2">
                    <span>{icon}</span>{t}
                  </a>
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
