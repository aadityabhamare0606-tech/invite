import { PHONE_TEL } from "@/lib/contact";

const DETAILS = ["Company colours & identity", "A clear schedule for every function", "One shareable link for your people"];

export default function CorporateWeddingInvite() {
  return (
    <section className="px-4 py-14 sm:px-6 md:py-20 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[30px] border px-6 py-9 sm:px-10 sm:py-12"
        style={{ borderColor: "rgba(198,144,58,.28)", background: "linear-gradient(125deg,#211710,#392619 58%,#5a3a24)" }}>
        <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full border border-amber-100/10" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-8 -top-20 h-56 w-56 rounded-full border border-amber-100/10" aria-hidden="true" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div className="max-w-3xl">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[.28em] text-amber-200">For companies, teams &amp; families</p>
            <h2 className="font-light leading-[1.03] text-white" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.2rem,5vw,3.8rem)" }}>
              Celebrate your colleague’s wedding with a little more heart.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
              A thoughtful, on-brand wedding invitation for your team—built around the couple, their celebrations and the details your guests need.
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-3">
              {DETAILS.map((detail) => (
                <li key={detail} className="flex items-start gap-2 text-xs leading-5 text-white/80">
                  <span className="text-amber-200" aria-hidden="true">✦</span>{detail}
                </li>
              ))}
            </ul>
          </div>
          <a href={PHONE_TEL}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5"
            style={{ color: "#5a3028" }}>
            Plan a corporate invite <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
