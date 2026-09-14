"use client";
import { useEffect, useRef, useCallback } from "react";

interface Props {
  src: string;
  title: string;
  onClose: () => void;
}

export default function DemoModal({ src, title, onClose }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null);

  /* Lock body scroll */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  /* Escape key — stable handler */
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[100] flex flex-col"
      /* NO backdropFilter — 85% opaque black makes blur invisible and wastes GPU */
      style={{ background: "rgba(8,4,6,0.88)" }}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
        style={{ background: "var(--primary-deep, #880E4F)" }}>
        <span className="text-sm font-medium text-white/90 truncate max-w-xs"
          style={{ fontFamily: "var(--font-cormorant)", fontSize: 18 }}>
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          {/* Open in new tab */}
          <a href={src} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 2h4v4M14 2l-6 6M6 4H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3" />
            </svg>
            New tab
          </a>
          <button onClick={onClose} aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>
      </div>

      {/* iframe — lazy loaded */}
      <iframe
        src={src}
        title={title}
        className="flex-1 w-full border-0 bg-white"
        loading="lazy"
        allow="autoplay"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
}
