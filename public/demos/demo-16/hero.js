/* Rajwada Royale: Emerald Edition (demo-16) — Rajwada intro gate + hero.
   The gate follows demo-3's pre-invitation; the hero keeps its demo-9-inspired
   choreography and the React invitation below remains untouched. */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const replaceFormerName = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.nodeValue = node.nodeValue.replace(/\bIshaan\b/g, "Anaya");
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    for (const attr of node.attributes) {
      if (/\bIshaan\b/.test(attr.value)) {
        node.setAttribute(attr.name, attr.value.replace(/\bIshaan\b/g, "Anaya"));
      }
    }
  };
  const replaceFormerNameInTree = (root) => {
    replaceFormerName(root);
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
    );
    while (walker.nextNode()) replaceFormerName(walker.currentNode);
  };
  const app = document.getElementById("app");
  if (app) {
    const replaceMountedNames = () => {
      if (!app.firstElementChild) return false;
      replaceFormerNameInTree(app);
      return true;
    };
    if (!replaceMountedNames()) {
      const nameObserver = new MutationObserver(() => {
        if (replaceMountedNames()) nameObserver.disconnect();
      });
      nameObserver.observe(app, { childList: true });
      setTimeout(() => nameObserver.disconnect(), 12000);
    }
  }

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

  /* ── Rajwada Royale pre-invitation ── */
  const envOuter = $("#env-outer");
  const hero = $("#hero");
  let introOpened = false;
  let introFinished = false;
  let heroPending = false;
  const introTimers = [];
  const previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  function afterIntro(ms, callback) {
    introTimers.push(setTimeout(callback, ms));
  }

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

  function playIntroChime() {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) return;
    try {
      const context = new AudioContextConstructor();
      const start = context.currentTime;
      [[659.25, 0], [987.77, 0.22]].forEach(([frequency, offset]) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, start + offset);
        gain.gain.exponentialRampToValueAtTime(0.18, start + offset + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + 1.4);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(start + offset);
        oscillator.stop(start + offset + 1.5);
      });
      setTimeout(() => {
        context.close().catch((error) => {
          console.error("Rajwada intro chime could not close its audio context.", error);
        });
      }, 2200);
    } catch (error) {
      console.error("Rajwada intro chime could not play.", error);
    }
  }

  function burstIntroSeal() {
    if (reduced || !envOuter) return;
    const seal = $(".rj-pre-seal", envOuter);
    if (!seal) return;
    const sealRect = seal.getBoundingClientRect();
    const gateRect = envOuter.getBoundingClientRect();
    const centerX = sealRect.left + sealRect.width / 2 - gateRect.left;
    const centerY = sealRect.top + sealRect.height / 2 - gateRect.top;
    const particles = [];

    for (let i = 0; i < 7; i++) {
      const particle = document.createElement("span");
      particle.className = "rj-pre-burst";
      const angle = (Math.PI * 2 * i) / 7 + (Math.random() - 0.5) * 0.6;
      const distance = 60 + Math.random() * 90;
      particle.style.left = `${centerX.toFixed(1)}px`;
      particle.style.top = `${centerY.toFixed(1)}px`;
      envOuter.appendChild(particle);
      particles.push({
        element: particle,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        start: performance.now() + Math.random() * 120,
      });
    }

    const duration = 900;
    function animateParticles(now) {
      let active = false;
      particles.forEach((particle) => {
        const progress = (now - particle.start) / duration;
        if (progress < 0) {
          active = true;
          return;
        }
        if (progress >= 1) {
          particle.element.remove();
          return;
        }
        active = true;
        const eased = 1 - Math.pow(1 - progress, 3);
        particle.element.style.transform =
          `translate(${(particle.dx * eased).toFixed(1)}px,${(particle.dy * eased).toFixed(1)}px) ` +
          `scale(${(0.5 + 0.7 * eased).toFixed(3)})`;
        particle.element.style.opacity =
          (progress < 0.18 ? progress / 0.18 : 1 - (progress - 0.18) / 0.82).toFixed(3);
      });
      if (active) requestAnimationFrame(animateParticles);
    }
    requestAnimationFrame(animateParticles);
  }

  function finishIntro() {
    if (!envOuter || introFinished) return;
    introFinished = true;
    envOuter.classList.add("fadeout");
    window.__introDone = true;
    if (heroPending || document.visibilityState === "hidden") replayHero();
  }

  function teardownIntro() {
    document.body.style.overflow = previousBodyOverflow;
    document.removeEventListener("keydown", onIntroDocumentKeydown);
    if (envOuter) envOuter.remove();
    window.scrollTo(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0));
    window.dispatchEvent(new Event("resize"));
  }

  function openIntro() {
    if (!envOuter || introOpened) return;
    introOpened = true;
    envOuter.classList.add("seal-pop");
    playIntroChime();
    burstIntroSeal();
    afterIntro(480, () => envOuter.classList.add("seal-gone"));
    afterIntro(520, () => envOuter.classList.add("flap-open"));
    afterIntro(1250, () => envOuter.classList.add("card-out"));
    afterIntro(6650, finishIntro);
    afterIntro(7750, teardownIntro);
  }

  function skipIntro() {
    if (!envOuter) return;
    if (!introOpened) {
      openIntro();
      return;
    }
    introTimers.forEach(clearTimeout);
    envOuter.classList.add("seal-pop", "seal-gone", "flap-open", "card-out");
    finishIntro();
    afterIntro(700, teardownIntro);
  }

  function onIntroDocumentKeydown(event) {
    if (event.key === "Escape" && envOuter && envOuter.isConnected) skipIntro();
  }

  if (envOuter) {
    const revealIntro = () => envOuter.classList.add("ready");
    requestAnimationFrame(() => requestAnimationFrame(revealIntro));
    setTimeout(revealIntro, 160);
    envOuter.addEventListener("click", () => (introOpened ? skipIntro() : openIntro()));
    envOuter.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        introOpened ? skipIntro() : openIntro();
      }
    });
    document.addEventListener("keydown", onIntroDocumentKeydown);
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
  letterize($("[data-letters='Anaya']"));

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
    const setAudioState = (playing) => {
      audioBtn.classList.toggle("playing", playing);
      audioBtn.setAttribute("aria-pressed", String(playing));
      audioBtn.setAttribute("aria-label", playing ? "Pause music" : "Play music");
      audioBtn.title = playing ? "Pause music" : "Play music";
      if (icoPlay) icoPlay.style.display = playing ? "none" : "block";
      if (icoPause) icoPause.style.display = playing ? "block" : "none";
    };
    const reportAudioFailure = () => {
      audioBtn.disabled = true;
      audioBtn.setAttribute("aria-label", "Music unavailable");
      audioBtn.title = "Music could not be loaded";
      console.error("Rajwada wedding music could not be loaded.");
    };
    audio.addEventListener("error", () => {
      reportAudioFailure();
    });
    audio.addEventListener("play", () => setAudioState(true));
    audio.addEventListener("pause", () => setAudioState(false));
    audio.addEventListener("ended", () => setAudioState(false));
    audioBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      try {
        if (audio.paused) {
          await audio.play();
        } else {
          audio.pause();
        }
      } catch (error) {
        console.error("Rajwada wedding music could not be started.", error);
        audioBtn.title = "Music could not start. Tap to try again";
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
  const app = document.getElementById("app");

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
  const isMobile = matchMedia("(max-width: 767px)");
  let stars = []; // filled once React has mounted — see wire() at the foot

  const depth = () => {
    const vh = innerHeight;
    if (heroImg) {
      const span = hero ? hero.offsetHeight : vh;
      const p = clamp(Math.min(scrollY, span) * 0.14, 0, 56);
      const scale = isMobile.matches ? 1.035 : 1.12;
      heroImg.style.transform = `translate3d(0,${p.toFixed(1)}px,0) scale(${scale})`;
    }
    for (const el of stars) {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -60 || r.top > vh + 60) continue; // not on screen: leave it
      const rel = (r.top + r.height / 2 - vh / 2) / vh; // ≈ −1 … 1
      el.style.transform = `translate3d(0,${(rel * 52).toFixed(1)}px,0)`;
    }
  };

  /* ── E · PAGE CHROME ─────────────────────────────────────────────────────
     A gold progress hairline and Lantern Dreams' scroll-drawn thread.       */
  const bar = document.createElement("div");
  bar.className = "rg-progress";
  bar.innerHTML = "<i></i>";
  const barFill = bar.firstElementChild;

  const threadPath = "M 40 6 C 8 110, 72 210, 40 310 C 8 410, 72 510, 40 610 C 8 710, 72 810, 40 994";
  const thread = document.createElement("div");
  thread.className = "rg-thread";
  thread.setAttribute("aria-hidden", "true");
  thread.innerHTML =
    '<svg viewBox="0 0 80 1000" preserveAspectRatio="none">' +
    '<defs><linearGradient id="rg-thread-gradient" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0%" stop-color="rgba(241,212,147,.5)"/>' +
    '<stop offset="42%" stop-color="#ffe9a8"/>' +
    '<stop offset="100%" stop-color="rgba(241,212,147,.5)"/>' +
    '</linearGradient></defs>' +
    `<path d="${threadPath}" class="rg-thread-track"/>` +
    `<path d="${threadPath}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" class="rg-thread-drawn"/>` +
    "</svg><span class=\"rg-thread-bead\"></span>";
  const threadSvg = thread.querySelector("svg");
  const threadLine = thread.querySelector(".rg-thread-drawn");
  const threadBead = thread.querySelector(".rg-thread-bead");
  const threadLength = threadLine.getTotalLength();
  let threadTarget = 0;
  let threadProgress = 0;
  let threadFrame = 0;

  function renderThread() {
    threadFrame = 0;
    threadProgress += (threadTarget - threadProgress) * 0.14;
    if (Math.abs(threadTarget - threadProgress) < 0.0005) threadProgress = threadTarget;
    threadLine.style.strokeDashoffset = String(1 - threadProgress);
    const point = threadLine.getPointAtLength(threadProgress * threadLength);
    const bounds = threadSvg.getBoundingClientRect();
    threadBead.style.transform =
      `translate3d(${(point.x / 80 * bounds.width).toFixed(1)}px, ` +
      `${(point.y / 1000 * bounds.height).toFixed(1)}px, 0) translate(-50%, -50%)`;
    threadBead.style.opacity = "1";
    if (!REDUCED && Math.abs(threadTarget - threadProgress) >= 0.0005) {
      threadFrame = requestAnimationFrame(renderThread);
    }
  }

  function updateThread() {
    const maxScroll = document.documentElement.scrollHeight - innerHeight;
    threadTarget = maxScroll > 0 ? clamp(scrollY / maxScroll, 0, 1) : 1;
    if (REDUCED || document.visibilityState === "hidden") {
      threadProgress = threadTarget;
      renderThread();
    } else if (!threadFrame) {
      threadFrame = requestAnimationFrame(renderThread);
    }
  }

  const retireDuplicateMusic = () => {
    for (const duplicate of $$("audio", app)) {
      const wrapper = duplicate.closest(".sticky");
      if (wrapper) wrapper.remove();
      else duplicate.remove();
    }
  };

  const addVenueDirections = () => {
    const venue = $(".venue-section", app);
    const content = venue && venue.querySelector(".relative.z-10.mx-auto");
    if (!content || content.querySelector(".rg-directions")) return;

    const directions = document.createElement("a");
    directions.className = "rg-directions";
    directions.href =
      "https://www.google.com/maps/search/?api=1&query=Rajwada+Lawns+Pune";
    directions.target = "_blank";
    directions.rel = "noopener noreferrer";
    directions.textContent = "Get directions";
    content.appendChild(directions);
  };
  document.body.append(bar, thread);

  const chrome = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? clamp(scrollY / max, 0, 1) : 0;
    barFill.style.transform = `scaleX(${p.toFixed(4)})`;

    const gate = $("#env-outer");
    const open =
      window.__introDone === true ||
      (gate && gate.classList.contains("hidden"));
    bar.classList.toggle("on", !!open);
    thread.classList.toggle("on", !!open);
    updateThread();
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
    new MutationObserver(() => {
      if (window.__introDone === true) chrome();
      else queue();
    }).observe(gate, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") chrome();
    else queue();
  });
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
    retireDuplicateMusic();
    addVenueDirections();

    const invitationCard = $(".invitation-details > .relative.flex.flex-col.items-center");
    const invitationCopy = $$(".invitation-details .invitation-step p");
    if (invitationCard && invitationCopy.length && !REDUCED) {
      let delay = 0;
      invitationCopy.forEach((paragraph) => {
        const label = paragraph.textContent.trim();
        if (!label) return;
        paragraph.setAttribute("aria-label", label);

        const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        while (walker.nextNode()) textNodes.push(walker.currentNode);
        textNodes.forEach((textNode) => {
          const fragment = document.createDocumentFragment();
          Array.from(textNode.nodeValue || "").forEach((character) => {
            const letter = document.createElement("span");
            letter.className = "royal-type-char";
            letter.setAttribute("aria-hidden", "true");
            letter.textContent = character;
            letter.style.setProperty("--type-delay", `${delay}ms`);
            fragment.appendChild(letter);
            if (!/\s/.test(character)) delay += 24;
          });
          textNode.replaceWith(fragment);
        });
        delay += 180;
      });

      const startTyping = () => invitationCard.classList.add("royal-type-on");
      if (typeof IntersectionObserver === "undefined") {
        startTyping();
      } else {
        const typingObserver = new IntersectionObserver(([entry]) => {
          if (!entry.isIntersecting) return;
          typingObserver.disconnect();
          startTyping();
        }, { threshold: 0.22 });
        typingObserver.observe(invitationCard);
      }
    }

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

    const storyCards = $$(".story-section .star-card");
    if (storyCards.length && !REDUCED) {
      const cardArrival = new IntersectionObserver((es) => {
        for (const e of es) {
          if (!e.isIntersecting) continue;
          cardArrival.unobserve(e.target);
          e.target.classList.add("royal-in");
        }
      }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
      storyCards.forEach((card) => cardArrival.observe(card));
    }

    const letterPaper = $(".couple-msg-section .letter-paper");
    if (letterPaper) {
      if (REDUCED || typeof IntersectionObserver === "undefined") {
        letterPaper.classList.add("royal-letter-in");
      } else {
        const letterArrival = new IntersectionObserver(([entry]) => {
          if (!entry.isIntersecting) return;
          letterArrival.disconnect();
          letterPaper.classList.add("royal-letter-in");
        }, { threshold: 0.22 });
        letterArrival.observe(letterPaper);
      }
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

    queue(); // pick up the star layers now that React has mounted
  };
  wire();
})();
