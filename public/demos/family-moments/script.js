const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");

if (menuButton && mobileNav) {
  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    menuButton.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
    mobileNav.hidden = expanded;
  });

  mobileNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      mobileNav.hidden = true;
    }
  });
}

const reelDialog = document.querySelector("#reel-dialog");
const openReelButton = document.querySelector("#play-reel");
const closeReelButton = document.querySelector("#close-reel");
const toggleReelButton = document.querySelector("#toggle-reel");
const nextReelButton = document.querySelector("#next-reel");
const reelImage = document.querySelector("#reel-image");
const reelCaption = document.querySelector("#reel-caption");
const reelStep = document.querySelector("#reel-step");
const reelStage = document.querySelector("#reel-stage");

const reelMoments = [
  {
    image: "images/expecting.webp",
    alt: "A parent holding her pregnancy bump",
    caption: "Before we met you",
  },
  {
    image: "images/newborn.webp",
    alt: "Newborn Mira resting on a blanket",
    caption: "The day you arrived",
  },
  {
    image: "images/nani-and-baby.webp",
    alt: "Nani holding baby Mira",
    caption: "All the arms around you",
  },
  {
    image: "images/first-birthday.webp",
    alt: "Mira at her first birthday",
    caption: "One candle, one whole year",
  },
];

let currentMoment = 0;
let reelTimer;

function showMoment(index) {
  currentMoment = (index + reelMoments.length) % reelMoments.length;
  const moment = reelMoments[currentMoment];
  reelImage.style.opacity = "0";
  window.setTimeout(() => {
    reelImage.src = moment.image;
    reelImage.alt = moment.alt;
    reelCaption.textContent = moment.caption;
    reelStep.textContent = `${String(currentMoment + 1).padStart(2, "0")} / ${String(reelMoments.length).padStart(2, "0")}`;
    reelImage.style.opacity = "1";
  }, 180);
}

function stopReel() {
  window.clearInterval(reelTimer);
  reelTimer = undefined;
  toggleReelButton.innerHTML = "<span aria-hidden=\"true\">▶</span> Play";
}

function startReel() {
  if (reelTimer) return;
  toggleReelButton.innerHTML = "<span aria-hidden=\"true\">Ⅱ</span> Pause";
  reelTimer = window.setInterval(() => showMoment(currentMoment + 1), 2300);
}

if (reelDialog instanceof HTMLDialogElement && openReelButton && closeReelButton && toggleReelButton && nextReelButton && reelImage && reelCaption && reelStep && reelStage) {
  openReelButton.addEventListener("click", () => {
    currentMoment = 0;
    showMoment(currentMoment);
    reelDialog.showModal();
    startReel();
  });

  closeReelButton.addEventListener("click", () => reelDialog.close());
  reelDialog.addEventListener("close", stopReel);

  toggleReelButton.addEventListener("click", () => {
    if (reelTimer) stopReel();
    else startReel();
  });

  nextReelButton.addEventListener("click", () => showMoment(currentMoment + 1));

  reelDialog.addEventListener("click", (event) => {
    if (event.target === reelDialog) reelDialog.close();
  });
}
