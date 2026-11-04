"use client";
import { useEffect, useRef, useCallback, useState } from "react";

interface Props {
  src: string;
  title: string;
  onClose: () => void;
}

const PHONE_W = 390;
const PHONE_H = 844;

/* ── Real iPhone outline — SVG border drawn over the iframe ── */
function IPhoneFrame({
  children,
  scale,
}: {
  children: React.ReactNode;
  scale: number;
}) {
  const W = PHONE_W;
  const H = PHONE_H;
  const R = 54; /* corner radius of the real iPhone */

  return (
    <div
      style={{
        width: W * scale,
        height: H * scale,
        position: "relative",
        filter: "drop-shadow(0 48px 80px rgba(0,0,0,0.75)) drop-shadow(0 12px 24px rgba(0,0,0,0.55))",
      }}
    >
      {/* Outer shell — titanium gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: R * scale,
          background:
            "linear-gradient(160deg,#2a2a2e 0%,#1c1c1f 30%,#38383d 55%,#1c1c1f 80%,#2a2a2e 100%)",
          boxShadow:
            `0 0 0 ${1.5 * scale}px rgba(255,255,255,0.10) inset,` +
            `0 0 0 ${1 * scale}px rgba(0,0,0,0.6)`,
        }}
      />
      {/* Screen area — inset 4px from edge */}
      <div
        style={{
          position: "absolute",
          top: 4 * scale,
          left: 4 * scale,
          right: 4 * scale,
          bottom: 4 * scale,
          borderRadius: (R - 3) * scale,
          overflow: "hidden",
          background: "#050507",
        }}
      >
        {children}
      </div>
      {/* Dynamic Island */}
      <div
        style={{
          position: "absolute",
          top: 14 * scale,
          left: "50%",
          transform: "translateX(-50%)",
          width: 126 * scale,
          height: 37 * scale,
          borderRadius: 22 * scale,
          background: "#050507",
          zIndex: 10,
          /* Camera dot inside island */
          boxShadow: `${44 * scale}px 0 0 ${7 * scale}px #0d0d10`,
        }}
      />
      {/* Action button left */}
      <div
        style={{
          position: "absolute",
          left: -3 * scale,
          top: 188 * scale,
          width: 4.5 * scale,
          height: 48 * scale,
          borderRadius: `0 ${3 * scale}px ${3 * scale}px 0`,
          background: "linear-gradient(180deg,#38383d,#2c2c2f)",
        }}
      />
      {/* Volume up */}
      <div
        style={{
          position: "absolute",
          left: -3 * scale,
          top: 256 * scale,
          width: 4.5 * scale,
          height: 72 * scale,
          borderRadius: `0 ${3 * scale}px ${3 * scale}px 0`,
          background: "linear-gradient(180deg,#38383d,#2c2c2f)",
        }}
      />
      {/* Volume down */}
      <div
        style={{
          position: "absolute",
          left: -3 * scale,
          top: 344 * scale,
          width: 4.5 * scale,
          height: 72 * scale,
          borderRadius: `0 ${3 * scale}px ${3 * scale}px 0`,
          background: "linear-gradient(180deg,#38383d,#2c2c2f)",
        }}
      />
      {/* Power button right */}
      <div
        style={{
          position: "absolute",
          right: -3 * scale,
          top: 256 * scale,
          width: 4.5 * scale,
          height: 100 * scale,
          borderRadius: `${3 * scale}px 0 0 ${3 * scale}px`,
          background: "linear-gradient(180deg,#38383d,#2c2c2f)",
        }}
      />
      {/* Home indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 12 * scale,
          left: "50%",
          transform: "translateX(-50%)",
          width: 134 * scale,
          height: 5 * scale,
          borderRadius: 999 * scale,
          background: "rgba(255,255,255,0.28)",
          zIndex: 10,
        }}
      />
    </div>
  );
}

/* ── Laptop outline — MacBook-style frame ── */
function LaptopFrame({ src, title }: { src: string; title: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full"
      style={{ paddingBottom: "24px" }}
    >
      {/* Screen */}
      <div
        style={{
          position: "relative",
          width: "min(92%, 1100px)",
          background: "#1c1c1e",
          borderRadius: "14px 14px 0 0",
          padding: "10px 10px 0",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.08), 0 40px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Top bar: camera + traffic lights */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: "8px",
          }}
        >
          {/* Traffic lights */}
          <div style={{ display: "flex", gap: "7px", paddingLeft: "6px" }}>
            {["#ff5f57", "#ffbd2e", "#28ca41"].map((c, i) => (
              <div
                key={i}
                style={{ width: 13, height: 13, borderRadius: "50%", background: c, boxShadow: `0 0 6px ${c}55` }}
              />
            ))}
          </div>
          {/* Camera */}
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#3a3a3c", boxShadow: "0 0 0 2px #2c2c2e" }} />
          {/* Menu bar placeholder */}
          <div style={{ width: 60 }} />
        </div>
        {/* Screen viewport */}
        <div
          style={{
            width: "100%",
            aspectRatio: "16/9.5",
            background: "#050507",
            borderRadius: "6px 6px 0 0",
            overflow: "hidden",
          }}
        >
          <iframe
            src={src}
            title={title}
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            loading="lazy"
            allow="autoplay"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </div>

      {/* Hinge */}
      <div
        style={{
          width: "min(94%, 1120px)",
          height: "8px",
          background:
            "linear-gradient(180deg, #2a2a2e 0%, #3a3a3e 40%, #1c1c1f 100%)",
          borderRadius: "0 0 2px 2px",
          boxShadow: "0 3px 12px rgba(0,0,0,0.5)",
        }}
      />
      {/* Base */}
      <div
        style={{
          width: "min(80%, 940px)",
          height: "22px",
          background:
            "linear-gradient(180deg, #2c2c30 0%, #1a1a1d 100%)",
          borderRadius: "0 0 10px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 20px rgba(0,0,0,0.45)",
        }}
      >
        {/* Notch cutout */}
        <div
          style={{
            width: 80,
            height: 12,
            borderRadius: "0 0 6px 6px",
            background: "#0d0d0f",
          }}
        />
      </div>
      {/* Foot shadow */}
      <div
        style={{
          width: "min(75%, 880px)",
          height: "8px",
          background:
            "radial-gradient(ellipse, rgba(0,0,0,0.45) 0%, transparent 70%)",
          marginTop: "2px",
          borderRadius: "50%",
        }}
      />
    </div>
  );
}

export default function DemoModal({ src, title, onClose }: Props) {
  const backdropRef  = useRef<HTMLDivElement>(null);
  const stageRef     = useRef<HTMLDivElement>(null);
  const closeRef     = useRef<HTMLButtonElement>(null);
  const restoreRef   = useRef<HTMLElement | null>(null);

  const [view,  setView]  = useState<"phone" | "desktop">("phone");
  const [scale, setScale] = useState(1);

  /* Lock body scroll */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  /* Focus trap */
  useEffect(() => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => restoreRef.current?.focus?.();
  }, []);

  /* Escape */
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);
  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  /* Scale phone to fit stage */
  useEffect(() => {
    const el = stageRef.current;
    if (!el || view !== "phone") return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const s = Math.min((r.height - 32) / PHONE_H, (r.width - 32) / PHONE_W, 1);
      setScale(Math.max(0.28, Number(s.toFixed(3))));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [view]);

  return (
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — live design preview`}
      className="fixed inset-0 z-[100] flex flex-col"
      style={{
        background: "rgba(6,3,8,0.92)",
        /* Subtle noise texture overlay for premium feel */
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='2'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='.018'/%3E%3C/svg%3E\")",
      }}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      {/* ── Top bar ── */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-2.5 shrink-0"
        style={{
          background:
            "linear-gradient(90deg, #880E4F 0%, #C2185B 50%, #D81B60 100%)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <span
          className="truncate text-white/90 font-medium"
          style={{ fontFamily: "var(--font-cormorant)", fontSize: 18 }}
        >
          {title}
        </span>

        <div className="flex shrink-0 items-center gap-1.5">
          {/* Phone / Desktop toggle */}
          <div
            className="demo-view-toggle"
            role="group"
            aria-label="Preview size"
          >
            <button type="button" aria-pressed={view === "phone"} onClick={() => setView("phone")}>
              <svg className="inline-block mr-1 -mt-0.5 w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="5" y="2" width="14" height="20" rx="3" ry="3"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              Phone
            </button>
            <button type="button" aria-pressed={view === "desktop"} onClick={() => setView("desktop")}>
              <svg className="inline-block mr-1 -mt-0.5 w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              Desktop
            </button>
          </div>

          {/* New tab */}
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white/75 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 2h4v4M14 2l-6 6M6 4H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3"/></svg>
            <span className="hidden sm:inline">New tab</span>
          </a>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4l8 8M12 4l-8 8"/></svg>
          </button>
        </div>
      </div>

      {/* ── Stage ── */}
      <div
        ref={stageRef}
        className="demo-stage"
        style={{
          flex: "1 1 auto",
          minHeight: 0,
          display: "grid",
          placeItems: "center",
          padding: view === "phone" ? "20px 12px" : "16px",
          overflow: "hidden",
          /* Subtle radial highlight from top */
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(194,24,91,0.08) 0%, transparent 65%)",
        }}
      >
        {view === "phone" ? (
          <IPhoneFrame scale={scale}>
            <iframe
              src={src}
              title={title}
              style={{
                width: PHONE_W,
                height: PHONE_H,
                border: "none",
                display: "block",
                background: "#fff",
              }}
              loading="lazy"
              allow="autoplay"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </IPhoneFrame>
        ) : (
          <LaptopFrame src={src} title={title} />
        )}
      </div>

      {/* Hint */}
      <p
        className="shrink-0 px-4 py-2 text-center text-[11px]"
        style={{ color: "rgba(255,255,255,0.38)" }}
      >
        Press <kbd className="rounded px-1 py-0.5 text-[10px]" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.55)" }}>Esc</kbd> or click outside to close
      </p>
    </div>
  );
}
