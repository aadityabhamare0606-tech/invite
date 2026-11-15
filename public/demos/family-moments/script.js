const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");

if (menuButton instanceof HTMLButtonElement && mobileNav instanceof HTMLElement) {
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

const photo = (image, tag, title, message, alt) => ({
  type: "photo",
  image: `images/${image}`,
  tag,
  title,
  message,
  alt,
});

const reelCard = (image, tag, title, reelId) => ({
  type: "reel",
  image: `images/${image}`,
  tag,
  title,
  reelId,
});

const familyStory = {
  mother: [
    photo("mom-01.webp", "Before the first hello", "A love already growing", "I spoke to you before I knew your face. Somehow, you already felt like home.", "A mother holding her baby close."),
    photo("mom-02.webp", "Our quiet hours", "Safe in Maa's arms", "The world could wait. We had all the time we needed right here.", "A mother sharing a quiet moment with her baby."),
    photo("mom-03.webp", "Your first safe place", "The sound of home", "You knew my voice before you knew the world. I will always be here when you need it.", "A mother cuddling her young child."),
    photo("mom-04.webp", "A new kind of morning", "Just you and me", "Some mornings began early. Every one of them began with you.", "A mother holding a small child."),
  ],
  father: [
    photo("dad-01.webp", "The first hello", "Papa's whole world", "I thought I knew what love was. Then you wrapped your hand around my finger.", "A father holding his young child."),
    photo("dad-02.webp", "Always close by", "One step at a time", "We went slowly. You held on, I stayed close, and we found our own pace.", "A father helping a child learn to ride a bicycle."),
    photo("dad-03.webp", "Your first big fan", "Up on Papa's shoulders", "The view was better up there. So was the company.", "A father lifting or carrying his child."),
    photo("dad-04.webp", "Our kind of playtime", "One more story?", "We built towers, knocked them down, and called it an important afternoon.", "A father playing with a young child on the floor."),
  ],
  waiting: [
    photo("expecting.webp", "The waiting days", "Making room for you", "We saved a little space in every room and a lot of space in every heart.", "A pregnant mother gently holding her belly."),
    photo("waiting-01.webp", "A little closer", "Counting the days", "Every tiny kick made the future feel a little more real.", "A pregnant woman enjoying a quiet moment."),
    photo("waiting-02.webp", "The name list", "So many maybes", "We tried every name out loud. None felt quite as special as the one we gave you.", "An expecting parent celebrating a pregnancy."),
    photo("waiting-03.webp", "The last quiet weeks", "Your little corner", "A soft blanket, a tiny cap, and a family ready to meet you.", "A pregnant mother in a warm, calm setting."),
  ],
  birth: [
    photo("newborn.webp", "The very first day", "Hello, little Mira", "You were so small, and somehow the whole room changed around you.", "A newborn baby resting on a soft blanket."),
    photo("birth-01.webp", "Day one", "All of us, all at once", "The first family photograph was a little blurry. Nobody minded.", "Parents holding their newborn baby."),
    photo("birth-02.webp", "Your first night", "Learning each other", "We found our way by staying close and taking each moment as it came.", "A mother holding her newborn."),
    photo("birth-03.webp", "A hand to hold", "Tiny fingers, giant love", "You held on tight. We promised to do the same.", "A newborn baby in a parent's arms."),
  ],
  "year-one": [
    photo("newborn.webp", "Month one", "Your first night home", "We learned your little sounds and checked on you a hundred times. No one wanted to miss a thing.", "A newborn resting on a soft blanket."),
    photo("nani-and-baby.webp", "Month two", "Nani's arms", "You settled into Nani's arms like you had known them forever.", "A grandmother holding her newborn grandchild."),
    photo("y1-03.webp", "A little first", "Maa", "One sleepy morning, you said it. The whole room went quiet, then everyone smiled at once.", "A baby holding an adult's hand."),
    photo("tiny-feet.webp", "Month four", "Those tiny toes", "We tried to remember how small you were. These little feet helped.", "A family member holding a baby's tiny feet."),
    photo("dad-and-baby.webp", "Month seven", "Papa", "Then came Papa. He said it was his favorite sound in the whole world.", "A father carrying his young child."),
    photo("birth-04.webp", "Month six", "One hand around a finger", "Your grip was tiny. The feeling stayed with us all day.", "A parent gently holding a baby's hand."),
    photo("y1-07.webp", "Month eight", "The first little crawl", "You had somewhere to be, and the whole family made a path.", "A baby crawling across a wooden floor."),
    photo("y1-08.webp", "Month ten", "One wobbly step", "We cheered for one step as if you had crossed the whole world.", "A baby standing or taking a first step."),
    photo("y1-09.webp", "Month eleven", "Our garden walk", "A little hand in ours, stopping to look at everything.", "A child taking a first outdoor walk."),
    photo("y1-10.webp", "Month twelve", "A cake for one", "You looked at the candle, then at all of us looking at you.", "A baby celebrating a first birthday."),
    reelCard("y1-11.webp", "Photo-slideshow preview", "First words & first steps", "year-one-words"),
    reelCard("first-birthday.webp", "Photo-slideshow preview", "One candle, all of us", "year-one-birthday"),
  ],
  "year-two": [
    photo("y2-01.webp", "Month thirteen", "Your second chapter", "The days got louder, funnier, and full of new things to show us.", "A toddler celebrating a family milestone."),
    photo("y2-02.webp", "Month fifteen", "A favorite little ritual", "We knew the game by heart. You still made us play it again.", "A toddler enjoying a playful moment."),
    photo("y2-03.webp", "Month sixteen", "All together", "Your favorite place was wherever everyone else had gathered.", "A family sharing a playful moment with a toddler."),
    photo("y2-04.webp", "Month eighteen", "A very big helper", "You wanted to do it yourself. We learned to give you time.", "A toddler exploring at home."),
    photo("y2-05.webp", "Month nineteen", "A new favorite book", "One more page became the story we read three times in a row.", "A toddler looking at a book with a parent."),
    photo("y2-06.webp", "Month twenty", "Our little adventures", "A short walk could take all morning when you had so much to notice.", "A parent helping a toddler learn a new activity."),
    photo("y2-07.webp", "Month twenty-one", "Your first little cycle", "We walked beside you while you found the pedals and your brave.", "A toddler riding a small tricycle along a path."),
    photo("y2-08.webp", "Month twenty-two", "Round and round", "You went one more lap, then waved as if you were off on an expedition.", "A young child enjoying a small ride-on toy."),
    photo("y2-09.webp", "Month twenty-three", "A little more sure", "Your feet found their rhythm. Our hands stayed close, just in case.", "A child riding a small bike with a parent nearby."),
    photo("y2-10.webp", "Month twenty-four", "Two candles, two wishes", "You knew how to blow, and we knew exactly what to wish for.", "A toddler celebrating a birthday with family."),
    reelCard("y2-11.webp", "Photo-slideshow preview", "Little rides & big adventures", "year-two-adventures"),
    reelCard("y2-12.webp", "Photo-slideshow preview", "A year of new words", "year-two-words"),
  ],
  "year-three": [
    photo("y3-01.webp", "Month twenty-five", "A world to discover", "Every walk brought a new question. We never wanted to rush the answers.", "A young child exploring with a family member."),
    photo("y3-02.webp", "Month twenty-seven", "Your first little masterpiece", "The colors went everywhere. We kept the picture anyway.", "A preschool-age child drawing or making art."),
    photo("y3-03.webp", "Month twenty-eight", "Our family, your way", "You found a way to turn an ordinary afternoon into our favorite one.", "A child sharing a happy moment with family."),
    photo("y3-04.webp", "Month twenty-nine", "A new favorite game", "You made the rules. We were very happy to follow them.", "A young child playing with family."),
    photo("y3-05.webp", "Month thirty", "A question for everything", "Why, how, and what happens next? We loved every one.", "A curious preschool-age child learning."),
    photo("y3-06.webp", "Month thirty-one", "The little things you noticed", "You spotted small wonders the rest of us had walked right past.", "A young child exploring a colorful scene."),
    photo("y3-07.webp", "Month thirty-two", "A very important helper", "You took your job seriously. We took a hundred pictures.", "A young child helping with a small task."),
    photo("y3-08.webp", "Month thirty-three", "One more story", "You picked the book. We knew the words by heart.", "A child reading a picture book with a parent."),
    photo("y3-09.webp", "Month thirty-four", "Your own little world", "A favorite toy, a busy imagination, and no reason to hurry.", "A preschool-age child playing at home."),
    photo("y3-10.webp", "Month thirty-five", "Ready for the next big thing", "You packed your little bag. We packed a few extra hugs.", "A young child getting ready for a new adventure."),
    reelCard("y3-11.webp", "Photo-slideshow preview", "A little backpack, a big day", "year-three-school"),
    reelCard("y3-12.webp", "Photo-slideshow preview", "Small things, big days", "year-three-everyday"),
  ],
};

const reelCollections = {
  "year-one-words": {
    label: "Year one · little firsts",
    title: "First words & first steps",
    moments: [
      { image: "images/y1-03.webp", alt: "A baby holding an adult's hand", caption: "The first little word: Maa" },
      { image: "images/y1-07.webp", alt: "A baby crawling across a wooden floor", caption: "There you go, off to explore" },
      { image: "images/y1-08.webp", alt: "A baby standing or taking a first step", caption: "One wobbly step, then another" },
      { image: "images/y1-09.webp", alt: "A child taking a first outdoor walk", caption: "The garden was a whole new world" },
    ],
  },
  "year-one-birthday": {
    label: "Year one · one candle",
    title: "One candle, all of us",
    moments: [
      { image: "images/newborn.webp", alt: "A newborn resting on a soft blanket", caption: "It began with your first hello" },
      { image: "images/nani-and-baby.webp", alt: "A grandmother holding her newborn grandchild", caption: "So many arms around you" },
      { image: "images/y1-10.webp", alt: "A baby celebrating a first birthday", caption: "One little cake, one big day" },
      { image: "images/first-birthday.webp", alt: "A baby at a first birthday celebration", caption: "And a whole year of being loved" },
    ],
  },
  "year-two-adventures": {
    label: "Year two · growing curious",
    title: "Little rides & big adventures",
    moments: [
      { image: "images/y2-03.webp", alt: "A family sharing a playful moment with a toddler", caption: "Everyone came along" },
      { image: "images/y2-06.webp", alt: "A parent helping a toddler learn a new activity", caption: "A little help, a lot of trying" },
      { image: "images/y2-07.webp", alt: "A toddler sitting on a small tricycle", caption: "Your first little ride" },
      { image: "images/y2-08.webp", alt: "A young child enjoying a bicycle ride", caption: "Round and round we went" },
    ],
  },
  "year-two-words": {
    label: "Year two · things you said",
    title: "A year of new words",
    moments: [
      { image: "images/y2-04.webp", alt: "A toddler exploring at home", caption: "I do it!" },
      { image: "images/y2-05.webp", alt: "A toddler looking at a book with a parent", caption: "Read it again, please" },
      { image: "images/y2-09.webp", alt: "A child riding a small bike with a parent nearby", caption: "Look, I can go by myself" },
      { image: "images/y2-10.webp", alt: "A toddler celebrating a birthday with family", caption: "Two candles, all our wishes" },
    ],
  },
  "year-three-school": {
    label: "Year three · a new beginning",
    title: "A little backpack, a big day",
    moments: [
      { image: "images/y3-02.webp", alt: "A preschool-age child drawing or making art", caption: "Your own little masterpiece" },
      { image: "images/y3-08.webp", alt: "A child reading a picture book with a parent", caption: "One more story before we go" },
      { image: "images/y3-10.webp", alt: "A young child getting ready for a new adventure", caption: "Your little bag was ready" },
      { image: "images/y3-11.webp", alt: "A preschool-age child starting a new school day", caption: "Off you went, brave as can be" },
    ],
  },
  "year-three-everyday": {
    label: "Year three · everyday magic",
    title: "Small things, big days",
    moments: [
      { image: "images/y3-01.webp", alt: "A young child exploring with a family member", caption: "A question around every corner" },
      { image: "images/y3-04.webp", alt: "A young child playing with family", caption: "You made the rules" },
      { image: "images/y3-06.webp", alt: "A young child exploring a colorful scene", caption: "You noticed everything" },
      { image: "images/y3-09.webp", alt: "A preschool-age child playing at home", caption: "A whole world in one afternoon" },
    ],
  },
};

let memoryCardCounter = 0;

function createMemoryCard(item) {
  const button = document.createElement("button");
  button.className = "memory-card";
  button.type = "button";
  button.setAttribute("aria-pressed", "false");
  button.setAttribute("aria-label", `Show memory: ${item.title}`);

  const inner = document.createElement("span");
  inner.className = "memory-card__inner";

  const front = document.createElement("span");
  front.className = "memory-card__face memory-card__front";
  front.setAttribute("aria-hidden", "false");

  const image = document.createElement("img");
  image.src = item.image;
  image.alt = "";
  image.loading = "lazy";
  image.decoding = "async";

  const frontCopy = document.createElement("span");
  frontCopy.className = "memory-card__front-copy";
  const tag = document.createElement("span");
  tag.className = "memory-card__date";
  tag.textContent = item.tag;
  const title = document.createElement("span");
  title.className = "memory-card__title";
  title.textContent = item.title;
  const hint = document.createElement("span");
  hint.className = "memory-card__hint";
  hint.textContent = "Tap to turn";
  frontCopy.append(tag, title, hint);
  front.append(image, frontCopy);

  const back = document.createElement("span");
  back.className = "memory-card__face memory-card__back";
  back.setAttribute("aria-hidden", "true");
  const mark = document.createElement("span");
  mark.className = "memory-card__back-mark";
  mark.setAttribute("aria-hidden", "true");
  mark.textContent = "♡";
  const backTitle = document.createElement("span");
  backTitle.className = "memory-card__back-title";
  backTitle.textContent = item.title;
  const message = document.createElement("span");
  message.className = "memory-card__message";
  message.id = `memory-message-${++memoryCardCounter}`;
  message.textContent = `“${item.message}”`;
  const backHint = document.createElement("span");
  backHint.className = "memory-card__back-hint";
  backHint.textContent = "Tap to see the photograph";
  back.append(mark, backTitle, message, backHint);
  inner.append(front, back);
  button.append(inner);

  button.addEventListener("click", () => {
    const flipped = button.getAttribute("aria-pressed") !== "true";
    button.classList.toggle("is-flipped", flipped);
    button.setAttribute("aria-pressed", String(flipped));
    button.setAttribute("aria-label", `${flipped ? "Hide" : "Show"} memory: ${item.title}`);
    front.setAttribute("aria-hidden", String(flipped));
    back.setAttribute("aria-hidden", String(!flipped));
    if (flipped) button.setAttribute("aria-describedby", message.id);
    else button.removeAttribute("aria-describedby");
  });

  return button;
}

function createReelCard(item) {
  const button = document.createElement("button");
  button.className = "reel-card";
  button.type = "button";
  button.setAttribute("aria-label", `Play slideshow: ${item.title}`);

  const image = document.createElement("img");
  image.src = item.image;
  image.alt = "";
  image.loading = "lazy";
  image.decoding = "async";

  const play = document.createElement("span");
  play.className = "reel-card__play";
  play.setAttribute("aria-hidden", "true");
  play.textContent = "▶";

  const copy = document.createElement("span");
  copy.className = "reel-card__copy";
  const label = document.createElement("span");
  label.className = "reel-card__label";
  label.textContent = item.tag;
  const title = document.createElement("span");
  title.className = "reel-card__title";
  title.textContent = item.title;
  const hint = document.createElement("span");
  hint.className = "reel-card__hint";
  hint.textContent = "Play photo slideshow";
  copy.append(label, title, hint);
  button.append(image, play, copy);
  button.addEventListener("click", () => openReel(item.reelId));
  return button;
}

document.querySelectorAll("[data-memory-grid]").forEach((grid) => {
  const chapter = grid.getAttribute("data-memory-grid");
  const items = familyStory[chapter];
  if (!Array.isArray(items)) {
    console.error(`Missing Family Moments story data for "${chapter}".`);
    return;
  }
  items.forEach((item) => {
    grid.append(item.type === "reel" ? createReelCard(item) : createMemoryCard(item));
  });
});

const reelDialog = document.querySelector("#reel-dialog");
const closeReelButton = document.querySelector("#close-reel");
const toggleReelButton = document.querySelector("#toggle-reel");
const toggleReelLabel = document.querySelector("#toggle-reel-label");
const nextReelButton = document.querySelector("#next-reel");
const reelImage = document.querySelector("#reel-image");
const reelCaption = document.querySelector("#reel-caption");
const reelStep = document.querySelector("#reel-step");
const reelTitle = document.querySelector("#reel-title");
const reelLabel = document.querySelector("#reel-label");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let currentReel;
let currentMoment = 0;
let reelTimer;
let transitionTimer;

function showMoment(index) {
  if (!currentReel || !(reelImage instanceof HTMLImageElement) || !(reelCaption instanceof HTMLElement) || !(reelStep instanceof HTMLElement)) return;

  currentMoment = (index + currentReel.moments.length) % currentReel.moments.length;
  const moment = currentReel.moments[currentMoment];
  window.clearTimeout(transitionTimer);

  const updateContent = () => {
    reelImage.src = moment.image;
    reelImage.alt = moment.alt;
    reelCaption.textContent = moment.caption;
    reelStep.textContent = `${String(currentMoment + 1).padStart(2, "0")} / ${String(currentReel.moments.length).padStart(2, "0")}`;
    reelImage.style.opacity = "1";
  };

  if (reducedMotion.matches) {
    updateContent();
  } else {
    reelImage.style.opacity = "0";
    transitionTimer = window.setTimeout(updateContent, 140);
  }
}

function stopReel() {
  window.clearInterval(reelTimer);
  reelTimer = undefined;
  if (toggleReelLabel instanceof HTMLElement) toggleReelLabel.textContent = "Play";
  const icon = toggleReelButton instanceof HTMLElement ? toggleReelButton.querySelector("[aria-hidden='true']") : null;
  if (icon instanceof HTMLElement) icon.textContent = "▶";
}

function startReel() {
  if (reelTimer || !currentReel || !(toggleReelLabel instanceof HTMLElement)) return;
  toggleReelLabel.textContent = "Pause";
  const icon = toggleReelButton instanceof HTMLElement ? toggleReelButton.querySelector("[aria-hidden='true']") : null;
  if (icon instanceof HTMLElement) icon.textContent = "Ⅱ";
  reelTimer = window.setInterval(() => showMoment(currentMoment + 1), 2600);
}

function openReel(reelId) {
  if (!(reelDialog instanceof HTMLDialogElement)) {
    console.error("The Family Moments slideshow dialog is missing.");
    return;
  }
  const reel = reelCollections[reelId];
  if (!reel) {
    console.error(`Missing Family Moments slideshow data for "${reelId}".`);
    return;
  }

  stopReel();
  currentReel = reel;
  currentMoment = 0;
  if (reelTitle instanceof HTMLElement) reelTitle.textContent = reel.title;
  if (reelLabel instanceof HTMLElement) reelLabel.textContent = reel.label;
  showMoment(0);
  reelDialog.showModal();
  if (!reducedMotion.matches) startReel();
}

if (reelDialog instanceof HTMLDialogElement) {
  if (closeReelButton instanceof HTMLButtonElement) closeReelButton.addEventListener("click", () => reelDialog.close());
  if (toggleReelButton instanceof HTMLButtonElement) {
    toggleReelButton.addEventListener("click", () => {
      if (reelTimer) stopReel();
      else startReel();
    });
  }
  if (nextReelButton instanceof HTMLButtonElement) nextReelButton.addEventListener("click", () => showMoment(currentMoment + 1));
  reelDialog.addEventListener("close", () => {
    stopReel();
    currentReel = undefined;
  });
  reelDialog.addEventListener("click", (event) => {
    if (event.target === reelDialog) reelDialog.close();
  });
} else {
  console.error("The Family Moments slideshow dialog is missing.");
}
