"use strict";

const ART = "https://myinvitations.io/wp-content/uploads/2026/10/";
const gallery = [
  {
    src: "images/prewedding-bengali-couple-portrait.jpg",
    alt: "Bengali couple in blue and red traditional outfits during a pre-wedding shoot in a green forest",
  },
  {
    src: "images/prewedding-bengali-couple-embrace.jpg",
    alt: "Bengali couple embracing outdoors in blue and red traditional attire",
  },
  {
    src: "images/prewedding-bengali-couple-together.jpg",
    alt: "Bengali couple smiling at each other in traditional attire during their pre-wedding shoot",
  },
  {
    src: "images/prewedding-riverside-couple-portrait.jpg",
    alt: "Indian couple sharing a quiet pre-wedding portrait beside a calm river",
  },
  {
    src: "images/prewedding-riverside-couple-sunset.jpg",
    alt: "Indian couple sharing a tender moment at sunset by the river",
  },
  {
    src: "images/prewedding-temple-couple-portrait.jpg",
    alt: "Indian couple in pastel traditional attire posing before an ancient temple",
  },
];
const celebration = {
  iso: "2027-02-14T16:30:00+05:30",
  line: "Sunday | 14 February 2027 · 4:30 PM",
  venue: "The Leela Palace, Udaipur",
  maps: "https://www.google.com/maps/search/?api=1&query=The+Leela+Palace+Udaipur",
};
const events = [
  {
    name: "Haldi",
    date: "Thu, 11 Feb 2027",
    time: "10:30 AM",
    iso: "20270211T103000",
    image: "wedding-haldi.webp",
    text: "Warm turmeric blessings, marigolds, and laughter begin the festivities.",
    venue: "The Leela Palace",
    address: "Udaipur, Rajasthan",
  },
  {
    name: "Mehndi",
    date: "Fri, 12 Feb 2027",
    time: "5:00 PM",
    iso: "20270212T170000",
    image: "wedding-mehndi.webp",
    text: "An evening of henna, music, and stories with the people we love.",
    venue: "The Leela Palace",
    address: "Udaipur, Rajasthan",
  },
  {
    name: "Sangeet",
    date: "Sat, 13 Feb 2027",
    time: "7:00 PM",
    iso: "20270213T190000",
    image: "wedding-sangeet.webp",
    text: "A night of live music, dancing, and both families together.",
    venue: "The Leela Palace",
    address: "Udaipur, Rajasthan",
  },
  {
    name: "Reception",
    date: "Mon, 15 Feb 2027",
    time: "7:00 PM",
    iso: "20270215T190000",
    image: "wedding-reception.webp",
    text: "Raise a glass to the newlyweds at an evening of dinner, music, and joy.",
    venue: "The Leela Palace",
    address: "Udaipur, Rajasthan",
  },
];

document.querySelector("#lamp-field").innerHTML = [
  { left: "9%", size: 72, delay: "0.8s", duration: "24s", drift: "-40px" },
  { left: "34%", size: 58, delay: "4s", duration: "18s", drift: "12px" },
  { left: "62%", size: 84, delay: "1.4s", duration: "22s", drift: "-18px" },
  { left: "88%", size: 64, delay: "6s", duration: "20s", drift: "-30px" },
  { left: "18%", size: 48, delay: "9s", duration: "16s", drift: "20px" },
]
  .map(
    (lamp) =>
      `<img src="${ART}lamp-208cb5.svg" alt="" style="left:${lamp.left};width:${lamp.size}px;height:${lamp.size}px;animation-delay:${lamp.delay};animation-duration:${lamp.duration};--drift:${lamp.drift}">`,
  )
  .join("");

for (const [containerId, count, topFactor, leftFactor, delayFactor] of [
  ["hero-sparkles", 18, 37, 53, 0.35],
  ["countdown-sparkles", 16, 29, 47, 0.4],
]) {
  const container = document.getElementById(containerId);
  for (let index = 0; index < count; index += 1) {
    const sparkle = document.createElement("span");
    sparkle.style.top = `${(index * topFactor) % 96}%`;
    sparkle.style.left = `${(index * leftFactor) % 96}%`;
    sparkle.style.animationDelay = `${(index % 6) * delayFactor}s`;
    container.append(sparkle);
  }
}

const cover = document.querySelector("#cover");
const coverVideo = document.querySelector("#cover-video");
const coverSkip = document.querySelector("#cover-skip");
const closeCover = () => {
  cover.remove();
  document.body.style.overflow = "";
  document.querySelector("#invitation").focus({ preventScroll: true });
};
document.body.style.overflow = "hidden";
cover.addEventListener("click", (event) => {
  if (coverSkip.contains(event.target) || !coverSkip.hidden) return;
  coverVideo.classList.add("is-playing");
  cover.querySelector(":scope > img").classList.add("is-hidden");
  document.querySelector("#cover-open").hidden = true;
  coverSkip.hidden = false;
  coverVideo.volume = 0.4;
  coverVideo.play().catch(closeCover);
});
coverSkip.addEventListener("click", closeCover);
coverVideo.addEventListener("ended", closeCover);
coverVideo.addEventListener("error", () => {
  if (!document.querySelector("#cover-skip").hidden) closeCover();
});

const canvas = document.querySelector("#scratch-canvas");
const scratchHint = document.querySelector("#scratch-hint");
const scratchCard = canvas.closest(".scratch-card");
const celebrationLayer = scratchCard.querySelector(".scratch-celebration");
let scratching = false;
let scratchGone = false;
function celebrateScratchReveal() {
  scratchCard.classList.add("is-revealed");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const symbols = ["♥", "♡", "✦", "❀", "♥", "✧"];
  const colors = ["#a0344e", "#c9a55d", "#e97582", "#fff8e8", "#cf5873"];
  const particles = document.createDocumentFragment();
  for (let index = 0; index < 36; index += 1) {
    const angle = (Math.PI * 2 * index) / 36 + (Math.random() - 0.5) * 0.45;
    const distance = 100 + Math.random() * 140;
    const particle = document.createElement("span");
    particle.className = "scratch-particle";
    particle.textContent = symbols[index % symbols.length];
    particle.style.setProperty("--particle-x", `${Math.round(Math.cos(angle) * distance)}px`);
    particle.style.setProperty("--particle-y", `${Math.round(Math.sin(angle) * distance)}px`);
    particle.style.setProperty("--particle-rotation", `${Math.round(Math.random() * 360 - 180)}deg`);
    particle.style.setProperty("--particle-delay", `${Math.round(Math.random() * 140)}ms`);
    particle.style.setProperty("--particle-size", `${14 + Math.round(Math.random() * 10)}px`);
    particle.style.setProperty("--particle-color", colors[index % colors.length]);
    particles.append(particle);
  }
  const hearts = document.createDocumentFragment();
  for (let index = 0; index < 10; index += 1) {
    const heart = document.createElement("span");
    heart.className = "scratch-heart";
    heart.textContent = index % 3 === 0 ? "♥" : "♡";
    heart.style.setProperty("--heart-left", `${8 + Math.round(Math.random() * 84)}%`);
    heart.style.setProperty("--heart-delay", `${Math.round(Math.random() * 700)}ms`);
    heart.style.setProperty("--heart-drift", `${Math.round((Math.random() - 0.5) * 90)}px`);
    heart.style.setProperty("--heart-size", `${14 + Math.round(Math.random() * 12)}px`);
    hearts.append(heart);
  }
  const fireworkColors = ["#d9a441", "#e56f83", "#fff0bd", "#7d9e50", "#c27bba"];
  const bursts = [
    { left: 18, top: 28, delay: 0 },
    { left: 50, top: 18, delay: 180 },
    { left: 82, top: 30, delay: 360 },
  ];
  for (const [index, burst] of bursts.entries()) {
    const rocket = document.createElement("span");
    rocket.className = "scratch-rocket";
    rocket.textContent = "🚀";
    rocket.style.setProperty("--rocket-left", `${burst.left}%`);
    rocket.style.setProperty("--rocket-y", `-${Math.round(scratchCard.clientHeight * (0.72 + (index % 2) * 0.08))}px`);
    rocket.style.setProperty("--rocket-delay", `${burst.delay}ms`);
    particles.append(rocket);
    window.setTimeout(() => {
      const firework = document.createElement("span");
      firework.className = "scratch-firework";
      firework.style.setProperty("--firework-left", `${burst.left}%`);
      firework.style.setProperty("--firework-top", `${burst.top}%`);
      const sparks = document.createDocumentFragment();
      for (let sparkIndex = 0; sparkIndex < 16; sparkIndex += 1) {
        const angle = (Math.PI * 2 * sparkIndex) / 16 + (Math.random() - 0.5) * 0.12;
        const distance = 24 + Math.random() * 22;
        const spark = document.createElement("span");
        spark.className = "scratch-firework-spark";
        spark.style.setProperty("--spark-x", `${Math.round(Math.cos(angle) * distance)}px`);
        spark.style.setProperty("--spark-y", `${Math.round(Math.sin(angle) * distance)}px`);
        spark.style.setProperty("--spark-color", fireworkColors[(sparkIndex + index) % fireworkColors.length]);
        sparks.append(spark);
      }
      firework.append(sparks);
      celebrationLayer.append(firework);
      window.setTimeout(() => firework.remove(), 1000);
    }, 850 + burst.delay);
  }
  celebrationLayer.replaceChildren(particles, hearts);
  window.setTimeout(() => celebrationLayer.replaceChildren(), 3200);
}
function paintScratchCard() {
  if (scratchGone) return;
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * scale);
  canvas.height = Math.round(rect.height * scale);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return;
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#e8d3a2");
  gradient.addColorStop(0.45, "#b8860b");
  gradient.addColorStop(1, "#f3e2b8");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(122, 42, 53, 0.92)";
  context.textAlign = "center";
  context.font = `600 ${Math.floor(canvas.width / 22)}px "Cormorant Garamond", serif`;
  context.fillText("Scratch to Reveal", canvas.width / 2, canvas.height / 2 - 8);
  context.font = `500 ${Math.floor(canvas.width / 28)}px "Jost", sans-serif`;
  context.fillText("✧  ✦  ✧", canvas.width / 2, canvas.height / 2 + canvas.width / 18);
}
function scratch(event) {
  if (scratchGone) return;
  if (event.type === "pointerdown") {
    scratching = true;
    canvas.setPointerCapture(event.pointerId);
  }
  if (event.type === "pointerup" || event.type === "pointercancel") scratching = false;
  if (!scratching && event.type !== "pointerdown") return;
  const context = canvas.getContext("2d");
  if (!context) return;
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
  const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
  context.globalCompositeOperation = "destination-out";
  context.beginPath();
  context.arc(x, y, canvas.width * 0.06, 0, Math.PI * 2);
  context.fill();
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let clear = 0;
  for (let index = 3; index < pixels.length; index += 64) {
    if (pixels[index] < 20) clear += 1;
  }
  if (clear / (pixels.length / 64) > 0.42) {
    scratchGone = true;
    canvas.remove();
    scratchHint.textContent = "The countdown to forever begins";
    celebrateScratchReveal();
  }
}
paintScratchCard();
window.addEventListener("resize", paintScratchCard);
for (const eventName of ["pointerdown", "pointermove", "pointerup", "pointercancel"]) {
  canvas.addEventListener(eventName, scratch);
}

const countdownTarget = new Date(celebration.iso).getTime();
const countdownValues = document.querySelectorAll("#count-grid b");
function updateCountdown() {
  const remaining = Math.max(0, Math.floor((countdownTarget - Date.now()) / 1000));
  const values = [
    Math.floor(remaining / 86400),
    Math.floor(remaining / 3600) % 24,
    Math.floor(remaining / 60) % 60,
    remaining % 60,
  ];
  values.forEach((value, index) => {
    countdownValues[index].textContent = String(value).padStart(2, "0");
  });
}
updateCountdown();
window.setInterval(updateCountdown, 1000);

let activePhoto = 0;
const photoDialog = document.querySelector("#photo-dialog");
const dialogImage = document.querySelector("#dialog-image");
const photoCount = document.querySelector("#photo-count");
function showPhoto(index) {
  activePhoto = (index + gallery.length) % gallery.length;
  dialogImage.src = gallery[activePhoto].src;
  dialogImage.alt = gallery[activePhoto].alt;
  photoCount.textContent = `${activePhoto + 1} / ${gallery.length}`;
  if (!photoDialog.open) photoDialog.showModal();
}
document.querySelector("#hanging-grid").innerHTML = gallery
  .map(
    (photo, index) =>
      `<button class="${index % 2 ? "tilt-odd" : "tilt-even"}" type="button" aria-label="Open pre-wedding photo ${index + 1}" data-photo-index="${index}"><span class="string"></span><span class="pin" aria-hidden="true">✿</span><span class="polaroid"><img class="motion-image" src="${photo.src}" alt="${photo.alt}" loading="lazy" decoding="async"></span></button>`,
  )
  .join("");
document.querySelector("#hanging-grid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-photo-index]");
  if (button) showPhoto(Number(button.dataset.photoIndex));
});
document.querySelector("#dialog-close").addEventListener("click", () => photoDialog.close());
document.querySelector("#previous-photo").addEventListener("click", () => showPhoto(activePhoto - 1));
document.querySelector("#next-photo").addEventListener("click", () => showPhoto(activePhoto + 1));
photoDialog.addEventListener("click", (event) => {
  if (event.target === photoDialog) photoDialog.close();
});
document.addEventListener("keydown", (event) => {
  if (!photoDialog.open) return;
  if (event.key === "ArrowLeft") showPhoto(activePhoto - 1);
  if (event.key === "ArrowRight") showPhoto(activePhoto + 1);
});

function downloadCalendar(item) {
  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `UID:${item.iso}-aarav-anaya`,
    "DTSTAMP:20261116T000000Z",
    `DTSTART;TZID=Asia/Kolkata:${item.iso}`,
    `SUMMARY:Aarav and Anaya - ${item.name}`,
    `LOCATION:${item.venue}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/calendar" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${item.name}.ics`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
document.querySelector("#arch-list").innerHTML = events
  .map(
    (item, index) => `
      <article class="${index % 2 ? "arch-card reverse" : "arch-card"}">
        <img class="corner top" src="${ART}Blush-Floral.webp" alt="">
        <img class="corner bottom" src="${ART}Blush-Floral.webp" alt="">
        <div class="arch-media"><img class="motion-image" src="${ART}${item.image}" alt="${item.name} ceremony" loading="lazy" decoding="async"></div>
        <div class="arch-copy">
          <p class="arch-kicker">Wedding Event · 0${index + 1}</p>
          <h3>${item.name}</h3>
          <p class="arch-note">${item.text}</p>
          <ul class="arch-meta" aria-label="Event details">
            <li><svg class="arch-icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="2"></rect><path d="M16 2v4M8 2v4M3 9h18"></path></svg><span>${item.date}</span></li>
            <li><svg class="arch-icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg><span>${item.time}</span></li>
            <li><svg class="arch-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="2.5"></circle></svg><span>${item.venue}, ${item.address}</span></li>
          </ul>
          <div class="arch-actions">
            <a href="${celebration.maps}" target="_blank" rel="noreferrer"><svg class="arch-action-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>Get Directions</a>
            <button type="button" data-calendar-index="${index}"><svg class="arch-action-icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="2"></rect><path d="M16 2v4M8 2v4M3 9h18"></path></svg>Add to Calendar</button>
          </div>
        </div>
      </article>`,
  )
  .join("");
document.querySelector("#arch-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-calendar-index]");
  if (button) downloadCalendar(events[Number(button.dataset.calendarIndex)]);
});

let attendance = "";
const attendanceInput = document.querySelector('[name="attendance"]');
document.querySelectorAll("[data-attendance]").forEach((button) => {
  button.addEventListener("click", () => {
    attendance = button.dataset.attendance;
    attendanceInput.value = attendance;
    document.querySelectorAll("[data-attendance]").forEach((option) => {
      option.classList.toggle("selected", option === button);
      option.setAttribute("aria-pressed", String(option === button));
    });
  });
});
const guestCount = document.querySelector('[name="guest_count"]');
document.querySelector("#guest-minus").addEventListener("click", () => {
  guestCount.value = String(Math.max(1, Number(guestCount.value) - 1));
});
document.querySelector("#guest-plus").addEventListener("click", () => {
  guestCount.value = String(Math.min(20, Number(guestCount.value) + 1));
});
document.querySelector("#rsvp-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const message = document.querySelector("#rsvp-message");
  if (!attendance) {
    message.textContent = "Please choose how you will join Aarav and Anaya.";
    message.hidden = false;
    return;
  }
  message.textContent = "Thank you for celebrating with Aarav and Anaya. This preview is not sent.";
  message.hidden = false;
});

const motionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (motionAllowed) document.documentElement.classList.add("has-motion");

document.querySelectorAll(".motion-image").forEach((image) => {
  const markImageReady = () => image.classList.add("is-image-ready");
  if (image.complete) {
    window.requestAnimationFrame(markImageReady);
    return;
  }
  image.addEventListener("load", markImageReady, { once: true });
  image.addEventListener("error", markImageReady, { once: true });
});

if ("IntersectionObserver" in window && motionAllowed) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px 14% 0px", threshold: 0.01 },
  );
  const revealGroups = [
    ".joy-quote-inner",
    ".couple-story-card",
    ".scratch-card",
    ".countdown-banner",
    ".hanging-gallery",
    ".arch-card",
    ".rsvp-stage",
    ".venue-card",
    ".love-footer",
  ];
  revealGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add("scroll-reveal");
      element.style.setProperty("--reveal-delay", `${Math.min(index, 3) * 35}ms`);
      revealObserver.observe(element);
    });
  });
}
