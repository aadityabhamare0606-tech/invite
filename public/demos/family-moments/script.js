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

const videoCard = (image, tag, title, videoId) => ({
  type: "video",
  image: `images/${image}`,
  tag,
  title,
  videoId,
});

const familyStory = {
  "mother-origins": [
    photo("mom-origins-01.jpg", "With Amma", "Always her daughter", "Even grown up, one embrace could make her feel at home.", "A grown daughter embracing her mother at the beach."),
    photo("mom-origins-02.jpg", "A day together", "Their little ritual", "A walk, a shared laugh, and nowhere else to be.", "A grown daughter walking with her mother along the beach."),
    photo("mom-origins-03.jpg", "Side by side", "Her first best friend", "She learned what care looked like by watching her mother.", "An adult daughter and her mother standing together by the sea."),
    photo("mom-origins-parents.jpg", "All three together", "The people who raised her", "Whatever came next, she carried their love with her.", "A bride standing between her mother and father."),
  ],
  "father-origins": [
    photo("dad-origins-01.jpg", "The family album", "His favorite stories", "He could tell them a hundred times and still find something new.", "An adult son sharing a photograph with his elderly parents."),
    photo("dad-origins-02.jpg", "A little surprise", "The ones who know him best", "Some hugs still feel like coming home.", "An adult son sharing a gift with his elderly parents."),
    photo("dad-origins-03.jpg", "All together", "Their boy, all grown up", "The years changed. The way they looked at him never did.", "An adult son and daughter sharing a family moment with their parents."),
    photo("dad-origins-04.jpg", "A mother's steady love", "Always her little boy", "He may be all grown up. He will always be her son.", "An adult son sharing a tender embrace with his mother."),
  ],
  wedding: [
    photo("wedding-01.jpg", "The wedding day", "A look that said everything", "Two nervous smiles, one promise, and a whole life beginning.", "A newly married couple sharing a joyful look."),
    photo("wedding-02.jpg", "Just married", "Their first photograph as one", "They stepped into the future side by side.", "An Indian bride and groom embracing outdoors after their wedding."),
    photo("wedding-03.jpg", "A small promise", "With family around them", "A quiet ritual, a full room, and two families cheering them on.", "An Indian bride and groom taking part in a wedding ceremony."),
    videoCard("wedding-video-poster.jpg", "A little wedding film", "The day their stories met", "parents-wedding"),
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
    photo("tiny-feet.webp", "Month four", "Those tiny toes", "We tried to remember how small you were. These little feet helped.", "A family member holding a baby's tiny feet."),
    photo("birth-04.webp", "Month six", "One hand around a finger", "Your grip was tiny. The feeling stayed with us all day.", "A parent gently holding a baby's hand."),
    photo("dad-and-baby.webp", "Month seven", "Papa", "Then came Papa. He said it was his favorite sound in the whole world.", "A father carrying his young child."),
    photo("y1-07.webp", "Month eight", "The first little crawl", "You had somewhere to be, and the whole family made a path.", "A baby crawling across a wooden floor."),
    photo("y1-03.webp", "Month nine", "Maa", "One sleepy morning, you said it. The whole room went quiet, then everyone smiled at once.", "A baby holding an adult's hand."),
    photo("y1-08.webp", "Month ten", "One wobbly step", "We cheered for one step as if you had crossed the whole world.", "A baby standing or taking a first step."),
    photo("y1-09.webp", "Month eleven", "Our garden walk", "A little hand in ours, stopping to look at everything.", "A child taking a first outdoor walk."),
    photo("y1-10.webp", "Month twelve", "A cake for one", "You looked at the candle, then at all of us looking at you.", "A baby celebrating a first birthday."),
    photo("y1-11.webp", "Month twelve", "All our favorite firsts", "One year later, our camera roll was full and our hearts were fuller.", "A baby enjoying a first birthday photo session."),
    photo("first-birthday.webp", "A year in little moments", "Your very first year", "A little look back at the days that made us a family.", "A baby at a first birthday celebration."),
    videoCard("y1-03.webp", "A little video", "A quiet playtime with Maa", "year-one-play"),
  ],
  "year-two": [
    photo("y2-01.webp", "Month thirteen", "Your second chapter", "The days got louder, funnier, and full of new things to show us.", "A toddler celebrating a family milestone."),
    photo("y2-02.webp", "Month fifteen", "A favorite little ritual", "We knew the game by heart. You still made us play it again.", "A toddler enjoying a playful moment."),
    photo("y2-03.webp", "Month sixteen", "All together", "Your favorite place was wherever everyone else had gathered.", "A family sharing a playful moment with a toddler."),
    photo("y2-04.webp", "Month eighteen", "A very big helper", "You wanted to do it yourself. We learned to give you time.", "A toddler exploring at home."),
    photo("y2-05.webp", "Month nineteen", "A new favorite book", "One more page became the story we read three times in a row.", "A toddler looking at a book with a parent."),
    photo("y2-06.webp", "Month twenty", "Our little adventures", "A short walk could take all morning when you had so much to notice.", "A parent helping a toddler learn a new activity."),
    photo("y2-07.webp", "Month twenty-one", "Your first little cycle", "We walked beside you while you found the pedals and your brave.", "A toddler riding a small tricycle along a path."),
    photo("y2-11.webp", "A little later", "Just one more lap", "You waved us along and made the whole walk feel like an adventure.", "A father helping a young child learn to ride a bicycle."),
    photo("y2-08.webp", "Month twenty-two", "Round and round", "You went one more lap, then waved as if you were off on an expedition.", "A young child enjoying a small ride-on toy."),
    photo("y2-09.webp", "Month twenty-three", "A little more sure", "Your feet found their rhythm. Our hands stayed close, just in case.", "A child riding a small bike with a parent nearby."),
    photo("y2-10.webp", "Month twenty-four", "Two candles, two wishes", "You knew how to blow, and we knew exactly what to wish for.", "A toddler celebrating a birthday with family."),
    photo("y2-12.webp", "Month twenty-three", "Bubbles everywhere", "The bubbles floated away. Your giggles stayed with us.", "A toddler playing with bubbles at home."),
    videoCard("y2-03.webp", "A little video", "The afternoon we played", "year-two-play"),
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
    photo("y3-11.webp", "Month thirty-five", "Your first school morning", "A little bag, a brave wave, and a family trying not to cry.", "A child beginning a new school day."),
    photo("y3-12.webp", "Month thirty-six", "Look how far you have come", "Three little years, and a whole world opening in front of you.", "A young child holding flowers on a school day."),
    videoCard("y3-02.webp", "A little video", "Making something together", "year-three-play"),
  ],
};

const familyVideos = {
  "parents-wedding": {
    title: "The day their stories met",
    label: "Their beginning · wedding day",
    src: "https://videos.pexels.com/video-files/31139763/13305464_1920_1080_50fps.mp4",
  },
  "year-one-play": {
    title: "A quiet playtime with Maa",
    label: "Year one · little moments",
    src: "https://videos.pexels.com/video-files/8046966/8046966-hd_1920_1080_25fps.mp4",
  },
  "year-two-play": {
    title: "The afternoon we played",
    label: "Year two · little moments",
    src: "https://videos.pexels.com/video-files/6949137/6949137-hd_1920_1080_25fps.mp4",
  },
  "year-three-play": {
    title: "Making something together",
    label: "Year three · little moments",
    src: "https://videos.pexels.com/video-files/7312131/7312131-uhd_2732_1440_25fps.mp4",
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

function createVideoCard(item) {
  const button = document.createElement("button");
  button.className = "video-card";
  button.type = "button";
  button.setAttribute("aria-label", `Watch video: ${item.title}`);

  const image = document.createElement("img");
  image.src = item.image;
  image.alt = "";
  image.loading = "lazy";
  image.decoding = "async";

  const play = document.createElement("span");
  play.className = "video-card__play";
  play.setAttribute("aria-hidden", "true");
  play.textContent = "▶";

  const copy = document.createElement("span");
  copy.className = "video-card__copy";
  const label = document.createElement("span");
  label.className = "video-card__label";
  label.textContent = item.tag;
  const title = document.createElement("span");
  title.className = "video-card__title";
  title.textContent = item.title;
  const hint = document.createElement("span");
  hint.className = "video-card__hint";
  hint.textContent = "Play sample video";
  copy.append(label, title, hint);
  button.append(image, play, copy);
  button.addEventListener("click", () => openVideo(item.videoId, item.image));
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
    grid.append(item.type === "video" ? createVideoCard(item) : createMemoryCard(item));
  });
});

const originSections = document.querySelectorAll(".story-section--origin");
if ("IntersectionObserver" in window) {
  const originObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        originObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  originSections.forEach((section) => originObserver.observe(section));
} else {
  originSections.forEach((section) => section.classList.add("is-visible"));
}

const videoDialog = document.querySelector("#video-dialog");
const closeVideoButton = document.querySelector("#close-video");
const videoTitle = document.querySelector("#video-title");
const videoLabel = document.querySelector("#video-label");
const familyVideo = document.querySelector("#family-video");

function releaseVideo() {
  if (!(familyVideo instanceof HTMLVideoElement)) return;
  familyVideo.pause();
  familyVideo.removeAttribute("src");
  familyVideo.load();
}

function openVideo(videoId, poster) {
  if (!(videoDialog instanceof HTMLDialogElement) || !(familyVideo instanceof HTMLVideoElement)) {
    console.error("The Family Moments video player is missing.");
    return;
  }
  const clip = familyVideos[videoId];
  if (!clip) {
    console.error(`Missing Family Moments video data for "${videoId}".`);
    return;
  }

  videoTitle.textContent = clip.title;
  videoLabel.textContent = clip.label;
  familyVideo.poster = poster;
  familyVideo.src = clip.src;
  familyVideo.load();
  videoDialog.showModal();
}

if (videoDialog instanceof HTMLDialogElement) {
  if (closeVideoButton instanceof HTMLButtonElement) {
    closeVideoButton.addEventListener("click", () => {
      videoDialog.close();
      releaseVideo();
    });
  }
  videoDialog.addEventListener("cancel", releaseVideo);
  videoDialog.addEventListener("close", releaseVideo);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && videoDialog.open) {
      event.preventDefault();
      videoDialog.close();
      releaseVideo();
    }
  });
  videoDialog.addEventListener("click", (event) => {
    if (event.target === videoDialog) {
      videoDialog.close();
      releaseVideo();
    }
  });
} else {
  console.error("The Family Moments video player dialog is missing.");
}
