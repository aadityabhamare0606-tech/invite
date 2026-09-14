"use client";
import { useEffect, useRef, useState, memo, type CSSProperties } from "react";

const videos = [
  { id: "01", title: "The First Look",      label: "Romantic illustrations",  accent: "#3B0764", bg: "linear-gradient(145deg,#1a0a2e,#4C1D95)" },
  { id: "02", title: "Marathi Celebration", label: "Heritage and colour",      accent: "#1e1060", bg: "linear-gradient(145deg,#120840,#2D1B69)" },
  { id: "03", title: "A Little Forever",    label: "Modern love story",        accent: "#1a0a60", bg: "linear-gradient(145deg,#0d0830,#1e1080)" },
  { id: "04", title: "Made With Love",      label: "Couple illustrations",     accent: "#2D1B69", bg: "linear-gradient(145deg,#0F0720,#3B0764)" },
  { id: "05", title: "Goa At Dusk",         label: "Destination wedding",      accent: "#1e0a60", bg: "linear-gradient(145deg,#0a0530,#2D1B69)" },
  { id: "06", title: "The Big Celebration", label: "Classic invitation film",  accent: "#4C1D95", bg: "linear-gradient(145deg,#1a0840,#5B21B6)" },
];

/* Each card is its own memoized component — filter changes won't re-render these */
const VideoCard = memo(function VideoCard({ id, title, label, accent, bg }: (typeof videos)[number]) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near,  setNear]  = useState(false);
  const [ready, setReady] = useState(false);

  /* Step 1 — load video when 300px away from viewport */
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setNear(true); obs.disconnect(); } },
      { rootMargin: "300px 0px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Step 2 — play/pause based on viewport visibility */
  useEffect(() => {
    const v = videoRef.current;
    const el = frameRef.current;
    if (!v || !el || !near) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => undefined);
        else                  v.pause();
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [near]);

  return (
    <article ref={frameRef} className="wedding-film-card" style={{ "--film-accent": accent } as CSSProperties}>
      <div className="wedding-film-media" style={{ background: bg }}>

        {/* Placeholder — visible until video ready */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2"
          style={{ opacity: ready ? 0 : 1, transition: "opacity 0.6s ease", pointerEvents: "none" }}>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.25em]">{label}</p>
          <p className="text-white/70 font-light text-center px-4"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.1rem,2.5vw,1.5rem)" }}>{title}</p>
        </div>

        <div className="wedding-film-wash" />

        {/* Video — rendered only when near. Single onCanPlay handler, NO duplicate useEffect handler */}
        {near && (
          <video
            ref={videoRef}
            className={`wedding-film-video${ready ? " is-ready" : ""}`}
            src={`/assets/wedding-video-${id}.mp4`}
            muted
            loop
            playsInline
            preload="metadata"   /* was "auto" — loading 6 videos simultaneously was killing bandwidth */
            onCanPlay={() => {
              videoRef.current?.play().catch(() => undefined);
              setReady(true);
            }}
          />
        )}

        <div className="wedding-film-play" aria-hidden="true">▶</div>
        <span className="wedding-film-index">{id} / {String(videos.length).padStart(2, "0")}</span>
      </div>
      <div className="wedding-film-copy">
        <p>{label}</p>
        <h3>{title}</h3>
      </div>
    </article>
  );
});

export default function WeddingVideoSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.06 }
    );
    el.querySelectorAll(".reveal").forEach((node) => obs.observe(node));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="wedding-films" ref={ref} className="wedding-films-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal wedding-films-heading">
          <p>Invitation films &middot; Every occasion</p>
          <h2>See the invitation <em>in motion</em></h2>
          <span>Every design is made to feel like a moment, not just a message.</span>
        </div>
        <div className="wedding-films-grid">
          {videos.map((v) => <VideoCard key={v.id} {...v} />)}
        </div>
      </div>
    </section>
  );
}
