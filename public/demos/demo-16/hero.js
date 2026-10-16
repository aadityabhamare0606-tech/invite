/* Rajwada Royale Extended (demo-16) — transplanted Love-Letter gate + hero.
   Same stack as demo-8 (static demo under public/demos, React bundle untouched).
   Only: envelope gate + hero come from demo-9's design with the 5th's photo
   background; everything below the hero is demo-8 as-is. */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── 0. Retire ONLY the old demo-8 hero visuals (Rahul/Namita over
     /assets/12.svg). Invite (invitation-details), Celebrations
     (events-section) and Date Reveal (date-reveal-section) share the
     old hero's neighbourhood — they stay exactly where React put them,
     so the page flows: new hero → invite → celebrations → date reveal
     → venue → rest. Deliberately NO node moves: the bundle re-renders
     on scroll and moved nodes would come back as duplicates. ── */
  function swapOriginalHero() {
    const app = document.getElementById("app");
    if (!app) return false;
    const img = app.querySelector("img.hero-bg-img-full");
    const inv = app.querySelector("section.invitation-details");
    const ev = app.querySelector("section.events-section");
    if (!img || !inv || !ev) return false; // React still mounting — retry
    const heroSec = img.closest("section");
    if (heroSec) {
      // 1. old backdrop (absolute overlay holding the 12.svg bg)
      const bg = img.closest("div");
      if (bg) bg.style.display = "none";
      // 2. old sticky floating-hearts layer
      const heart = heroSec.querySelector(".hero-heart-wrap");
      const sticky = heart
        ? heart.closest("div.sticky")
        : heroSec.querySelector("div.sticky");
      if (sticky && heroSec.contains(sticky)) sticky.style.display = "none";
      // 3. old hero copy (names / crest / tagline / seal / rule)
      const nameLine = heroSec.querySelector(".hero-name-line");
      const content = nameLine
        ? nameLine.closest('div[class*="min-h-[115svh]"]')
        : null;
      if (content) content.style.display = "none";
    }
    // 4. the old hero pulled Invite up over itself (-mt-28 / md:-mt-24);
    // with the old copy gone, cancel the overlap pull-up.
    [inv, inv.parentElement].forEach((el) => {
      if (el && el.style) el.style.marginTop = "0";
    });
    return true;
  }
  if (!swapOriginalHero()) {
    const mo = new MutationObserver(() => {
      if (swapOriginalHero()) mo.disconnect();
    });
    mo.observe(document.getElementById("app") || document.body, {
      childList: true,
      subtree: true,
    });
    setTimeout(() => mo.disconnect(), 12000);
  }

  /* ── Gold sparkle burst ── */
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

  /* ── Envelope petals + gold motes ── */
  const petals = [
    { x: "5%", y: "3%", w: 26, h: 16, c: "#E88D98", delay: "0s", dur: "24s", sx: "-70px", rot: "-120deg", a: 0.6 },
    { x: "86%", y: "9%", w: 20, h: 13, c: "#F3A8AD", delay: "2.6s", dur: "27s", sx: "60px", rot: "120deg", a: 0.55 },
    { x: "2%", y: "38%", w: 30, h: 19, c: "#FFD0C9", delay: "4.8s", dur: "25s", sx: "-52px", rot: "130deg", a: 0.5 },
    { x: "89%", y: "44%", w: 22, h: 14, c: "#E88D98", delay: "1.8s", dur: "29s", sx: "66px", rot: "-110deg", a: 0.58 },
    { x: "10%", y: "66%", w: 17, h: 11, c: "#F3A8AD", delay: "6.8s", dur: "23s", sx: "-44px", rot: "105deg", a: 0.6 },
    { x: "79%", y: "74%", w: 27, h: 17, c: "#FFD0C9", delay: "4s", dur: "21s", sx: "50px", rot: "-135deg", a: 0.52 },
    { x: "46%", y: "1%", w: 16, h: 10, c: "#FFD0C9", delay: "8.2s", dur: "26s", sx: "54px", rot: "95deg", a: 0.48 },
    { x: "66%", y: "26%", w: 24, h: 15, c: "#E88D98", delay: "10s", dur: "22s", sx: "-58px", rot: "-100deg", a: 0.56 },
    { x: "36%", y: "20%", w: 18, h: 12, c: "#F3A8AD", delay: "5.6s", dur: "19s", sx: "-38px", rot: "140deg", a: 0.5 },
    { x: "24%", y: "55%", w: 21, h: 13, c: "#E88D98", delay: "7.8s", dur: "28s", sx: "46px", rot: "-125deg", a: 0.54 },
    { x: "71%", y: "58%", w: 19, h: 12, c: "#FFD0C9", delay: "9.4s", dur: "31s", sx: "-42px", rot: "115deg", a: 0.5 },
    { x: "15%", y: "18%", w: 23, h: 15, c: "#E88D98", delay: "3.4s", dur: "20s", sx: "64px", rot: "-95deg", a: 0.58 },
    { x: "57%", y: "30%", w: 22, h: 14, c: "#F3A8AD", delay: "11.3s", dur: "18s", sx: "-62px", rot: "-115deg", a: 0.55 },
    { x: "12%", y: "46%", w: 26, h: 16, c: "#E88D98", delay: "6.2s", dur: "30s", sx: "40px", rot: "125deg", a: 0.6 },
    { x: "82%", y: "12%", w: 19, h: 12, c: "#FFD0C9", delay: "12.6s", dur: "33s", sx: "-48px", rot: "-105deg", a: 0.5 },
    { x: "33%", y: "80%", w: 25, h: 16, c: "#F3A8AD", delay: "9s", dur: "35s", sx: "56px", rot: "135deg", a: 0.58 },
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
        `left:${(4 + ((i * 8.1 + 3) % 92)).toFixed(1)}%;` +
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

  /* ── Envelope open choreography (no #site wrapper here — the hero is
     already in normal flow behind the fixed gate) ── */
  const envOuter = $("#env-outer");
  const envelope = $("#envelope");
  const envBloom = $("#env-bloom");
  const envStage = $(".env-stage");
  const hero = $("#hero");
  let envPhase = "idle";
  let heroPending = false;

  function replayHero() {
    if (!hero) return;
    hero.classList.remove("played");
    const cur = $("#hero-anims");
    if (cur) {
      const fresh = cur.cloneNode(true);
      cur.replaceWith(fresh);
      void fresh.offsetWidth;
    }
    hero.classList.add("played");
  }

  function openEnvelope() {
    if (envPhase !== "idle" || !envOuter) return;
    envPhase = "opening";
    if (envStage) envStage.classList.add("clicked");
    setTimeout(() => {
      if (envelope) envelope.classList.add("open");
      if (envStage) envStage.classList.add("bursting");
      envOuter.classList.add("bursting");
      if (envelope) {
        const r = envelope.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height * 0.52, 12, ["#f0dfa8", "#D4A24C", "#fff8f0"]);
      }
      heartRise();
    }, 280);
    setTimeout(() => {
      envPhase = "bloom";
      if (envBloom) envBloom.classList.add("expand");
      envOuter.classList.add("blooming");
      setTimeout(() => {
        window.__introDone = true;
        if (heroPending) replayHero();
        else replayHero();
      }, 420);
      setTimeout(() => {
        if (envBloom) envBloom.classList.add("fading");
        envOuter.classList.add("hidden");
      }, 1080);
      setTimeout(() => {
        envPhase = "done";
      }, 2100);
    }, 1150);
  }
  if (envOuter) {
    envOuter.addEventListener("click", openEnvelope);
    envOuter.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openEnvelope();
      }
    });
  }

  /* ── Hero sparks + petals ── */
  const heroSparks = Array.from({ length: 22 }, (_, i) => ({
    left: `${(i * 4.4 + 2) % 95}%`,
    bottom: `${10 + (i % 6) * 8}%`,
    size: 1.8 + (i % 3),
    color: ["#f0dfa8", "#d4a84e", "#b8913a", "#ffe08a"][i % 4],
    dur: `${3 + (i % 5) * 0.5}s`,
    delay: `${(i * 0.38) % 5}s`,
  }));
  const heroPetals = [
    { x: "4%", y: "10%", w: 22, h: 13, c: "#f0c8d0", delay: "0s", dur: "9s", rot: 14 },
    { x: "87%", y: "8%", w: 17, h: 11, c: "#e8b8c4", delay: "1.2s", dur: "11s", rot: -18 },
    { x: "6%", y: "58%", w: 26, h: 16, c: "#f5d0d8", delay: "2.5s", dur: "10s", rot: 22 },
    { x: "90%", y: "50%", w: 19, h: 12, c: "#f0c8d0", delay: ".8s", dur: "13s", rot: -10 },
    { x: "15%", y: "83%", w: 15, h: 10, c: "#e8b8c4", delay: "3.3s", dur: "9s", rot: 8 },
    { x: "81%", y: "79%", w: 23, h: 14, c: "#f5d0d8", delay: "1.7s", dur: "12s", rot: -22 },
    { x: "45%", y: "4%", w: 13, h: 8, c: "#f0c8d0", delay: "4.1s", dur: "10s", rot: 16 },
    { x: "32%", y: "70%", w: 18, h: 11, c: "#e8b8c4", delay: "2.9s", dur: "8.5s", rot: -8 },
    { x: "68%", y: "20%", w: 14, h: 9, c: "#f5d0d8", delay: "5.2s", dur: "9.5s", rot: 20 },
  ];
  const sparksBox = $("#hero-sparks");
  if (sparksBox) {
    heroSparks.forEach((s) => {
      const d = document.createElement("div");
      d.className = "hero-particle";
      d.style.cssText = `left:${s.left};bottom:${s.bottom};width:${s.size}px;height:${s.size}px;background:${s.color};box-shadow:0 0 ${s.size * 3}px ${s.size}px ${s.color}88;animation-duration:${s.dur};animation-delay:${s.delay};`;
      sparksBox.appendChild(d);
    });
  }
  const petalsBox = $("#hero-petals");
  if (petalsBox) {
    heroPetals.forEach((p) => {
      const d = document.createElement("div");
      d.className = "hero-petal";
      d.style.cssText = `left:${p.x};top:${p.y};width:${p.w}px;height:${p.h}px;background:${p.c};opacity:.45;transform:rotate(${p.rot}deg);animation-duration:${p.dur};animation-delay:${p.delay};`;
      petalsBox.appendChild(d);
    });
    let raf = 0;
    window.addEventListener(
      "scroll",
      () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          petalsBox.style.transform = `translateY(-${window.scrollY * 0.1}px)`;
        });
      },
      { passive: true }
    );
  }

  /* ── Hearts bursting from the names ── */
  const namesBox = $(".hero-names");
  if (namesBox) {
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
    namesBox.appendChild(loveBox);
  }

  /* ── Letter-by-letter names ── */
  function letterize(el) {
    if (!el) return;
    const text = el.textContent.trim() || el.dataset.letters || "";
    const delayBase = parseInt(el.dataset.delay || "300", 10);
    el.textContent = "";
    Array.from(text).forEach((ch, i) => {
      const s = document.createElement("span");
      s.className = "ltr";
      s.textContent = ch === " " ? " " : ch;
      s.style.animationDelay = `${delayBase + i * 80}ms`;
      el.appendChild(s);
    });
    el.removeAttribute("data-letters");
  }
  letterize($("[data-letters='Arjun']"));
  letterize($("[data-letters='Ishaan']"));

  /* Replay hero when it enters view / after the seal opens. */
  if (hero && typeof IntersectionObserver !== "undefined") {
    new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      heroPending = true;
      if (window.__introDone) replayHero();
    }, { threshold: 0.4 }).observe(hero);
  } else if (hero) {
    hero.classList.add("played");
  }

  /* ── Fireflies ── */
  const heroBox = $(".hero");
  if (heroBox && !reduced) {
    for (let i = 0; i < 6; i++) {
      const f = document.createElement("span");
      f.className = "firefly";
      f.style.cssText =
        `left:${(4 + Math.random() * 90).toFixed(1)}%;top:${(12 + Math.random() * 58).toFixed(1)}%;` +
        `--fd:${(10 + Math.random() * 5).toFixed(1)}s;--fdl:${(Math.random() * 7).toFixed(1)}s;`;
      heroBox.appendChild(f);
    }
  }

  /* ── Audio toggle ── */
  const audio = $("#bg-audio");
  const audioBtn = $("#audio-btn");
  if (audio && audioBtn) {
    const icoPlay = $("#ico-play");
    const icoPause = $("#ico-pause");
    let audioFailed = false;
    audio.addEventListener("error", () => {
      audioFailed = true;
    });
    const burstAt = (el, n) => {
      const r = el.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2, n);
    };
    audioBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (audioFailed) {
        burstAt(audioBtn, 10);
        return;
      }
      try {
        if (audio.paused) {
          await audio.play();
          audioBtn.classList.add("playing");
          if (icoPlay) icoPlay.style.display = "block";
          if (icoPause) icoPause.style.display = "none";
        } else {
          audio.pause();
          audioBtn.classList.remove("playing");
          if (icoPlay) icoPlay.style.display = "none";
          if (icoPause) icoPause.style.display = "block";
        }
      } catch (_) {
        /* autoplay blocked - ignore */
      }
    });
  }
})();

/* ═ ROYALE UPGRADE interactions — 3D tilt on celebration cards +
   gold burst the instant the date reveals. Runs after React mounts. ═ */
(() => {
  "use strict";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const app = document.getElementById("app");
  if (!app) return;

  /* 3D tilt (fine pointers only) */
  if (!reduced && window.matchMedia("(pointer: fine)").matches) {
    let cur = null;
    const onMove = (e) => {
      const card = e.target.closest ? e.target.closest(".events-card") : null;
      if (cur && card !== cur) {
        cur.style.transform = "";
        cur.classList.remove("tilting");
        cur = null;
      }
      if (!card || !app.contains(card)) return;
      cur = card;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.classList.add("tilting");
      card.style.transform = `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg) translateY(-6px)`;
      card.style.setProperty("--mx", `${((px + 0.5) * 100).toFixed(1)}%`);
      card.style.setProperty("--my", `${((py + 0.5) * 100).toFixed(1)}%`);
    };
    const onLeave = () => {
      if (cur) {
        cur.style.transform = "";
        cur.classList.remove("tilting");
        cur = null;
      }
    };
    app.addEventListener("mousemove", onMove, { passive: true });
    app.addEventListener("mouseleave", onLeave);
    document.addEventListener("scroll", onLeave, { passive: true });
  }

  /* Gold burst when the split hearts merge into the date */
  const golds = ["#f0dfa8", "#ffe08a", "#d4a84e", "#fff8f0", "#c1175a"];
  function burst(x, y, n = 26) {
    if (reduced) return;
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = "spark";
      const ang = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * 130;
      s.style.setProperty("--tx", `${Math.cos(ang) * dist}px`);
      s.style.setProperty("--ty", `${Math.sin(ang) * dist - 30}px`);
      s.style.setProperty("--dur", `${(0.8 + Math.random() * 0.8).toFixed(2)}s`);
      s.style.width = s.style.height = `${3 + Math.random() * 4}px`;
      s.style.background = golds[i % golds.length];
      s.style.left = `${x}px`;
      s.style.top = `${y}px`;
      s.style.position = "fixed";
      s.style.zIndex = "2147483002";
      s.style.borderRadius = "50%";
      s.style.pointerEvents = "none";
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1900);
    }
  }
  let celebrated = false;
  const watch = new MutationObserver(() => {
    const sec = app.querySelector(".date-reveal-section.dr-date-on");
    if (sec && !celebrated) {
      celebrated = true;
      const panel = sec.querySelector(".dr-date-inner") || sec;
      const r = panel.getBoundingClientRect();
      setTimeout(() => burst(r.left + r.width / 2, r.top + r.height / 2), 650);
      setTimeout(() => burst(r.left + r.width / 2, r.top + r.height / 2, 18), 1100);
    } else if (!sec) {
      celebrated = false; // re-arm if user replays the reveal
    }
  });
  watch.observe(app, { attributes: true, subtree: true, attributeFilter: ["class"] });
  setTimeout(() => watch.disconnect(), 120000);
})();

/* ═══════════════════════════════════════════════════════════════════════════
   ROYALE · MOTION LAYER 2 — depth, arrival beats, page chrome
   Purely additive. It never touches demo-8's own reveal observers or its
   `is-offscreen` energy saving, and every part stands down under
   prefers-reduced-motion.
   ═══════════════════════════════════════════════════════════════════════════ */
(() => {
  "use strict";
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ── A + E share ONE rAF/scroll pump (two listeners would each force layout) */

  /* ── A · DEPTH ───────────────────────────────────────────────────────────
     Every ambient layer in the site breathes in place — only the hero's petals
     ever tracked the scroll. Hand the star fields the same job and the sections
     start sliding past a fixed sky; that offset is where depth comes from.
     Layers whose section is off-screen are skipped outright, so demo-8's
     is-offscreen pausing still keeps its promise.
     The hero photo takes the classic slow-follow, clamped to 56px because the
     layer is only scaled 1.22 (≈73px of slack on a 100svh hero) — no edge can
     be exposed.                                                             */
  const hero = $("#hero");
  const heroImg = $("#hero .hero-bg img");
  let stars = []; // filled once React has mounted — see wire() at the foot

  const depth = () => {
    const vh = innerHeight;
    if (heroImg) {
      const span = hero ? hero.offsetHeight : vh;
      const p = clamp(Math.min(scrollY, span) * 0.14, 0, 56);
      heroImg.style.transform = `translate3d(0,${p.toFixed(1)}px,0) scale(1.22)`;
    }
    for (const el of stars) {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -60 || r.top > vh + 60) continue; // not on screen: leave it
      const rel = (r.top + r.height / 2 - vh / 2) / vh; // ≈ −1 … 1
      el.style.transform = `translate3d(0,${(rel * 52).toFixed(1)}px,0)`;
    }
  };

  /* ── E · PAGE CHROME ─────────────────────────────────────────────────────
     A gold hair-line of progress plus nine section dots — both injected here
     (no markup to pollute) and both parked BELOW the gate's 2147483000, so the
     envelope always wins; they only fade in once the seal has been broken.  */
  const SECTIONS = [
    ["#hero", "Top"],
    [".invitation-details", "Invitation"],
    [".events-section", "Celebrations"],
    [".date-reveal-section", "The date"],
    [".venue-section", "Venue"],
    [".story-section", "Our story"],
    [".couple-msg-section", "Message"],
    [".photo-carousel-section", "Photos"],
    [".closing-section", "Countdown"],
  ];

  const bar = document.createElement("div");
  bar.className = "rg-progress";
  bar.innerHTML = "<i></i>";
  const barFill = bar.firstElementChild;

  const nav = document.createElement("nav");
  nav.className = "rg-nav";
  nav.setAttribute("aria-label", "Jump to a section");

  let items = [];
  const buildNav = () => {
    nav.textContent = "";
    items = [];
    for (const [sel, label] of SECTIONS) {
      const el = $(sel);
      if (!el) continue;
      const b = document.createElement("button");
      b.type = "button";
      b.title = label;
      b.setAttribute("aria-label", "Go to " + label);
      b.addEventListener("click", () =>
        el.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" })
      );
      nav.appendChild(b);
      items.push({ el, b });
    }
  };
  buildNav();
  document.body.append(bar, nav);

  const chrome = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? clamp(scrollY / max, 0, 1) : 0;
    barFill.style.transform = `scaleX(${p.toFixed(4)})`;

    const mid = scrollY + innerHeight * 0.42;
    let active = -1;
    items.forEach((it, i) => {
      if (it.el.getBoundingClientRect().top + scrollY <= mid) active = i;
    });
    items.forEach((it, i) => it.b.classList.toggle("on", i === active));

    const gate = $("#env-outer");
    const open =
      window.__introDone === true ||
      (gate && gate.classList.contains("hidden"));
    bar.classList.toggle("on", !!open);
    nav.classList.toggle("on", !!open && items.length > 1);
  };

  let raf = 0;
  let lastRun = 0;
  const frame = () => {
    raf = 0;
    lastRun = performance.now();
    if (!REDUCED) depth();
    chrome();
  };
  /* Run at most once per frame — but do NOT depend on rAF to get there. A tab
     whose visibilityState is "hidden" (occluded, split-screen, this harness)
     stops producing frames entirely, which would freeze the progress line and
     the parallax. So the leading edge runs synchronously on the scroll event,
     and only sub-frame bursts get coalesced into a rAF trailing edge.      */
  const queue = () => {
    const now = performance.now();
    if (now - lastRun >= 16) {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      frame();
      return;
    }
    if (!raf) raf = requestAnimationFrame(frame);
  };
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);

  // the gate flips `.hidden` without a scroll event — watch for it so the
  // chrome appears the moment the letter is opened rather than on first scroll
  const gate = $("#env-outer");
  if (gate) {
    new MutationObserver(queue).observe(gate, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }
  queue();

  /* ── MOUNT GATE ────────────────────────────────────────────────────────
     hero.js runs before React fills #app (demo-8's own swapOriginalHero
     retries for exactly this reason): at first paint only #hero and #env-outer
     exist, which is why the first pass found a single nav dot, no star layers,
     no cards and no countdown. Poll until the SPA's sections are actually there,
     then wire everything that walks them.                                    */
  let tries = 0;
  const wire = () => {
    if (!$(".rl-sec") && tries++ < 80) {
      setTimeout(wire, 120);
      return;
    }
    stars = $$(".rl-sec .rl-stars");
    buildNav();

    /* ── B · ARRIVAL BEATS ───────────────────────────────────────────────
       The event cards' gold sheen otherwise only ever runs off-screen.      */
    const cards = $$(".events-card");
    if (cards.length && !REDUCED) {
      const sweep = new IntersectionObserver((es) => {
        for (const e of es) {
          if (!e.isIntersecting) continue;
          sweep.unobserve(e.target);
          e.target.classList.add("lit"); // renames the animation → it runs NOW
        }
      }, { threshold: 0.45 });
      cards.forEach((c) => sweep.observe(c));
    }

    /* story milestones answer the eye once as each arrives. `.rg-arrive` outranks
       `.story-node-pulse`, so the class must be withdrawn afterwards — otherwise
       the idle pulse would be outranked forever and simply stop.           */
    const nodes = $$(".story-node");
    if (nodes.length && !REDUCED) {
      const flare = new IntersectionObserver((es) => {
        for (const e of es) {
          if (!e.isIntersecting) continue;
          flare.unobserve(e.target);
          const n = e.target;
          n.classList.add("rg-arrive");
          setTimeout(() => n.classList.remove("rg-arrive"), 1150);
        }
      }, { threshold: 0.9 });
      nodes.forEach((n) => flare.observe(n));
    }

    /* ── C · COUNTDOWN TICK ──────────────────────────────────────────────
       demo-8 gives `.countdown-number` a `num-flip` that plays once on mount and
       then never again (React updates the text in place, it does not remount the
       node), so the digits snap. Taking the animation over permanently with
       `.rg-tick` also stops `num-flip` coming back for a double-flip when the
       class is first added. Restart = park on `none`, reflow, release.    */
    const grid = $(".countdown-grid");
    const nums = $$(".countdown-number");
    if (grid && nums.length && !REDUCED) {
      const last = new Map(nums.map((n) => [n, n.textContent]));
      const restart = (el) => {
        if (!el.classList.contains("rg-tick")) {
          el.classList.add("rg-tick"); // num-flip → rg-roll: starts on its own
          return;
        }
        el.style.animation = "none";
        void el.offsetWidth; // commit the reset
        el.style.animation = ""; // back to the sheet → restarts
      };
      new MutationObserver(() => {
        for (const n of nums) {
          const t = n.textContent;
          if (last.get(n) !== t) {
            last.set(n, t);
            restart(n);
          }
        }
      }).observe(grid, { subtree: true, childList: true, characterData: true });
    }

    queue(); // pick up the nav dots and star layers now that they exist
  };
  wire();
})();
