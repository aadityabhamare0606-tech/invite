(() => {
  const storyRopePath =
    "M 100 0 L 100 302 C 84 285, 64 276, 48 284 C 26 295, 30 322, 45 340 C 59 358, 83 376, 100 390 C 117 376, 141 358, 155 340 C 170 322, 174 295, 152 284 C 136 276, 116 285, 100 302 L 100 380 L 100 1000";
  const storyHeartPath =
    "M 100 302 C 84 285, 64 276, 48 284 C 26 295, 30 322, 45 340 C 59 358, 83 376, 100 390 C 117 376, 141 358, 155 340 C 170 322, 174 295, 152 284 C 136 276, 116 285, 100 302 Z";
  const dateScratchHeartPath = new Path2D(
    "M50 91 C42 83 4 57 4 31 C4 14 16 4 31 4 C41 4 47 10 50 20 C53 10 59 4 69 4 C84 4 96 14 96 31 C96 57 58 83 50 91 Z"
  );
  const activeSections = new Set();
  const observedDateSections = new WeakSet();
  const observedSections = new WeakSet();
  const observedMobileMotion = new WeakSet();
  const observedPhotoSections = new WeakSet();
  const observedAnimationTargets = new WeakSet();
  const mobileViewport = window.matchMedia("(max-width: 640px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!reducedMotion.matches) {
    let scrollIdleTimer = 0;
    window.addEventListener(
      "scroll",
      () => {
        document.documentElement.classList.add("lantern-scrolling");
        window.clearTimeout(scrollIdleTimer);
        scrollIdleTimer = window.setTimeout(() => {
          document.documentElement.classList.remove("lantern-scrolling");
          scrollIdleTimer = 0;
        }, 180);
      },
      { passive: true }
    );
  }

  const sectionAnimationObserver =
    !reducedMotion.matches && "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) {
                entry.target.removeAttribute("data-lantern-motion-active");
                return;
              }
              entry.target.setAttribute("data-lantern-motion", "ready");
              entry.target.setAttribute("data-lantern-motion-active", "true");
            });
          },
          { threshold: 0.01, rootMargin: "0px" }
        )
      : null;
  const mobileMotionObserver =
    mobileViewport.matches &&
    !reducedMotion.matches &&
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("lantern-mobile-motion-in");
              observer.unobserve(entry.target);
            });
          },
          { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
        )
      : null;
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeSections.add(entry.target);
        else activeSections.delete(entry.target);
      });

      document.body.classList.toggle(
        "lantern-focus-section",
        activeSections.size > 0
      );
    },
    { threshold: 0.15 }
  );

  const launchDateFireworks = (section) => {
    if (reducedMotion.matches) return;

    const canvas = document.createElement("canvas");
    canvas.className = "dr-fireworks-canvas";
    canvas.setAttribute("aria-hidden", "true");
    section.append(canvas);

    const context = canvas.getContext("2d");
    if (!context) {
      canvas.remove();
      throw new Error("Unable to initialize the wedding date fireworks.");
    }

    const bounds = section.getBoundingClientRect();
    const width = bounds.width;
    const height = bounds.height;
    const scale = Math.min(
      window.devicePixelRatio || 1,
      1.2,
      Math.sqrt(700_000 / Math.max(width * height, 1))
    );
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.scale(scale, scale);

    const colors = ["#f1cf7c", "#fff9e8", "#df9b9b", "#fff1bd"];
    const launchPlans = [
      { x: 0.16, targetX: 0.2, targetY: 0.32, delay: 0 },
      { x: 0.39, targetX: 0.36, targetY: 0.2, delay: 260 },
      { x: 0.64, targetX: 0.67, targetY: 0.28, delay: 540 },
      { x: 0.86, targetX: 0.81, targetY: 0.39, delay: 830 },
    ];
    const startTime = performance.now();
    const rockets = launchPlans.map((plan, index) => ({
      ...plan,
      x: plan.x * width,
      startX: plan.x * width,
      targetX: plan.targetX * width,
      y: height * 1.04,
      targetY: plan.targetY * height,
      launchTime: startTime + plan.delay,
      flightDuration: 840 + (index % 2) * 170,
      trail: [],
      launched: false,
    }));
    const particles = [];
    const flashes = [];
    const crackles = [];
    const patakhaFountains = [0.24, 0.5, 0.76].map((position, index) => ({
      x: width * position,
      y: height * 0.79,
      nextAt: startTime + 80 + index * 170,
      endAt: startTime + 2050 + index * 190,
      colorOffset: index,
    }));
    let frameId = 0;
    let lastFrame = startTime;

    const burst = (x, y, colorOffset, crackle = false) => {
      const count = crackle ? 10 : 42;
      for (let index = 0; index < count; index += 1) {
        const angle = (Math.PI * 2 * index) / count + (Math.random() - 0.5) * 0.08;
        const speed = crackle
          ? 24 + Math.random() * 62
          : 62 + Math.random() ** 0.68 * 175;
        const colorIndex = (index + colorOffset) % colors.length;
        const color = colors[colorIndex];
        particles.push({
          x,
          y,
          previousX: x,
          previousY: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: crackle ? 105 + Math.random() * 65 : 68 + Math.random() * 48,
          drag: crackle ? 0.972 + Math.random() * 0.018 : 0.982 + Math.random() * 0.012,
          life: crackle ? 0.42 + Math.random() * 0.38 : 1.25 + Math.random() * 1.1,
          age: 0,
          radius: crackle ? 0.6 + Math.random() * 0.8 : 0.8 + Math.random() * 1.35,
          color,
          colorIndex,
          twinkle: Math.random() > 0.55,
        });
      }
      if (!crackle) flashes.push({ x, y, age: 0, life: 0.18 });
    };

    const draw = (now) => {
      if (now - lastFrame < 1000 / 30) {
        frameId = window.requestAnimationFrame(draw);
        return;
      }
      const delta = Math.min((now - lastFrame) / 1000, 0.04);
      lastFrame = now;
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      rockets.forEach((rocket, index) => {
        if (now < rocket.launchTime) return;
        const progress = Math.min((now - rocket.launchTime) / rocket.flightDuration, 1);
        const eased = 1 - (1 - progress) ** 1.55;
        rocket.x =
          rocket.startX +
          (rocket.targetX - rocket.startX) * eased -
          Math.sin(progress * Math.PI) * width * 0.025;
        rocket.y = height * 1.04 + (rocket.targetY - height * 1.04) * eased;
        rocket.trail.push({ x: rocket.x, y: rocket.y });
        if (rocket.trail.length > 12) rocket.trail.shift();

        if (progress < 1) {
          const trail = rocket.trail;
          if (trail.length > 1) {
            context.beginPath();
            context.moveTo(trail[0].x, trail[0].y);
            for (let point = 1; point < trail.length; point += 1) {
              context.lineTo(trail[point].x, trail[point].y);
            }
            context.strokeStyle = "rgba(255,220,145,0.68)";
            context.lineWidth = 2;
            context.lineCap = "round";
            context.lineJoin = "round";
            context.shadowColor = "#ffe6aa";
            context.shadowBlur = 4;
            context.stroke();
          }

          context.shadowBlur = 6;
          const head = context.createRadialGradient(
            rocket.x,
            rocket.y,
            0,
            rocket.x,
            rocket.y,
            8
          );
          head.addColorStop(0, "rgba(255,255,244,1)");
          head.addColorStop(0.28, "rgba(255,225,155,0.94)");
          head.addColorStop(1, "rgba(255,190,90,0)");
          context.fillStyle = head;
          context.beginPath();
          context.arc(rocket.x, rocket.y, 8, 0, Math.PI * 2);
          context.fill();
        } else if (!rocket.launched) {
          rocket.launched = true;
          burst(rocket.targetX, rocket.targetY, index);
          crackles.push(
            {
              x: rocket.targetX,
              y: rocket.targetY,
              at: now + 240,
              colorOffset: index + 1,
              fired: false,
            },
            {
              x: rocket.targetX + (index % 2 === 0 ? 13 : -13),
              y: rocket.targetY + 9,
              at: now + 470,
              colorOffset: index + 2,
              fired: false,
            }
          );
        }
      });

      context.shadowBlur = 0;
      for (let index = crackles.length - 1; index >= 0; index -= 1) {
        const crackle = crackles[index];
        if (now < crackle.at) continue;
        burst(crackle.x, crackle.y, crackle.colorOffset, true);
        crackles.splice(index, 1);
      }

      for (let index = flashes.length - 1; index >= 0; index -= 1) {
        const flash = flashes[index];
        flash.age += delta;
        if (flash.age >= flash.life) {
          flashes.splice(index, 1);
          continue;
        }
        const progress = flash.age / flash.life;
        const radius = 54 * (0.25 + progress);
        const glow = context.createRadialGradient(
          flash.x,
          flash.y,
          0,
          flash.x,
          flash.y,
          radius
        );
        glow.addColorStop(0, `rgba(255,250,230,${(1 - progress) * 0.95})`);
        glow.addColorStop(0.2, `rgba(255,224,153,${(1 - progress) * 0.6})`);
        glow.addColorStop(1, "rgba(255,224,153,0)");
        context.fillStyle = glow;
        context.beginPath();
        context.arc(flash.x, flash.y, radius, 0, Math.PI * 2);
        context.fill();
      }

      const particlePaths = colors.map(() =>
        Array.from({ length: 4 }, () => ({
          trail: new Path2D(),
          glints: new Path2D(),
          count: 0,
        }))
      );
      let activeParticles = 0;
      let retainedParticles = 0;
      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        particle.age += delta;
        if (particle.age >= particle.life) continue;
        if (retainedParticles !== index) particles[retainedParticles] = particle;
        retainedParticles += 1;

        particle.previousX = particle.x;
        particle.previousY = particle.y;
        particle.vx *= particle.drag;
        particle.vy = particle.vy * particle.drag + particle.gravity * delta;
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;

        const remaining = 1 - particle.age / particle.life;
        const twinkle = particle.twinkle
          ? 0.56 + Math.abs(Math.sin(now / 68 + index)) * 0.44
          : 1;
        const alphaBand = Math.min(3, Math.floor(remaining * twinkle * 4));
        const paths = particlePaths[particle.colorIndex][alphaBand];
        paths.trail.moveTo(particle.previousX, particle.previousY);
        paths.trail.lineTo(particle.x, particle.y);
        paths.glints.moveTo(particle.x + particle.radius * 0.58, particle.y);
        paths.glints.arc(
          particle.x,
          particle.y,
          particle.radius * 0.58,
          0,
          Math.PI * 2
        );
        paths.count += 1;
        activeParticles += 1;
      }
      particles.length = retainedParticles;

      patakhaFountains.forEach((fountain) => {
        if (now < fountain.nextAt || now > fountain.endAt) return;
        fountain.nextAt += 85;
        for (let spark = 0; spark < 7 && particles.length < 480; spark += 1) {
          const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.05;
          const speed = 170 + Math.random() * 115;
          const colorIndex =
            (fountain.colorOffset + Math.floor(Math.random() * 2)) % colors.length;
          particles.push({
            x: fountain.x,
            y: fountain.y,
            previousX: fountain.x,
            previousY: fountain.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            gravity: 185 + Math.random() * 90,
            drag: 0.984 + Math.random() * 0.012,
            life: 0.9 + Math.random() * 0.55,
            age: 0,
            radius: 1.45 + Math.random() * 1.35,
            color: colors[colorIndex],
            colorIndex,
            twinkle: true,
          });
        }
      });

      context.shadowBlur = 0;
      particlePaths.forEach((bands, colorIndex) => {
        bands.forEach((paths, alphaBand) => {
          if (!paths.count) return;
          context.globalAlpha = (alphaBand + 1) / 4;
          context.strokeStyle = colors[colorIndex];
          context.lineWidth = 1.7;
          context.stroke(paths.trail);
          context.fillStyle = colors[colorIndex];
          context.fill(paths.glints);
        });
      });
      context.globalAlpha = 1;
      context.shadowBlur = 0;
      const allRocketsLaunched = rockets.every((rocket) => rocket.launched);
      if (
        allRocketsLaunched &&
        patakhaFountains.every((fountain) => now > fountain.endAt) &&
        crackles.length === 0 &&
        activeParticles === 0 &&
        flashes.length === 0
      ) {
        canvas.remove();
        return;
      }
      frameId = window.requestAnimationFrame(draw);
    };

    frameId = window.requestAnimationFrame(draw);
    window.setTimeout(() => {
      window.cancelAnimationFrame(frameId);
      canvas.remove();
    }, 5600);
  };

  const prepareDateScratch = (section) => {
    const row = section.querySelector(".dr-cards-row");
    const panels = [...(row?.querySelectorAll(".dr-panel-outer") ?? [])];
    const dateCard = panels[0]?.querySelector(".dr-card-inner");
    const dateValue = dateCard?.querySelector(".dr-value");
    if (!row || !dateCard || !dateValue || dateCard.dataset.scratchReady === "true") {
      return;
    }

    const monthPanel = panels[1];
    const weekdayPanel = panels[2];
    const month = monthPanel?.querySelector(".dr-value")?.textContent?.trim();
    const year = monthPanel?.querySelector(".dr-sub")?.textContent?.trim();
    const weekday = weekdayPanel?.querySelector(".dr-value")?.textContent?.trim();
    const day = dateValue.textContent.trim();
    dateValue.textContent = [day, month, year].filter(Boolean).join(" ");

    const dateBody = dateCard.querySelector(".dr-card-body");
    if (dateBody && weekday) {
      const subtitle = document.createElement("p");
      subtitle.className = "dr-sub dr-date-weekday";
      subtitle.textContent = weekday;
      dateBody.append(subtitle);
    }
    if (dateBody) {
      const flourish = document.createElement("span");
      flourish.className = "dr-date-flourish";
      flourish.setAttribute("aria-hidden", "true");
      flourish.textContent = "✦";
      dateBody.insertBefore(flourish, dateBody.querySelector(".dr-date-weekday"));
    }
    dateBody?.setAttribute("aria-hidden", "true");

    panels.slice(1).forEach((panel) => panel.remove());
    dateCard.dataset.scratchReady = "true";

    const sparkleLayer = document.createElement("div");
    sparkleLayer.className = "dr-date-sparkles";
    sparkleLayer.setAttribute("aria-hidden", "true");
    for (let index = 0; index < 5; index += 1) {
      const sparkle = document.createElement("span");
      sparkle.className = "dr-date-sparkle";
      sparkle.dataset.sparkleIndex = String(index + 1);
      sparkle.textContent = index === 1 || index === 4 ? "✦" : "✧";
      sparkleLayer.append(sparkle);
    }
    dateCard.append(sparkleLayer);

    const cover = document.createElement("canvas");
    cover.className = "dr-scratch-cover";
    cover.setAttribute("role", "button");
    cover.setAttribute("aria-label", "Scratch the card to reveal the wedding date");
    cover.setAttribute("tabindex", "0");
    cover.dataset.lanternScratchCover = "true";
    dateCard.append(cover);

    const context = cover.getContext("2d", { willReadFrequently: true });
    if (!context) {
      throw new Error("Unable to initialize the wedding date scratch card.");
    }

    let drawing = false;
    let lastCoverageCheck = 0;
    let revealed = false;

    const paintCover = () => {
      const bounds = dateCard.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      cover.width = Math.round(bounds.width * scale);
      cover.height = Math.round(bounds.height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      context.globalCompositeOperation = "source-over";

      const foil = context.createLinearGradient(0, 0, bounds.width, bounds.height);
      foil.addColorStop(0, "#f7e9c7");
      foil.addColorStop(0.34, "#d8b66d");
      foil.addColorStop(0.52, "#fff3d4");
      foil.addColorStop(0.76, "#c69a4d");
      foil.addColorStop(1, "#f4e3bd");
      context.fillStyle = foil;
      context.fillRect(0, 0, bounds.width, bounds.height);

      const glow = context.createRadialGradient(
        bounds.width * 0.5,
        bounds.height * 0.3,
        0,
        bounds.width * 0.5,
        bounds.height * 0.3,
        bounds.width * 0.62
      );
      glow.addColorStop(0, "rgba(255,255,255,0.44)");
      glow.addColorStop(1, "rgba(116,76,25,0.12)");
      context.fillStyle = glow;
      context.fillRect(0, 0, bounds.width, bounds.height);

      const inset = Math.min(20, bounds.width * 0.055);
      context.strokeStyle = "rgba(112,77,31,0.5)";
      context.lineWidth = 1;
      context.strokeRect(inset, inset, bounds.width - inset * 2, bounds.height - inset * 2);
      context.strokeStyle = "rgba(255,250,231,0.78)";
      context.strokeRect(inset + 4, inset + 4, bounds.width - (inset + 4) * 2, bounds.height - (inset + 4) * 2);

      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = "#234351";
      context.font = `600 ${Math.max(12, Math.min(15, bounds.width * 0.035))}px Manrope, sans-serif`;
      context.letterSpacing = "3px";
      context.fillText("A DATE TO REMEMBER", bounds.width / 2, bounds.height * 0.43);
      context.fillStyle = "#8b6330";
      context.font = `500 ${Math.max(11, Math.min(13, bounds.width * 0.03))}px Manrope, sans-serif`;
      context.letterSpacing = "2px";
      context.fillText("SCRATCH TO REVEAL", bounds.width / 2, bounds.height * 0.55);
      context.font = `${Math.max(16, Math.min(20, bounds.width * 0.045))}px serif`;
      context.fillText("✦", bounds.width / 2, bounds.height * 0.65);
      context.letterSpacing = "0px";
    };

    const celebrateReveal = () => {
      if (revealed) return;
      revealed = true;
      drawing = false;
      cover.classList.add("dr-scratch-clearing");
      dateCard.classList.add("dr-date-revealed", "dr-card-revealed");
      dateCard.setAttribute("data-scratch-state", "revealed");
      dateBody?.removeAttribute("aria-hidden");
      cover.setAttribute("aria-hidden", "true");
      cover.removeAttribute("role");
      cover.removeAttribute("tabindex");
      launchDateFireworks(section);
    };

    const getPoint = (event) => {
      const bounds = cover.getBoundingClientRect();
      return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    };

    const eraseAt = (point) => {
      context.globalCompositeOperation = "destination-out";
      context.beginPath();
      context.arc(point.x, point.y, Math.max(19, cover.clientWidth * 0.055), 0, Math.PI * 2);
      context.fill();
    };

    const checkCoverage = (force = false) => {
      const now = performance.now();
      if (!force && now - lastCoverageCheck < 90) return;
      lastCoverageCheck = now;
      const pixels = context.getImageData(0, 0, cover.width, cover.height).data;
      let total = 0;
      let cleared = 0;
      for (let y = 0; y < cover.height; y += 8) {
        for (let x = 0; x < cover.width; x += 8) {
          if (
            !context.isPointInPath(
              dateScratchHeartPath,
              (x / cover.width) * 100,
              (y / cover.height) * 94
            )
          ) {
            continue;
          }
          total += 1;
          if (pixels[(y * cover.width + x) * 4 + 3] < 24) cleared += 1;
        }
      }
      if (total && cleared / total >= 0.2) celebrateReveal();
    };

    cover.addEventListener("pointerdown", (event) => {
      if (revealed) return;
      event.preventDefault();
      drawing = true;
      cover.setPointerCapture(event.pointerId);
      const point = getPoint(event);
      eraseAt(point);
      checkCoverage();
    });

    cover.addEventListener("pointermove", (event) => {
      if (!drawing || revealed) return;
      event.preventDefault();
      const point = getPoint(event);
      eraseAt(point);
      checkCoverage();
    });

    const stopScratching = () => {
      if (!drawing) return;
      drawing = false;
      checkCoverage(true);
    };
    cover.addEventListener("pointerup", stopScratching);
    cover.addEventListener("pointercancel", stopScratching);
    cover.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      celebrateReveal();
    });

    const resizeObserver = new ResizeObserver(() => {
      if (!revealed) paintCover();
    });
    resizeObserver.observe(dateCard);
    paintCover();
  };

  const observeDateReveal = () => {
    document.querySelectorAll(".dr-section").forEach((section) => {
      if (observedDateSections.has(section)) return;
      observedDateSections.add(section);
      prepareDateScratch(section);
    });
  };

  const refineHeroCopy = () => {
    document.querySelectorAll("p").forEach((paragraph) => {
      if (paragraph.textContent.trim() === "MEET THE") paragraph.remove();
    });

    document.querySelectorAll(".gate-kicker").forEach((kicker) => kicker.remove());

    document.querySelectorAll(".hero-crest").forEach((crest) => crest.remove());

    document
      .querySelectorAll(".hero-details-entrance p")
      .forEach((paragraph) => {
        if (paragraph.textContent.trim() !== "With the heavenly blessings of") {
          return;
        }
        paragraph.parentElement?.remove();
      });
  };

  const refineHeroSeal = () => {
    const seal = document.querySelector(".hero-seal");
    if (!seal || seal.dataset.lanternHeartReady === "true") return;

    seal.dataset.lanternHeartReady = "true";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "lantern-hero-seal-outline");
    svg.setAttribute("viewBox", "0 0 64 64");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    const pathData =
      "M32 57 C25 51 6 37 6 22 C6 13 12 7 21 7 C26 7 30 10 32 15 C34 10 38 7 43 7 C52 7 58 13 58 22 C58 37 39 51 32 57 Z";
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const gradient = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "radialGradient"
    );
    gradient.setAttribute("id", "lanternHeroSealFill");
    gradient.setAttribute("cx", "50%");
    gradient.setAttribute("cy", "34%");
    gradient.setAttribute("r", "76%");
    [
      ["0%", "#fff1c8", "0.38"],
      ["68%", "#f1d493", "0.2"],
      ["100%", "#d6ae5e", "0.1"],
    ].forEach(([offset, color, opacity]) => {
      const stop = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "stop"
      );
      stop.setAttribute("offset", offset);
      stop.setAttribute("stop-color", color);
      stop.setAttribute("stop-opacity", opacity);
      gradient.append(stop);
    });
    defs.append(gradient);

    const fill = document.createElementNS("http://www.w3.org/2000/svg", "path");
    fill.setAttribute("class", "lantern-hero-seal-fill");
    fill.setAttribute("d", pathData);
    fill.setAttribute("fill", "url(#lanternHeroSealFill)");

    const outline = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    outline.setAttribute("d", pathData);
    outline.setAttribute("pathLength", "1");
    svg.append(defs, fill, outline);
    seal.prepend(svg);
  };

  const refineStoryHeart = () => {
    document.querySelectorAll(".os-rope-svg").forEach((svg) => {
      svg.classList.add("os-heart-shape-refined");

      svg.querySelectorAll(":scope > path").forEach((path) => {
        const pathData = path.getAttribute("d") ?? "";
        const isHeartShape = pathData.includes("M 100 175");

        if (
          path.classList.contains("os-heart-fill-in") ||
          (isHeartShape && path.getAttribute("stroke") === "none")
        ) {
          path.classList.add("os-heart-fill-in");
          path.setAttribute("d", storyHeartPath);
          return;
        }

        if (path.classList.contains("os-heart-outline-in") || isHeartShape) {
          path.classList.add("os-heart-outline-in");
          path.setAttribute("d", storyHeartPath);
          path.setAttribute("pathLength", "1");
          return;
        }

        if (pathData.includes("M 100 0")) {
          path.setAttribute("d", storyRopePath);
          path.setAttribute("pathLength", "1");
        }
      });

      svg
        .querySelectorAll(".os-halo-ring, .os-knot")
        .forEach((marker) => marker.remove());
    });
  };

  const observeMobileMotion = () => {
    if (!mobileMotionObserver) return;

    const groups = [
      [".venue-surface-final > .relative.z-10", 0],
      ["section.bg-black > .absolute.bottom-0.left-0.right-0.z-10", 0],
      [".closing-headline", 0],
      [".countdown-unit", 80],
    ];

    groups.forEach(([selector, stagger]) => {
      document.querySelectorAll(selector).forEach((element, index) => {
        if (!observedMobileMotion.has(element)) {
          observedMobileMotion.add(element);
          element.style.setProperty(
            "--lantern-mobile-delay",
            `${Math.min(index * stagger, 255)}ms`
          );
          mobileMotionObserver.observe(element);
        }
      });
    });

  };

  const observeSectionAnimations = () => {
    if (!sectionAnimationObserver) return;

    [
      [".events-section .celebration-card", 150],
      [".os-section .os-card-unit", 130],
    ].forEach(([selector, delay]) => {
      document.querySelectorAll(selector).forEach((element, index) => {
        element.style.setProperty(
          "--lantern-section-delay",
          `${Math.min(index * delay, 300)}ms`
        );
      });
    });

    const selectors = [
      ".invite-gate",
      ".dr-section",
      ".reveal-on-scroll:not(.dr-section)",
      ".events-section",
      ".venue-surface-final",
      ".os-section",
      ".hero-details-entrance",
      ".hero-name-entrance",
      ".hero-kenburns",
      ".events-section h2",
      ".events-section .celebration-card",
      ".venue-surface-final > .relative.z-10",
      ".os-section .os-card-unit",
      ".os-section .os-heading",
      ".os-section .os-rope-svg",
      "section.bg-black",
      ".closing-headline",
      ".countdown-unit",
      ".golden-thread",
      ".music-toggle",
      ".back-to-top",
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        if (observedAnimationTargets.has(element)) return;
        observedAnimationTargets.add(element);
        element.setAttribute("data-lantern-motion", "pending");
        sectionAnimationObserver.observe(element);
      });
    });

    const coupleMessage = document
      .querySelector(".msg-word")
      ?.closest(".celebration-surface");
    if (
      coupleMessage &&
      !observedAnimationTargets.has(coupleMessage)
    ) {
      observedAnimationTargets.add(coupleMessage);
      coupleMessage.setAttribute("data-lantern-motion", "pending");
      sectionAnimationObserver.observe(coupleMessage);
    }

    const heroScene = document.querySelector(".hero-name-entrance")
      ?.parentElement;
    if (heroScene && !observedAnimationTargets.has(heroScene)) {
      observedAnimationTargets.add(heroScene);
      heroScene.setAttribute("data-lantern-motion", "pending");
      sectionAnimationObserver.observe(heroScene);
    }

    const countdownRow = document.querySelector(".countdown-unit")
      ?.parentElement;
    if (countdownRow && !observedAnimationTargets.has(countdownRow)) {
      observedAnimationTargets.add(countdownRow);
      countdownRow.setAttribute("data-lantern-motion", "pending");
      sectionAnimationObserver.observe(countdownRow);
    }

    const closingHeadline = document.querySelector(".closing-headline");
    const actions = closingHeadline?.parentElement?.querySelector(
      ".closing-action"
    )?.parentElement;
    if (mobileViewport.matches) actions?.remove();
  };

  const refineCelebrationPhotos = () => {
    const photos = [
      "/demos/demo-3/assets/celebration-mehendi.png",
      "/demos/demo-3/assets/celebration-haldi.png",
      "/demos/demo-3/assets/celebration-reception.png",
    ];

    document
      .querySelectorAll(".events-section .celebration-card")
      .forEach((card, index) => {
        const image = card.querySelector('img[alt$="event"]');
        const photo = photos[index];
        if (!image || !photo) return;

        if (image.getAttribute("src") !== photo) {
          image.src = photo;
          image.removeAttribute("srcset");
          image.loading = "lazy";
          image.decoding = "async";
        }

        if (card.querySelector(".lantern-event-art")) return;

        const eventName = image.alt.replace(/\s+event$/i, "");
        image.parentElement?.parentElement?.classList.add("lantern-event-source");
        const artwork = image.cloneNode(false);
        artwork.className = "lantern-event-art";
        artwork.alt = `${eventName} celebration illustration`;
        artwork.removeAttribute("sizes");
        image.alt = "";
        image.setAttribute("aria-hidden", "true");
        card.append(artwork);
      });
  };

  const addPhotoNavigation = () => {
    document.querySelectorAll("section.bg-black").forEach((section) => {
      if (observedPhotoSections.has(section)) return;

      const indicators = [...section.querySelectorAll('button[aria-label^="Photo "]')];
      if (indicators.length < 2) return;
      observedPhotoSections.add(section);

      const navigation = document.createElement("div");
      navigation.className = "lantern-photo-arrows";
      navigation.setAttribute("aria-label", "Photo navigation");

      [
        { direction: -1, label: "Previous photo", path: "m14 18-6-6 6-6" },
        { direction: 1, label: "Next photo", path: "m10 18 6-6-6-6" },
      ].forEach(({ direction, label, path }) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "lantern-photo-arrow";
        button.setAttribute("aria-label", label);

        const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        icon.setAttribute("viewBox", "0 0 24 24");
        icon.setAttribute("aria-hidden", "true");
        const chevron = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        chevron.setAttribute("d", path);
        chevron.setAttribute("fill", "none");
        chevron.setAttribute("stroke", "currentColor");
        chevron.setAttribute("stroke-width", "1.8");
        chevron.setAttribute("stroke-linecap", "round");
        chevron.setAttribute("stroke-linejoin", "round");
        icon.append(chevron);
        button.append(icon);

        button.addEventListener("click", () => {
          const currentIndicators = [
            ...section.querySelectorAll('button[aria-label^="Photo "]'),
          ];
          if (currentIndicators.length < 2) return;

          const currentIndex = currentIndicators.findIndex(
            (indicator) => Number.parseFloat(indicator.style.width) > 20
          );
          const startIndex = currentIndex < 0 ? 0 : currentIndex;
          const nextIndex =
            (startIndex + direction + currentIndicators.length) %
            currentIndicators.length;
          currentIndicators[nextIndex].click();
        });

        navigation.append(button);
      });

      section.append(navigation);
    });
  };

  const addPlaceRevealDetails = (container) => {
    if (!container.classList.contains("hearts-joined")) return false;

    const section = container.closest(".venue-surface-final");
    const panel = section?.querySelector(":scope > .relative.z-10");
    const card = section?.querySelector(".venue-reveal-card");
    if (!section || !panel || !card) return false;

    section.classList.add("lantern-place-revealed");

    if (!panel.querySelector(".lantern-floating-hearts")) {
      const hearts = document.createElement("div");
      hearts.className = "lantern-floating-hearts";
      hearts.setAttribute("aria-hidden", "true");

      for (let index = 0; index < 6; index += 1) {
        const heart = document.createElement("span");
        heart.textContent = "♡";
        heart.style.setProperty("--heart-index", String(index));
        hearts.append(heart);
      }

      panel.append(hearts);
    }

    if (card.querySelector(".venue-place-illustration")) return true;

    const svgNamespace = "http://www.w3.org/2000/svg";
    const illustration = document.createElementNS(svgNamespace, "svg");
    illustration.classList.add("venue-place-illustration");
    illustration.setAttribute("viewBox", "0 0 120 64");
    illustration.setAttribute("aria-hidden", "true");

    const shapes = [
      {
        tag: "circle",
        attributes: { cx: "91", cy: "17", r: "5", fill: "#d8bc82" },
      },
      {
        tag: "path",
        attributes: {
          d: "M12 49c14-7 25-7 39-2 12 4 22 3 35-2 8-3 15-3 22 0",
          fill: "none",
          stroke: "#9bb2a0",
          "stroke-linecap": "round",
          "stroke-width": "1.5",
        },
      },
      {
        tag: "path",
        attributes: {
          d: "M45 46V34l15-11 15 11v12M50 33h20M51 46V35h18v11M56 46v-8h8v8",
          fill: "none",
          stroke: "#47716c",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.6",
        },
      },
      {
        tag: "path",
        attributes: {
          d: "M26 48c-1-8 3-13 9-15 1 7-2 12-9 15Zm58 0c1-8-3-13-9-15-1 7 2 12 9 15Z",
          fill: "#d9e2d5",
          stroke: "#86a38e",
          "stroke-linejoin": "round",
          "stroke-width": "1.2",
        },
      },
      {
        tag: "path",
        attributes: {
          d: "M20 53h80",
          fill: "none",
          stroke: "#d8bc82",
          "stroke-linecap": "round",
          "stroke-width": "1",
        },
      },
    ];

    shapes.forEach(({ tag, attributes }) => {
      const shape = document.createElementNS(svgNamespace, tag);
      Object.entries(attributes).forEach(([name, value]) => {
        shape.setAttribute(name, value);
      });
      illustration.append(shape);
    });

    const eyebrow = card.querySelector("p");
    if (eyebrow) card.insertBefore(illustration, eyebrow);
    return true;
  };

  const configureInvitationAudio = () => {
    const audio = document.querySelector("audio");
    if (!audio || audio.dataset.lanternAudioConfigured === "true") return;

    audio.dataset.lanternAudioConfigured = "true";
    audio.src = "/demos/demo-1/11.mp3";
    audio.loop = true;
  };

  document.addEventListener(
    "click",
    (event) => {
      if (!(event.target instanceof Element)) return;

      if (event.target.closest(".gate-open-btn")) {
        const gate = event.target.closest(".invite-gate");
        window.setTimeout(
          () => gate?.classList.remove("lantern-motion-active"),
          1600
        );
        window.setTimeout(() => {
          document
            .querySelector(".invite-reveal")
            ?.setAttribute("data-lantern-motion", "ready");
        }, 0);
      }

      const button = event.target.closest(
        ".venue-surface-final .venue-hearts-container .heart-button"
      );
      const container = button?.closest(".venue-hearts-container");
      if (!container) return;

      const section = container.closest(".venue-surface-final");
      if (!section) return;

      const revealObserver = new MutationObserver(() => {
        if (addPlaceRevealDetails(container)) revealObserver.disconnect();
      });
      revealObserver.observe(section, {
        attributes: true,
        attributeFilter: ["class"],
        childList: true,
        subtree: true,
      });
      if (addPlaceRevealDetails(container)) revealObserver.disconnect();
    },
    true
  );

  const observeSections = () => {
    configureInvitationAudio();
    observeDateReveal();
    refineHeroCopy();
    refineHeroSeal();
    refineCelebrationPhotos();
    refineStoryHeart();
    observeMobileMotion();
    observeSectionAnimations();
    addPhotoNavigation();

    const photoSection = document.querySelector("section.bg-black");
    photoSection?.parentElement?.classList.add("lantern-photo-gallery");

    const observedTargets = [
      ...document.querySelectorAll(".dr-section, .venue-surface-final"),
    ];
    const closingSection = document
      .querySelector(".closing-headline")
      ?.closest(".reveal-on-scroll");
    if (closingSection) observedTargets.push(closingSection);

    observedTargets.forEach((target) => {
      if (observedSections.has(target)) return;
      observedSections.add(target);
      sectionObserver.observe(target);
    });
  };

  let observeFrame = 0;
  const observer = new MutationObserver(() => {
    if (observeFrame) return;
    observeFrame = window.requestAnimationFrame(() => {
      observeFrame = 0;
      observeSections();
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  observeSections();
})();
