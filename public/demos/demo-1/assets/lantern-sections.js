(() => {
  const storyRopePath =
    "M 100 0 L 100 302 C 84 285, 64 276, 48 284 C 26 295, 30 322, 45 340 C 59 358, 83 376, 100 390 C 117 376, 141 358, 155 340 C 170 322, 174 295, 152 284 C 136 276, 116 285, 100 302 L 100 380 L 100 1000";
  const storyHeartPath =
    "M 100 302 C 84 285, 64 276, 48 284 C 26 295, 30 322, 45 340 C 59 358, 83 376, 100 390 C 117 376, 141 358, 155 340 C 170 322, 174 295, 152 284 C 136 276, 116 285, 100 302 Z";
  const activeSections = new Set();
  const observedCanvases = new WeakSet();
  const observedSections = new WeakSet();
  const observedMobileMotion = new WeakSet();
  const observedPhotoSections = new WeakSet();
  const observedMobileAnimationTargets = new WeakSet();
  const mobileViewport = window.matchMedia("(max-width: 640px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileAnimationObserver =
    document.documentElement.classList.contains(
      "lantern-mobile-scroll-animations"
    ) && "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.setAttribute("data-lantern-motion", "ready");
              observer.unobserve(entry.target);
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
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

  const observeScratchCards = () => {
    document.querySelectorAll(".dr-section .dr-foil-canvas").forEach((canvas) => {
      if (observedCanvases.has(canvas)) return;
      observedCanvases.add(canvas);

      canvas.addEventListener(
        "pointerup",
        () => {
          const context = canvas.getContext("2d");
          if (!context) return;

          const step = 10;
          const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          let transparentPixels = 0;
          let samples = 0;

          for (let y = step / 2; y < canvas.height; y += step) {
            for (let x = step / 2; x < canvas.width; x += step) {
              samples += 1;
              if (imageData.data[(y * canvas.width + x) * 4 + 3] < 40) {
                transparentPixels += 1;
              }
            }
          }

          if (samples > 0 && transparentPixels / samples >= 0.3) {
            context.clearRect(0, 0, canvas.width, canvas.height);
          }
        },
        true
      );
    });
  };

  const refineStoryHeart = () => {
    document.querySelectorAll(".os-rope-svg").forEach((svg) => {
      svg.classList.add("os-heart-shape-refined");

      svg.querySelectorAll(":scope > path").forEach((path) => {
        if (path.classList.contains("os-heart-fill-in")) {
          path.setAttribute("d", storyHeartPath);
          return;
        }

        if (path.classList.contains("os-heart-outline-in")) {
          path.setAttribute("d", storyHeartPath);
          path.setAttribute("pathLength", "1");
          return;
        }

        if (path.getAttribute("d")?.includes("M 100 0")) {
          path.setAttribute("d", storyRopePath);
        }
      });

      svg.querySelectorAll(".os-halo-ring, .os-knot").forEach((knot) => {
        const x = knot.getAttribute("cx");
        if (x !== "20" && x !== "180") return;

        knot.setAttribute("cx", x === "20" ? "45" : "155");
        knot.setAttribute("cy", "340");

        if (knot.classList.contains("os-halo-ring")) {
          knot.setAttribute("stroke", "rgba(179,147,95,0.42)");
          knot.setAttribute("r", "8");
        } else {
          knot.setAttribute("fill", "rgba(179,147,95,0.96)");
          knot.setAttribute("stroke", "rgba(255,253,248,0.9)");
        }
      });
    });
  };

  const observeMobileMotion = () => {
    if (!mobileMotionObserver) return;

    const groups = [
      [".dr-section .dr-panel-outer", 85],
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

  const observeMobileAnimations = () => {
    if (!mobileAnimationObserver) return;

    const selectors = [
      '[role="dialog"]',
      ".invite-gate",
      ".reveal-on-scroll",
      ".events-section",
      ".dr-section",
      ".venue-surface-final",
      ".os-section",
      ".hero-details-entrance",
      ".hero-name-entrance",
      ".hero-kenburns",
      ".events-section h2",
      ".events-section .celebration-card",
      ".dr-section .dr-panel-outer",
      ".venue-surface-final > .relative.z-10",
      ".os-section .os-card-unit",
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
        if (observedMobileAnimationTargets.has(element)) return;
        observedMobileAnimationTargets.add(element);
        element.setAttribute("data-lantern-motion", "pending");
        mobileAnimationObserver.observe(element);
      });
    });

    const coupleMessage = document
      .querySelector(".msg-word")
      ?.closest(".celebration-surface");
    if (
      coupleMessage &&
      !observedMobileAnimationTargets.has(coupleMessage)
    ) {
      observedMobileAnimationTargets.add(coupleMessage);
      coupleMessage.setAttribute("data-lantern-motion", "pending");
      mobileAnimationObserver.observe(coupleMessage);
    }

    const heroScene = document.querySelector(".hero-name-entrance")
      ?.parentElement;
    if (heroScene && !observedMobileAnimationTargets.has(heroScene)) {
      observedMobileAnimationTargets.add(heroScene);
      heroScene.setAttribute("data-lantern-motion", "pending");
      mobileAnimationObserver.observe(heroScene);
    }

    const countdownRow = document.querySelector(".countdown-unit")
      ?.parentElement;
    if (countdownRow && !observedMobileAnimationTargets.has(countdownRow)) {
      observedMobileAnimationTargets.add(countdownRow);
      countdownRow.setAttribute("data-lantern-motion", "pending");
      mobileAnimationObserver.observe(countdownRow);
    }

    const closingHeadline = document.querySelector(".closing-headline");
    const actions = closingHeadline?.parentElement?.querySelector(
      ".closing-action"
    )?.parentElement;
    actions?.remove();
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
    observeScratchCards();
    refineStoryHeart();
    observeMobileMotion();
    observeMobileAnimations();
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

  const observer = new MutationObserver(observeSections);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  observeSections();
})();
