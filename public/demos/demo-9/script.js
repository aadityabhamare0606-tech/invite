/* ════════════════════════════════════════════════════════════
   TRIAL-2 — "The Letter" (Aarav & Meera) — vanilla engine
   Faithful behavior of web-6 + new click-to-reveal interactions
   ════════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ──────────────────────────────────────────────
     GOLD SPARKLE BURST (used by every tap moment)
     ────────────────────────────────────────────── */
  const golds = ["#f0dfa8", "#ffe08a", "#d4a84e", "#fff8f0", "#b8913a"];
  function burst(x, y, n = 16, colors = golds) {
    if (reduced) return;
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = "spark";
      const ang = Math.random() * Math.PI * 2;
      const dist = 36 + Math.random() * 96;
      s.style.setProperty("--tx", `${Math.cos(ang) * dist}px`);
      s.style.setProperty("--ty", `${Math.sin(ang) * dist - 24}px`);
      s.style.setProperty("--dur", `${(0.7 + Math.random() * 0.7).toFixed(2)}s`);
      s.style.width = s.style.height = `${2.5 + Math.random() * 3.5}px`;
      s.style.background = colors[i % colors.length];
      s.style.left = `${x}px`;
      s.style.top = `${y}px`;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1700);
    }
  }
  function burstAt(el, n, colors) {
    const r = el.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, n, colors);
  }

  /* Firework streaks — an elongated spark that flies outward (patakha)! */
  function firework(x, y, colors, n = 30) {
    if (reduced) return;
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = "streak";
      const ang = (i / n) * 360 + Math.random() * 7;
      const dist = 110 + Math.random() * 85;
      const len = 18 + Math.random() * 14;
      s.style.setProperty("--ra", `${ang.toFixed(1)}deg`);
      s.style.setProperty("--sd2", `${(-dist).toFixed(1)}px`);
      s.style.setProperty("--sd", `${(1.05 + Math.random() * 0.55).toFixed(2)}s`);
      s.style.setProperty("--sc", colors[i % colors.length]);
      s.style.width = `${(3 + Math.random() * 2.5).toFixed(1)}px`;
      s.style.height = `${len.toFixed(1)}px`;
      s.style.left = `${(x - 2.5).toFixed(1)}px`;
      s.style.top = `${(y - len).toFixed(1)}px`;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 2000);
    }
  }

  /* Bright flash at a point — the "pop" of the patakha */
  function flashAt(x, y) {
    if (reduced) return;
    const f = document.createElement("span");
    f.className = "flash";
    f.style.left = `${x}px`;
    f.style.top = `${y}px`;
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 700);
  }

/* ══════════════════════════════════════════════════════════
     ENVELOPE INTRO — petals, gold dust, open choreography
     Minimal on purpose: 8 pink petals on the breeze, a handful
     of gold stars, one smooth seal -> flap -> letter -> site
     handoff. Nothing bounces.
     ══════════════════════════════════════════════════════════ */
  const petals = [
    { x:"5%",  y:"3%",  w:26, h:16, c:"#E88D98", delay:"0s",   dur:"24s", sx:"-70px",  rot:"-120deg", a:.6  },
    { x:"86%", y:"9%",  w:20, h:13, c:"#F3A8AD", delay:"2.6s", dur:"27s", sx:"60px",   rot:"120deg",  a:.55 },
    { x:"2%",  y:"38%", w:30, h:19, c:"#FFD0C9", delay:"4.8s", dur:"25s", sx:"-52px",  rot:"130deg",  a:.5  },
    { x:"89%", y:"44%", w:22, h:14, c:"#E88D98", delay:"1.8s", dur:"29s", sx:"66px",   rot:"-110deg", a:.58 },
    { x:"10%", y:"66%", w:17, h:11, c:"#F3A8AD", delay:"6.8s", dur:"23s", sx:"-44px",  rot:"105deg",  a:.6  },
    { x:"79%", y:"74%", w:27, h:17, c:"#FFD0C9", delay:"4s",   dur:"21s", sx:"50px",   rot:"-135deg", a:.52 },
    { x:"46%", y:"1%",  w:16, h:10, c:"#FFD0C9", delay:"8.2s", dur:"26s", sx:"54px",   rot:"95deg",   a:.48 },
    { x:"66%", y:"26%", w:24, h:15, c:"#E88D98", delay:"10s",  dur:"22s", sx:"-58px",  rot:"-100deg", a:.56 },
    { x:"36%", y:"20%", w:18, h:12, c:"#F3A8AD", delay:"5.6s", dur:"19s", sx:"-38px",  rot:"140deg",  a:.5  },
    { x:"24%", y:"55%", w:21, h:13, c:"#E88D98", delay:"7.8s", dur:"28s", sx:"46px",   rot:"-125deg", a:.54 },
    { x:"71%", y:"58%", w:19, h:12, c:"#FFD0C9", delay:"9.4s", dur:"31s", sx:"-42px",  rot:"115deg",  a:.5  },
    { x:"15%", y:"18%", w:23, h:15, c:"#E88D98", delay:"3.4s", dur:"20s", sx:"64px",   rot:"-95deg",  a:.58 },
    { x:"57%", y:"30%", w:22, h:14, c:"#F3A8AD", delay:"11.3s", dur:"18s", sx:"-62px", rot:"-115deg", a:.55 },
    { x:"12%", y:"46%", w:26, h:16, c:"#E88D98", delay:"6.2s",  dur:"30s", sx:"40px",  rot:"125deg",  a:.6  },
    { x:"82%", y:"12%", w:19, h:12, c:"#FFD0C9", delay:"12.6s", dur:"33s", sx:"-48px", rot:"-105deg", a:.5  },
    { x:"33%", y:"80%", w:25, h:16, c:"#F3A8AD", delay:"9s",    dur:"35s", sx:"56px",  rot:"135deg",  a:.58 },
  ];
  const petalBox = $("#env-petals");
  if (petalBox) {
    petals.forEach((p) => {
      const d = document.createElement("span");
      d.className = "env-petal";
      d.style.cssText =
        `left:${p.x};top:${p.y};width:${p.w}px;height:${p.h}px;` +
        `background:${p.c};` +
        `--dur:${p.dur};--delay:${p.delay};--sx:${p.sx};--rot:${p.rot};--a:${p.a};`;
      petalBox.appendChild(d);
    });
  }

  const moteBox = $("#env-motes");
  if (moteBox) {
    const tones = ["#D4A24C", "#c9944c", "#e6c98a"];
    for (let i = 0; i < 18; i++) {
      const m = document.createElement("span");
      m.className = "env-mote";
      const size = 1.6 + (i % 3) * 0.6;
      m.style.cssText =
        `left:${((i * 8.3 + 4) % 94).toFixed(1)}%;` +
        `top:${((i * 13.7 + 6) % 88).toFixed(1)}%;` +
        `width:${size.toFixed(1)}px;height:${size.toFixed(1)}px;` +
        `--mc:${tones[i % tones.length]};` +
        `--mdx:${(((i * 17.3 + 9) % 70) - 20).toFixed(0)}px;` +
        `--mdy:${-(10 + (i % 5) * 6)}px;` +
        `--md:${(2.8 + (i % 5) * 0.9).toFixed(2)}s;` +
        `--mdd:${((i * 0.83) % 4).toFixed(2)}s;` +
        `--ma:${(0.3 + (i % 4) * 0.12).toFixed(2)};`;
      moteBox.appendChild(m);
    }
  }

  /* open-screen flourish — soft hearts rising as the seal breaks */
  function heartRise() {
    if (reduced) return;
    const layer = $("#env-petals");
    if (!layer) return;
    const tones = ["#E88D98", "#F3A8AD", "#FFD0C9"];
    for (let i = 0; i < 16; i++) {
      const h = document.createElement("span");
      h.className = "env-heart-rise";
      const size = 16 + (i % 4) * 5;
      const drift = ((i * 29.7 + 10) % 120) - 60;
      h.style.cssText =
        `left:${((4 + ((i * 8.1 + 3) % 92))).toFixed(1)}%;` +
        `bottom:-34px;width:${size}px;height:${Math.round(size * 0.82)}px;` +
        `--hc:${tones[i % tones.length]};` +
        `--ha:${(0.55 + (i % 4) * 0.1).toFixed(2)};` +
        `--hdx:${drift.toFixed(0)}px;` +
        `--hd:${(4.2 + (i % 5) * 0.5).toFixed(2)}s;` +
        `--hdd:${((i * 0.37) % 2.3).toFixed(2)}s;`;
      layer.appendChild(h);
      setTimeout(() => h.remove(), 9000);
    }
  }

  const envOuter = $("#env-outer");
  const envelope = $("#envelope");
  const envBloom = $("#env-bloom");
  const envStage = $(".env-stage");
  const site = $("#site");

  let envPhase = "idle";
  function openEnvelope() {
    if (envPhase !== "idle") return;
    envPhase = "opening";

    /* 1 + 2 — the seal leans in, then breaks */
    envStage.classList.add("clicked");
    setTimeout(() => {
      envelope.classList.add("open");
      envStage.classList.add("bursting");
      envOuter.classList.add("bursting");
      const r = envelope.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height * 0.52, 12, ["#f0dfa8", "#D4A24C", "#fff8f0"]);
      heartRise();
    }, 280);

    /* 3 + 4 — the flap opens, the letter rises */
    /* 5 + 6 — soft sheen, the site rises behind it, the room hands over */
    setTimeout(() => {
      envPhase = "bloom";
      envBloom.classList.add("expand");
      envOuter.classList.add("blooming");
      setTimeout(() => {
        site.classList.add("ready");
        window.__introDone = true;
        if (heroPending && typeof replayHero === "function") replayHero();
      }, 420);
      setTimeout(() => {
        envBloom.classList.add("fading");
        envOuter.classList.add("hidden");
      }, 1080);
      setTimeout(() => { envPhase = "done"; }, 2100);
    }, 1150);
  }
  envOuter.addEventListener("click", openEnvelope);
  envOuter.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEnvelope(); }
  });
  /* ──────────────────────────────────────────────
     HERO — letter-by-letter names, sparks, petals, replay
     ────────────────────────────────────────────── */
  const heroSparks = Array.from({ length: 22 }, (_, i) => ({
    left: `${(i * 4.4 + 2) % 95}%`,
    bottom: `${10 + (i % 6) * 8}%`,
    size: 1.8 + (i % 3),
    color: ["#f0dfa8", "#d4a84e", "#b8913a", "#ffe08a"][i % 4],
    dur: `${3 + (i % 5) * 0.5}s`,
    delay: `${(i * 0.38) % 5}s`,
  }));
  const heroPetals = [
    { x:"4%",  y:"10%", w:22, h:13, c:"#f0c8d0", delay:"0s",   dur:"9s",  rot:14  },
    { x:"87%", y:"8%",  w:17, h:11, c:"#e8b8c4", delay:"1.2s", dur:"11s", rot:-18 },
    { x:"6%",  y:"58%", w:26, h:16, c:"#f5d0d8", delay:"2.5s", dur:"10s", rot:22  },
    { x:"90%", y:"50%", w:19, h:12, c:"#f0c8d0", delay:".8s",  dur:"13s", rot:-10 },
    { x:"15%", y:"83%", w:15, h:10, c:"#e8b8c4", delay:"3.3s", dur:"9s",  rot:8   },
    { x:"81%", y:"79%", w:23, h:14, c:"#f5d0d8", delay:"1.7s", dur:"12s", rot:-22 },
    { x:"45%", y:"4%",  w:13, h:8,  c:"#f0c8d0", delay:"4.1s", dur:"10s", rot:16  },
    { x:"32%", y:"70%", w:18, h:11, c:"#e8b8c4", delay:"2.9s", dur:"8.5s",rot:-8  },
    { x:"68%", y:"20%", w:14, h:9,  c:"#f5d0d8", delay:"5.2s", dur:"9.5s",rot:20  },
  ];

  const sparksBox = $("#hero-sparks");
  heroSparks.forEach((s) => {
    const d = document.createElement("div");
    d.className = "hero-particle";
    d.style.cssText = `left:${s.left};bottom:${s.bottom};width:${s.size}px;height:${s.size}px;background:${s.color};box-shadow:0 0 ${s.size * 3}px ${s.size}px ${s.color}88;animation-duration:${s.dur};animation-delay:${s.delay};`;
    sparksBox.appendChild(d);
  });

  const petalsBox = $("#hero-petals");
  const petalEls = [];
  heroPetals.forEach((p) => {
    const d = document.createElement("div");
    d.className = "hero-petal";
    d.style.cssText = `left:${p.x};top:${p.y};width:${p.w}px;height:${p.h}px;background:${p.c};opacity:.45;transform:rotate(${p.rot}deg);animation-duration:${p.dur};animation-delay:${p.delay};`;
    petalsBox.appendChild(d);
    petalEls.push(d);
  });
  /* Parallax — petals drift up slightly with scroll (same as original) */
  let raf = 0;
  window.addEventListener("scroll", () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      petalsBox.style.transform = `translateY(-${window.scrollY * 0.1}px)`;
    });
  }, { passive: true });

  /* Many small hearts burst from the name at reveal, then keep floating */
  const loveBox = document.createElement("div");
  loveBox.className = "hero-love";
  loveBox.setAttribute("aria-hidden", "true");
  const LOVE_COLORS = ["#ff8fa3", "#ffb3c1", "#ff5e78", "#f0dfa8", "#ff9db0"];
  for (let i = 0; i < 16; i++) {
    const h = document.createElement("span");
    h.className = "name-heart burst";
    h.textContent = "♥";
    const ang = (i / 16) * Math.PI * 2 + Math.random() * 0.5;
    const dist = 50 + Math.random() * 80;
    const size = 9 + Math.random() * 9;
    const dur = 2.8 + Math.random() * 1.8;
    h.style.cssText =
      `font-size:${size}px;color:${LOVE_COLORS[i % LOVE_COLORS.length]};` +
      `--tx:${Math.round(Math.cos(ang) * dist)}px;--ty:${Math.round(Math.sin(ang) * dist - 52)}px;` +
      `--dur:${dur.toFixed(2)}s;--dl:${(3.7 + Math.random() * 0.9).toFixed(2)}s;`;
    loveBox.appendChild(h);
  }
  for (let i = 0; i < 14; i++) {
    const h = document.createElement("span");
    h.className = "name-heart drift";
    h.textContent = "♥";
    const size = 8 + Math.random() * 8;
    const ox = Math.round(Math.random() * 230 - 115);
    const oy = Math.round(Math.random() * 190 - 130);
    const dur = 6.5 + Math.random() * 6;
    h.style.cssText =
      `font-size:${size}px;color:${LOVE_COLORS[i % LOVE_COLORS.length]};` +
      `--ox:${ox}px;--oy:${oy}px;` +
      `--dur:${dur.toFixed(2)}s;--dl:${(4.2 + i * 0.4).toFixed(2)}s;`;
    loveBox.appendChild(h);
  }
  $(".hero-names").appendChild(loveBox);

  /* Letter-by-letter names */
  function letterize(el) {
    const text = el.textContent.trim() || el.dataset.letters || "";
    const delayBase = parseInt(el.dataset.delay || "300", 10);
    el.textContent = "";
    Array.from(text).forEach((ch, i) => {
      const s = document.createElement("span");
      s.className = "ltr";
      s.textContent = ch === " " ? "\u00A0" : ch;
      s.style.animationDelay = `${delayBase + i * 80}ms`;
      el.appendChild(s);
    });
    el.removeAttribute("data-letters");
  }
  letterize($("[data-letters='Aarav']"));
  letterize($("[data-letters='Meera']"));

  /* Replay hero animations whenever the hero re-enters the viewport.
     Wait until the envelope has opened so the name reveal is actually seen. */
  const hero = $("#hero");
  let heroPending = false;
  let heroReplayed = false;
  function replayHero() {
    hero.classList.remove("played");
    const cur = $("#hero-anims");
    const fresh = cur.cloneNode(true);
    cur.replaceWith(fresh);
    void fresh.offsetWidth; /* reflow */
    hero.classList.add("played");
    heroReplayed = true;
  }
  new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    heroPending = true;
    if (window.__introDone) replayHero();
  }, { threshold: 0.4 }).observe(hero);

  /* ──────────────────────────────────────────────
     REVEAL ON SCROLL (generic)
     ────────────────────────────────────────────── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("on");
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -22% 0px" });

  $$(".reveal, .reveal-s, .sec-head, .story-head").forEach((el) => io.observe(el));

  /* Section-level gates (children have their own staggered transitions) */
  const gate = (selector, threshold, margin) => {
    const el = $(selector);
    if (!el) return;
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("on"); }
    }, { threshold: threshold || 0.12, rootMargin: margin || "0px 0px -20% 0px" }).observe(el);
  };
  gate("#message", 0.06, "0px 0px -25% 0px");
  gate("#venue", 0.15, "0px 0px -30% 0px");
  gate("#countdown", 0.12, "0px 0px -25% 0px");

  /* Celebration oval cards — entrance + floating petals */
  const celebObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("on");
      celebObs.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -22% 0px" });
  $$(".oval-card").forEach((c) => celebObs.observe(c));

  /* Floating petals in celebration section */
  const celebSection = $(".celeb-section");
  if (celebSection) {
    const petalColors = ["#e8a0b4", "#d48a9e", "#f0c0cc", "#c9a84c", "#dbb85a"];
    for (let i = 0; i < 12; i++) {
      const p = document.createElement("span");
      p.className = "celeb-petal";
      const size = 8 + (i % 4) * 4;
      p.style.cssText =
        `left:${(Math.random() * 92 + 4).toFixed(1)}%;` +
        `top:${(Math.random() * 88 + 6).toFixed(1)}%;` +
        `width:${size}px;height:${(size * 0.6).toFixed(0)}px;` +
        `background:${petalColors[i % petalColors.length]};` +
        `--r:${(Math.random() * 360).toFixed(0)}deg;` +
        `--tx:${(Math.random() * 16 - 8).toFixed(0)}px;` +
        `--ty:${(Math.random() * 14 - 10).toFixed(0)}px;` +
        `animation-duration:${(4 + Math.random() * 3).toFixed(1)}s;` +
        `animation-delay:${(Math.random() * 4).toFixed(1)}s;`;
      celebSection.appendChild(p);
    }
  }

  /* Lazy images fade in */
  $$(".celeb-img img").forEach((img) => {
    const src = img.dataset.src;
    if (src) img.src = src;
    if (img.complete && img.naturalWidth > 0) { img.classList.add("loaded"); return; }
    img.addEventListener("load", () => img.classList.add("loaded"));
    img.addEventListener("error", () => img.classList.add("loaded"));
  });

  /* Story timeline rows */
  const storyObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("on");
      e.target.querySelectorAll(".story-card").forEach((c) => c.classList.add("born"));
      /* memory photos load only now — when the guest actually reaches this row */
      e.target.querySelectorAll(".story-hidden-img[data-src]").forEach((im) => {
        const src = im.dataset.src;
        if (src) {
          im.src = src;
          im.addEventListener("load", () => im.classList.add("loaded"));
          im.addEventListener("error", () => im.classList.add("loaded"));
        }
      });
      storyObs.unobserve(e.target);
    });
  }, { threshold: 0.25, rootMargin: "0px 0px -30% 0px" });
  $$(".story-row").forEach((r) => storyObs.observe(r));

  /* ──────────────────────────────────────────────
     STORY — tap a card to reveal a hidden memory
     ────────────────────────────────────────────── */
  $$(".story-card").forEach((card) => {
    card.addEventListener("click", (ev) => {
      const opened = card.classList.toggle("opened");
      if (opened && card.classList.contains("celebrate")) {
        /* the wedding day gets an extra pink-heart celebration */
        burstAt(card, 22, ["#ff8fa3", "#ff5e78", "#ffb3c1", "#f0dfa8", "#ffffff"]);
      } else {
        burstAt(card, opened ? 10 : 6);
      }
    });
  });

  /* ════════════════════════════════════════════════════════════
     WEDDING DAY CARD — continuous floating hearts (JS-generated)
     ════════════════════════════════════════════════════════════ */
  const weddingCard = $(".story-card.celebrate");
  if (weddingCard) {
    const heartBox = weddingCard.querySelector(".card-hearts");
    const heartColors = [
      "#ff5e78", "#ff8fa3", "#ffb3c1", "#ff6b8a",
      "#e84552", "#f0a0b4", "#ffd1dc", "#ff9db0",
      "#ff4d6d", "#ff758f", "#ffb3c6", "#f0dfa8",
      "#ff94a8", "#ffc0cc", "#ff8fa3"
    ];
    /* Create 24 continuous hearts with varied sizes, speeds, and positions */
    for (let i = 0; i < 24; i++) {
      const h = document.createElement("i");
      h.className = "card-heart";
      const size = 10 + (i % 8) * 3;
      const left = 3 + (i * 4.1) % 94;
      const dur = 5 + (i % 7) * 1.1;
      const delay = (i * 0.5) % 8;
      const color = heartColors[i % heartColors.length];
      h.style.cssText =
        `--hx:${left.toFixed(1)}%;--hd:${dur.toFixed(1)}s;--hdl:${delay.toFixed(1)}s;--hc:${color};` +
        `font-size:${size}px;`;
      heartBox.appendChild(h);
    }
    /* Add sparkle mini-hearts */
    for (let i = 0; i < 8; i++) {
      const s = document.createElement("i");
      s.className = "card-heart";
      const size = 5 + (i % 3) * 2;
      const left = 8 + (i * 12) % 84;
      s.style.cssText =
        `--hx:${left}%;--hd:${(3.5 + i * 0.7).toFixed(1)}s;--hdl:${(0.8 + i * 1).toFixed(1)}s;--hc:#ffd1dc;` +
        `font-size:${size}px;opacity:.65;`;
      heartBox.appendChild(s);
    }
  }

  /* PATAKHA — when the wedding-day card scrolls into view, fire a grand celebration */
  if (weddingCard && typeof IntersectionObserver !== "undefined") {
    const pat  = ["#ff8fa3", "#ff5e78", "#ffb3c1", "#f0dfa8", "#ffe08a", "#ffd166", "#ffffff", "#e84552", "#ff6b8a", "#ff4d6d"];
    const pat2 = ["#ffd166", "#ffe08a", "#ffb3c1", "#ffffff", "#f0dfa8", "#ffb3c6"];
    const pat3 = ["#ff5e78", "#ff8fa3", "#ff4d6d", "#ff758f", "#ffb3c1"];
    const io2 = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      setTimeout(() => {
        const r = weddingCard.getBoundingClientRect();
        const x  = r.left + r.width / 2;
        const cy = r.top + r.height / 2;

        /* Wave 1 — central blast */
        flashAt(x, cy);
        firework(x, cy, pat, 36);

        /* Wave 2 — left + right patakha */
        setTimeout(() => {
          flashAt(x + r.width * 0.3, cy - 30);
          firework(x + r.width * 0.3, cy - 30, pat2, 26);
        }, 550);
        setTimeout(() => {
          flashAt(x - r.width * 0.3, cy - 36);
          firework(x - r.width * 0.3, cy - 36, pat2, 28);
        }, 1100);

        /* Wave 3 — top + bottom sparkle */
        setTimeout(() => {
          flashAt(x, cy - 60);
          firework(x, cy - 60, pat3, 20);
        }, 1650);
        setTimeout(() => {
          flashAt(x + r.width * 0.15, cy + 30);
          burst(x + r.width * 0.15, cy + 30, 18, pat);
        }, 2000);

        /* Wave 4 — grand finale burst */
        setTimeout(() => {
          flashAt(x - r.width * 0.15, cy - 50);
          firework(x - r.width * 0.15, cy - 50, pat, 30);
          flashAt(x + r.width * 0.2, cy - 20);
          firework(x + r.width * 0.2, cy - 20, pat2, 24);
        }, 2500);

        /* Wave 5 — shower of hearts */
        setTimeout(() => {
          const heartBurst = ["#ff5e78", "#ff8fa3", "#ffb3c1", "#ff6b8a", "#e84552"];
          for (let i = 0; i < 28; i++) {
            setTimeout(() => {
              const hx = x + (Math.random() - 0.5) * r.width * 1.8;
              const hy = cy - 40 + (Math.random() - 0.5) * 60;
              burst(hx, hy, 4, heartBurst);
            }, i * 60);
          }
        }, 3100);

        /* Wave 6 — final sparkle ring */
        setTimeout(() => {
          flashAt(x, cy - 20);
          firework(x, cy - 20, ["#ffd166", "#ffe08a", "#ffffff", "#f0dfa8"], 40);
        }, 3800);
      }, 450);
      io2.unobserve(weddingCard);
    }, { threshold: 0.45 });
    io2.observe(weddingCard);
  }

  /* ──────────────────────────────────────────────
     MESSAGE — typewriter reveal, only starts when the
     guest scrolls the section into view
     ────────────────────────────────────────────── */
  const msgSection = $("#message");
  if (msgSection && !reduced) msgSection.classList.add("typing-active");
  const msgTypeBox = $(".message-section") && ($(".msg-desktop .msg-lines") || $(".msg-mobile .msg-lines"));
  if (msgSection && msgTypeBox && typeof IntersectionObserver !== "undefined") {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const typeIO = new IntersectionObserver(async ([en]) => {
      if (!en.isIntersecting) return;
      typeIO.unobserve(msgSection);
      await sleep(350);
      const visible = $(".msg-desktop") && getComputedStyle($(".msg-desktop")).display !== "none"
        ? $(".msg-desktop .msg-lines")
        : $(".msg-mobile .msg-lines");
      const lines = visible ? Array.from(visible.querySelectorAll(".msg-line")) : [];
      if (!lines.length || reduced) {
        return; /* text stays as-is for reduced motion */
      }
      const ld = 32;
      for (const el of lines) {
        const raw = el.textContent.trim();
        el.textContent = "";
        const typed = document.createElement("span");
        const caret = document.createElement("i");
        caret.className = "caret";
        el.appendChild(typed);
        el.appendChild(caret);
        el.classList.add("typing");
        for (let c = 0; c < raw.length; c++) {
          typed.textContent += raw[c];
          await sleep(ld);
        }
        el.classList.remove("typing");
        el.classList.add("done");
        caret.remove();
      }
    }, { threshold: 0.35 });
    typeIO.observe(msgSection);
  }

  /* ──────────────────────────────────────────────
     SECRET LETTER — tap the wax seal
     ────────────────────────────────────────────── */
  const miniSeal = $("#mini-seal");
  const secretLetter = $("#secret-letter");
  if (miniSeal && secretLetter) {
    miniSeal.addEventListener("click", () => {
      if (secretLetter.classList.contains("open")) return;
      miniSeal.classList.add("gone");
      burstAt(miniSeal, 18);
      setTimeout(() => secretLetter.classList.add("open"), 220);

      /* sparkle the reveal */
      setTimeout(() => {
        const p = secretLetter.getBoundingClientRect();
        burst(p.left + p.width / 2, p.top + 16, 14);
      }, 500);
    });
  }

  /* ──────────────────────────────────────────────
     DIYAS — light one for the couple
     ────────────────────────────────────────────── */
  const diyas = $$(".diya");
  const diyasDone = $("#diyas-done");
  let litCount = 0;
  diyas.forEach((d) => {
    d.addEventListener("click", () => {
      if (d.classList.contains("lit")) return;
      d.classList.add("lit");
      litCount += 1;
      burstAt(d, 14);
      if (litCount === diyas.length) {
        diyasDone.classList.add("show");
        burstAt($("#diyas"), 24);
      }
    });
  });

  /* ──────────────────────────────────────────────
     DIAMOND RING — make a wish
     ────────────────────────────────────────────── */
  const diamond = $("#diamond");
  diamond.addEventListener("click", () => {
    diamond.classList.remove("pulse");
    void diamond.offsetWidth;
    diamond.classList.add("pulse");
    burstAt(diamond, 22);
  });
  diamond.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); diamond.click(); }
  });

  /* ──────────────────────────────────────────────
     COUNTDOWN — flip digits to 21 Feb 2027 11:42 IST
     ────────────────────────────────────────────── */
  const WEDDING = new Date("2027-02-21T11:42:00+05:30").getTime();
  const getLeft = () => {
    const r = Math.max(0, WEDDING - Date.now());
    return {
      days: Math.floor(r / 86400000),
      hours: Math.floor((r % 86400000) / 3600000),
      minutes: Math.floor((r % 3600000) / 60000),
      seconds: Math.floor((r % 60000) / 1000),
    };
  };
  const digits = {
    days: $("#countdown [data-unit='days']"),
    hours: $("#countdown [data-unit='hours']"),
    minutes: $("#countdown [data-unit='minutes']"),
    seconds: $("#countdown [data-unit='seconds']"),
  };
  function setDigit(el, value) {
    const str = String(value).padStart(2, "0");
    if (el.textContent !== str) {
      el.classList.add("flip");
      const unit = el.closest(".count-unit");
      const pulse = unit && unit.querySelector(".unit-pulse");
      if (pulse) {
        pulse.classList.remove("pulse");
        void pulse.offsetWidth;
        pulse.classList.add("pulse");
      }
      setTimeout(() => {
        el.textContent = str;
        setTimeout(() => el.classList.remove("flip"), 40);
      }, 175);
    }
  }
  function tick() {
    const t = getLeft();
    setDigit(digits.days, t.days);
    setDigit(digits.hours, t.hours);
    setDigit(digits.minutes, t.minutes);
    setDigit(digits.seconds, t.seconds);
  }
  tick();
  let timer = null;
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !timer) {
      timer = setInterval(tick, 1000);
    } else if (!e.isIntersecting && timer) {
      clearInterval(timer);
      timer = null;
    }
  }, { threshold: 0.08, rootMargin: "0px 0px -35% 0px" }).observe($("#countdown"));

  /* ──────────────────────────────────────────────
     STORY — golden timeline draws itself as you scroll
     ────────────────────────────────────────────── */
  const storyLine = document.querySelector(".story-line");
  if (storyLine) {
    const drawTimeline = () => {
      const r = storyLine.getBoundingClientRect();
      const total = r.height || 1;
      const visible = Math.min(Math.max(0, Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0)), total);
      const p = total > 0 ? visible / total : 0;
      storyLine.style.setProperty("--p", p.toFixed(3));
    };
    window.addEventListener("scroll", drawTimeline, { passive: true });
    window.addEventListener("resize", drawTimeline);
    drawTimeline();
  }

  /* ──────────────────────────────────────────────
     MESSAGE — little hearts float up through the letter (enhanced)
     ────────────────────────────────────────────── */
  const msgHearts = $("#msg-hearts");
  const msgHeartColors = [
    "rgba(255,140,160,.55)", "rgba(184,145,58,.5)", "rgba(255,180,193,.45)",
    "rgba(232,69,82,.4)", "rgba(240,223,168,.45)", "rgba(255,160,175,.5)"
  ];
  for (let i = 0; i < 20; i++) {
    const h = document.createElement("span");
    h.className = "msg-heart";
    h.textContent = "♥";
    const size = 10 + (i % 6) * 4;
    h.style.cssText =
      `left:${(i * 5.1 + 2) % 96}%;` +
      `font-size:${size}px;` +
      `color:${msgHeartColors[i % msgHeartColors.length]};` +
      `animation-duration:${(5.5 + (i % 7) * 1.1).toFixed(1)}s;` +
      `animation-delay:${(i * 0.75).toFixed(1)}s;`;
    msgHearts.appendChild(h);
  }

  /* ──────────────────────────────────────────────
     AMBIENT — gold stars in dark sections
     ────────────────────────────────────────────── */
  function addTwinkles(selector, count) {
    const box = $(selector);
    if (!box) return;
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.className = "twinkle";
      const size = 2 + Math.random() * 3;
      s.style.cssText =
        `left:${(Math.random() * 96 + 2).toFixed(1)}%;top:${(Math.random() * 92 + 3).toFixed(1)}%;` +
        `width:${size.toFixed(1)}px;height:${size.toFixed(1)}px;` +
        `--td:${(2.8 + Math.random() * 3.4).toFixed(2)}s;--tdl:${(Math.random() * 4).toFixed(2)}s;`;
      box.appendChild(s);
    }
  }
  addTwinkles(".venue-section", 16);
  addTwinkles(".countdown-section", 14);
  addTwinkles(".message-section", 12);
  addTwinkles(".story-section", 8);

  /* Floating star particles for venue section */
  const venueSec = $(".venue-section");
  if (venueSec) {
    for (let i = 0; i < 20; i++) {
      const s = document.createElement("span");
      s.style.cssText =
        `position:absolute;border-radius:50%;pointer-events:none;z-index:1;` +
        `width:${1 + (i % 3)}px;height:${1 + (i % 3)}px;` +
        `left:${(Math.random() * 96 + 2).toFixed(1)}%;` +
        `top:${(Math.random() * 96 + 2).toFixed(1)}%;` +
        `background:${i % 3 === 0 ? "rgba(212,168,110,.65)" : i % 3 === 1 ? "rgba(240,223,168,.5)" : "rgba(255,240,200,.55)"};` +
        `box-shadow:0 0 ${4 + (i % 3) * 2}px ${i % 3 === 0 ? "rgba(212,168,110,.4)" : "rgba(240,223,168,.3)"};` +
        `animation:venue-star-drift ${(6 + i % 5 * 2).toFixed(1)}s ${(i * 0.4).toFixed(1)}s ease-in-out infinite alternate;`;
      venueSec.appendChild(s);
    }
  }

  /* Floating star particles for story section */
  const storySec = $(".story-section");
  if (storySec) {
    for (let i = 0; i < 18; i++) {
      const s = document.createElement("span");
      s.style.cssText =
        `position:absolute;border-radius:50%;pointer-events:none;z-index:1;` +
        `width:${1 + (i % 4) * 0.5}px;height:${1 + (i % 4) * 0.5}px;` +
        `left:${(Math.random() * 96 + 2).toFixed(1)}%;` +
        `top:${(Math.random() * 96 + 2).toFixed(1)}%;` +
        `background:${i % 3 === 0 ? "rgba(212,168,110,.55)" : i % 3 === 1 ? "rgba(240,223,168,.45)" : "rgba(255,244,214,.5)"};` +
        `box-shadow:0 0 ${3 + (i % 3) * 2}px ${i % 2 === 0 ? "rgba(212,168,110,.3)" : "rgba(240,223,168,.2)"};` +
        `animation:story-star-drift ${(5 + i % 4 * 1.5).toFixed(1)}s ${(i * 0.5).toFixed(1)}s ease-in-out infinite alternate;`;
      storySec.appendChild(s);
    }
  }

  /* fireflies drifting through the hero sky */
  const heroBox = $(".hero");
  if (heroBox) {
    for (let i = 0; i < 6; i++) {
      const f = document.createElement("span");
      f.className = "firefly";
      f.style.cssText =
        `left:${(4 + Math.random() * 90).toFixed(1)}%;top:${(12 + Math.random() * 58).toFixed(1)}%;` +
        `--fd:${(10 + Math.random() * 5).toFixed(1)}s;--fdl:${(Math.random() * 7).toFixed(1)}s;`;
      heroBox.appendChild(f);
    }
  }

  /* ──────────────────────────────────────────────
     AUDIO TOGGLE
     ────────────────────────────────────────────── */
  const audio = $("#bg-audio");
  const audioBtn = $("#audio-btn");
  const icoPlay = $("#ico-play");
  const icoPause = $("#ico-pause");
  let audioFailed = false;
  audio.addEventListener("error", () => { audioFailed = true; });
  audioBtn.addEventListener("click", async () => {
    if (audioFailed) {
      burstAt(audioBtn, 10); /* the song couldn't load — sparkle anyway */
      return;
    }
    try {
      if (audio.paused) {
        await audio.play();
        audioBtn.classList.add("playing");
        icoPlay.style.display = "block";
        icoPause.style.display = "none";
      } else {
        audio.pause();
        audioBtn.classList.remove("playing");
        icoPlay.style.display = "none";
        icoPause.style.display = "block";
      }
    } catch (_) { /* blocked — ignore */ }
  });

  /* ──────────────────────────────────────────────
     MESSAGE SECTION — floating particles
     ────────────────────────────────────────────── */
  const msgBox = $("#msg-particles");
  for (let i = 0; i < 12; i++) {
    const d = document.createElement("span");
    const size = 1.5 + (i % 3) * 0.8;
    d.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;` +
      `left:${6 + (i * 8)}%;top:${10 + (i % 6) * 14}%;` +
      `background:${i % 3 === 0 ? "rgba(220,140,160,.6)" : i % 3 === 1 ? "rgba(200,120,140,.5)" : "rgba(240,180,190,.4)"};` +
      `box-shadow:0 0 ${4 + (i % 3) * 2}px ${i % 2 === 0 ? "rgba(220,140,160,.3)" : "rgba(200,120,140,.2)"};` +
      `opacity:0;animation:particle-rise ${(2.4 + i * 0.3).toFixed(2)}s ${(i * 0.25).toFixed(2)}s ease-in-out infinite;`;
    msgBox.appendChild(d);
  }
})();
