/**
 * Every demo design on the storefront, in one place.
 *
 * This file is the single source of truth for card data, tags and prices.
 * Previously this was duplicated across WeddingCollection.tsx, the
 * save-the-date page, the proposals page and three memories pages â€” which is
 * why the "6 designs" badge and the "9 designs" copy disagreed.
 *
 * Tags double as the visitor-facing filter chips, so a tag that no card
 * carries will never appear in the filter bar.
 */

export type DemoBadgeStyle =
  | "bestseller"
  | "ookind"
  | "popular"
  | "premium"
  | "classic"
  | "new"
  | "latest";

export type DemoCategory = "Wedding" | "Save the Date" | "Proposal" | "Memories";

export type DemoCardData = {
  id: string;
  badge: string;
  badgeStyle: DemoBadgeStyle;
  type: string;
  title: string;
  description: string;
  price: string;
  priceUnit?: string;
  demoSrc: string;
  previewImg?: string;
  previewBg?: string;
  previewAccent?: string;
  category: DemoCategory;
  tags: string[];
};

/* â”€â”€ Tag vocabulary â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   "Best for â€¦" tags describe the customer's situation and drive the filter
   bar. The rest describe the design itself. */
export const USE_CASE_TAGS = [
  "Best for Mobile",
  "Best for Sharing",
  "Corporate Gifting",
  "Multi-event",
] as const;

export const STYLE_TAGS = [
  "Illustrated",
  "Premium Design",
  "Scroll Experience",
  "Interactive",
  "Live Countdown",
  "Unique Experience",
  "Destination Wedding",
] as const;

export type FilterDef = { id: string; label: string };

export const FILTERS: FilterDef[] = [
  { id: "All", label: "All" },
  ...USE_CASE_TAGS.map((t) => ({ id: t as string, label: t as string })),
  ...STYLE_TAGS.map((t) => ({ id: t as string, label: t as string })),
];

/* â”€â”€ The designs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export const WEDDING_DEMOS: DemoCardData[] = [
  {
    id: "demo-trial",
    badge: "Best Seller",
    badgeStyle: "bestseller",
    type: "Premium",
    title: "The Wedding Note",
    description: "Wax-seal envelope opener, 3D flip event cards, photo carousel, digit-flip countdown.",
    price: "₹1,299",
    demoSrc: "/demos/wedding-note/index.html",
    previewImg: "/assets/demos/trial.webp?v=opened-20261026",
    previewBg: "linear-gradient(145deg, #6b3a4a 0%, #8eafbe 50%, #c99eae 100%)",
    previewAccent: "#8eafbe",
    tags: [
      "Best for Mobile",
      "Corporate Gifting",
      "Multi-event",
      "Premium Design",
    ],
    category: "Wedding",
  },
  {
    id: "demo-3",
    badge: "Royal",
    badgeStyle: "ookind",
    type: "Illustrated",
    title: "Rajwada Royale",
    description: "Royal purple and gold — Marathi heritage, 3D flip cards.",
    price: "₹1,299",
    demoSrc: "/demos/rajwada-royale/index.html",
    previewImg: "/assets/demos/demo-3.webp?v=opened-20261026",
    previewBg: "linear-gradient(145deg, #0F0720 0%, #1e0a4e 50%, #2D1B69 100%)",
    previewAccent: "#1e0a4e",
    tags: [
      "Corporate Gifting",
      "Best for Mobile",
      "Multi-event",
      "Illustrated",
      "Premium Design",
    ],
    category: "Wedding",
  },
  {
    id: "wedding-invite-7",
    badge: "Celestial Story",
    badgeStyle: "ookind",
    type: "Premium",
    title: "Moonlit Palace",
    description: "Ganesh-seal opening, a moonlit scroll journey, five celebrations.",
    price: "₹1,299",
    demoSrc: "/demos/moonlit-palace/index.html",
    previewImg: "/assets/demos/wedding-invite-7-501.webp?v=opened-20261026",
    previewBg: "linear-gradient(145deg, #0c091b 0%, #2b1b3a 52%, #355f58 100%)",
    previewAccent: "#e6c97c",
    tags: [
      "Premium for Corporate Weddings",
      "Best for Mobile Sharing",
      "Multi-event",
      "Premium Design",
      "Live Countdown",
    ],
    category: "Wedding",
  },
  {
    id: "demo-1",
    badge: "Popular",
    badgeStyle: "popular",
    type: "Classic",
    title: "Lantern Dreams",
    description: "Floating lanterns, animated name reveal, live countdown.",
    price: "₹1,299",
    demoSrc: "/demos/lantern-dreams/index.html",
    previewImg: "/assets/demos/demo-1.webp?v=opened-20261026",
    previewBg: "linear-gradient(145deg, #072e32 0%, #0a4e52 50%, #0e6e72 100%)",
    previewAccent: "#0a4e52",
    tags: ["Corporate Gifting", "Best for Mobile Sharing", "Multi-event", "Live Countdown"],
    category: "Wedding",
  },
  {
    /* The id used to be "demo-8" even though the card points at the demo-16
       build — demo-16 replaced demo-8. Any lookup by id therefore missed it
       and the card silently vanished from the intent pages. */
    id: "demo-16",
    badge: "One of a Kind",
    badgeStyle: "ookind",
    type: "Illustrated",
    title: "Rajwada Royale: Emerald Edition",
    description: "An illustrated Marathi wedding invitation with a wax-seal opening and a cinematic emerald-and-gold celebration.",
    price: "₹1,299",
    demoSrc: "/demos/demo-16/index.html",
    previewImg: "/assets/demos/demo-16.webp?v=opened-20261026",
    previewBg: "linear-gradient(145deg, #0F0720 0%, #1e0a4e 50%, #2D1B69 100%)",
    previewAccent: "#1e0a4e",
    tags: [
      "Family-Friendly",
      "Most Personalised",
      "Multi-event",
      "Illustrated",
      "Premium Design",
    ],
    category: "Wedding",
  },
  {
    id: "demo-15-mountain",
    badge: "NEW",
    badgeStyle: "new",
    type: "Destination",
    title: "Mountain Sunrise",
    description: "Scroll midnight to sunrise. Three events, three skies.",
    price: "₹1,299",
    demoSrc: "/demos/demo-15-mountain/index.html",
    previewImg: "/assets/demos/demo-15-mountain-502.webp?v=opened-20261026",
    previewBg: "linear-gradient(145deg, #0a0f1e 0%, #4a2060 45%, #f07030 100%)",
    previewAccent: "#f5c060",
    tags: [
      "Best for Mobile",
      "Multi-event",
      "Premium Design",
      "Scroll Experience",
      "Live Countdown",
      "Destination Wedding",
    ],
    category: "Wedding",
  },
];

export const SAVE_THE_DATE_DEMOS: DemoCardData[] = [
  {
    id: "save-the-date-1",
    badge: "Petal Bloom",
    badgeStyle: "popular",
    type: "Save the Date",
    title: "Petal Ring Reveal",
    description: "A ring of rose petals blooms open to reveal the date as you scroll — no tapping needed.",
    price: "₹599",
    priceUnit: "/ save the date",
    demoSrc: "/demos/save-the-date-1/index.html",
    previewImg: "/assets/demos/save-the-date-1.webp?v=opened-20261026",
    previewBg: "linear-gradient(145deg, #4b2e1a 0%, #7A1021 50%, #355f58 100%)",
    previewAccent: "#7A1021",
    tags: [
      "Best for Mobile",
      "Best for Sharing",
      "Scroll Experience",
      "Unique Experience",
      "Live Countdown",
    ],
    category: "Save the Date",
  },
  {
    id: "save-the-date-mountain",
    badge: "NEW",
    badgeStyle: "new",
    type: "Save the Date",
    title: "Mountain Sunrise",
    description: "Midnight to sunrise. Three events, three skies.",
    price: "₹599",
    priceUnit: "/ save the date",
    demoSrc: "/demos/save-the-date-mountain/index.html",
    previewImg: "/assets/demos/save-the-date-mountain.webp?v=opened-20261026",
    previewBg: "linear-gradient(145deg, #0a0f1e 0%, #4a2060 45%, #f07030 100%)",
    previewAccent: "#f5c060",
    tags: [
      "Best for Mobile",
      "Best for Sharing",
      "Scroll Experience",
      "Live Countdown",
      "Destination Wedding",
    ],
    category: "Save the Date",
  },
];

export const PROPOSAL_DEMOS: DemoCardData[] = [
  {
    id: "proposal-1",
    badge: "Mischievous",
    badgeStyle: "latest",
    type: "Proposal Page",
    title: "Do You Love Me?",
    description: "The No button runs away. Only Yes stays.",
    price: "₹499",
    priceUnit: "/ page",
    demoSrc: "/demos/demo-10/index.html",
    previewImg: "/assets/demos/proposal-preview-1.webp",
    previewBg: "linear-gradient(145deg, #0a0010 0%, #3d0020 50%, #6b0035 100%)",
    previewAccent: "#6b0035",
    tags: ["Best for Mobile", "Interactive", "Unique Experience"],
    category: "Proposal",
  },
  {
    id: "proposal-3",
    badge: "Hacker",
    badgeStyle: "new",
    type: "Proposal Page",
    title: "LoveOS Terminal",
    description: "Boots like a terminal. Matrix rain, typewriter, stats.",
    price: "₹499",
    priceUnit: "/ page",
    demoSrc: "/demos/demo-12/index.html",
    previewImg: "/assets/demos/proposal-preview-3.webp",
    previewBg: "linear-gradient(145deg, #020c06 0%, #040f08 50%, #020c06 100%)",
    previewAccent: "#004422",
    tags: ["Best for Mobile", "Interactive", "Unique Experience"],
    category: "Proposal",
  },
  {
    id: "proposal-4",
    badge: "Memory Jar",
    badgeStyle: "premium",
    type: "Proposal Page",
    title: "A Jar of Memories",
    description: "Tap the jar. Five folded memories, one by one.",
    price: "₹499",
    priceUnit: "/ page",
    demoSrc: "/demos/demo-13/index.html",
    previewImg: "/assets/demos/proposal-preview-4.webp?v=opened-20261026",
    previewBg: "linear-gradient(145deg, #FFF8F0 0%, #FFF4E8 50%, #FFF0EC 100%)",
    previewAccent: "#f5e0c0",
    tags: ["Best for Mobile", "Interactive", "Unique Experience"],
    category: "Proposal",
  },
];

/* Shown on /proposals but not on the home page. */
export const PROPOSAL_EXTRA_DEMOS: DemoCardData[] = [
  {
    id: "proposal-6",
    badge: "5 Experiences",
    badgeStyle: "premium",
    type: "Proposal Page",
    title: "Our Journey Together",
    description: "Five concepts in one link â€” terminal to love letter.",
    price: "₹499",
    priceUnit: "/ page",
    demoSrc: "/demos/proposal-journey/index.html",
    previewImg: "/assets/demos/proposal-preview-6.webp",
    previewBg: "linear-gradient(145deg, #1a0a2e 0%, #4C1D95 50%, #6b0035 100%)",
    previewAccent: "#a855f7",
    tags: ["Best for Mobile", "Interactive", "Unique Experience"],
    category: "Proposal",
  },
  {
    id: "proposal-7",
    badge: "Heart Flow",
    badgeStyle: "new",
    type: "Proposal Page",
    title: "Floating Hearts Journey",
    description: "Heart-shaped particles, seven chapters, one big question.",
    price: "₹499",
    priceUnit: "/ page",
    demoSrc: "/demos/floating-hearts/index.html",
    previewImg: "/assets/demos/proposal-preview-7.webp?v=opened-20261026",
    previewBg: "linear-gradient(145deg, #fff8f9 0%, #fef2f7 50%, #fde8f3 100%)",
    previewAccent: "#ff4b6e",
    tags: [
      "Best for Mobile",
      "Best for Sharing",
      "Interactive",
      "Unique Experience",
    ],
    category: "Proposal",
  },
];

export const MEMORY_DEMOS: {
  familyStory: DemoCardData[];
  weddingMemories: DemoCardData[];
  timeCapsule: DemoCardData[];
} = {
  familyStory: [
    {
      id: "memories-family-story",
      badge: "Heirloom",
      badgeStyle: "popular",
      type: "Family Story",
      title: "The Family Archive",
      description: "A living chronicle of the people, places and little rituals that make a family.",
      price: "₹1,299",
      priceUnit: "/ experience",
      demoSrc: "/demos/memories-family-story/index.html",
      previewImg: "/assets/demos/memories-family-story.webp?v=memories-six-20261026",
      tags: ["Stories & Voices", "Made for Family"],
      category: "Memories",
    },
    {
      id: "memories-family-story-3",
      badge: "Interactive",
      badgeStyle: "new",
      type: "Family Story",
      title: "The Family Tree",
      description: "Explore generations, discover each person and hear the stories behind their names.",
      price: "₹1,299",
      priceUnit: "/ experience",
      demoSrc: "/demos/memories-family-story-3/index.html",
      previewImg: "/assets/demos/memories-family-story-3.webp?v=memories-six-20261026",
      tags: ["Interactive", "Generations"],
      category: "Memories",
    },
  ],
  weddingMemories: [
    {
      id: "memories-wedding-memories",
      badge: "Guestbook",
      badgeStyle: "popular",
      type: "Wedding Memories",
      title: "The Wedding Guestbook",
      description: "Real celebration photos, heartfelt wishes and voice notes from every function.",
      price: "₹1,299",
      priceUnit: "/ experience",
      demoSrc: "/demos/memories-wedding-memories/index.html",
      previewImg: "/assets/demos/memories-wedding-memories.webp?v=wedding-reel-20261027",
      tags: ["Photos & Voice Notes", "By Celebration"],
      category: "Memories",
    },
    {
      id: "memories-wedding-memories-3",
      badge: "35mm",
      badgeStyle: "premium",
      type: "Wedding Memories",
      title: "The Wedding Film Roll",
      description: "A cinematic contact sheet that turns candid moments into a keepsake reel.",
      price: "₹1,299",
      priceUnit: "/ experience",
      demoSrc: "/demos/memories-wedding-memories-3/index.html",
      previewImg: "/assets/demos/memories-wedding-memories-3.webp?v=film-roll-20261027",
      tags: ["Film Aesthetic", "Tap to Open"],
      category: "Memories",
    },
  ],
  timeCapsule: [
    {
      id: "memories-time-capsule",
      badge: "Future Letter",
      badgeStyle: "new",
      type: "Time Capsule",
      title: "Letters to Tomorrow",
      description: "Write a message for a milestone, seal it away and let the chosen day reveal it.",
      price: "₹0",
      priceUnit: "demo",
      demoSrc: "/demos/memories-time-capsule/index.html",
      previewImg: "/assets/demos/memories-time-capsule.webp?v=memories-six-20261026",
      tags: ["Choose the Open Date", "Personal"],
      category: "Memories",
    },
    {
      id: "memories-time-capsule-3",
      badge: "Wax-Sealed",
      badgeStyle: "premium",
      type: "Time Capsule",
      title: "The Heirloom Letter Box",
      description: "Open a keepsake box of handwritten letters, sealed for the people and days ahead.",
      price: "₹0",
      priceUnit: "demo",
      demoSrc: "/demos/memories-time-capsule-3/index.html",
      previewImg: "/assets/demos/memories-time-capsule-3.webp?v=memories-six-20261026",
      tags: ["Tactile Reveal", "Letters for Later"],
      category: "Memories",
    },
  ],
};

/* â”€â”€ Counts used across the site â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export const ALL_FILTERABLE_DEMOS: DemoCardData[] = [
  ...WEDDING_DEMOS,
  ...SAVE_THE_DATE_DEMOS,
  ...PROPOSAL_DEMOS,
];

/** Designs that can be filtered (memories live on their own pages). */
export const FILTERABLE_COUNT = ALL_FILTERABLE_DEMOS.length;

/** How many designs carry a given tag. */
export function countByTag(tag: string): number {
  return ALL_FILTERABLE_DEMOS.filter((d) => d.tags.includes(tag)).length;
}

/** Filters that at least one card actually carries. */
export function activeFilters() {
  return FILTERS.filter((f) => f.id === "All" || countByTag(f.id) > 0);
}

/* â”€â”€ Which designs to show on an intent page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   The 21 keyword landing pages used to render a hand-drawn fake browser
   chrome that said "Your wedding website". They now show the real designs
   that match the visitor's intent, with the live preview available. */
const byId = new Map(
  ALL_FILTERABLE_DEMOS.map((d) => [d.id, d]),
);

function pick(...ids: string[]): DemoCardData[] {
  return ids.map((id) => {
    const card = byId.get(id);
    /* A missing id used to be dropped silently, which is how the demo-16
       card disappeared from the intent pages without a single error. */
    if (!card && process.env.NODE_ENV !== "production") {
      console.warn(`[demos] no card with id "${id}" — check demosForSlug()`);
    }
    return card;
  }).filter((d): d is DemoCardData => Boolean(d));
}

export function demosForSlug(slug: string): DemoCardData[] {
  const s = slug.toLowerCase();

  if (s.includes("proposal") || s.includes("marry-me")) {
    return pick("proposal-1", "proposal-3", "proposal-4");
  }
  if (s.includes("save-the-date")) {
    return pick("save-the-date-1", "save-the-date-mountain");
  }
  if (s.includes("destination")) {
    return pick("demo-15-mountain", "wedding-invite-7", "save-the-date-mountain");
  }
  if (s.includes("marathi")) {
    return pick("demo-3", "demo-16", "demo-1");
  }
  if (s.includes("hindi")) {
    return pick("demo-1", "demo-3", "demo-16");
  }
  if (s.includes("whatsapp")) {
    return pick("demo-trial", "wedding-invite-7", "demo-15-mountain");
  }
  if (s.includes("rsvp")) {
    return pick("wedding-invite-7", "demo-1", "demo-trial");
  }
  if (s.includes("mehendi") || s.includes("engagement") || s.includes("reception")) {
    return pick("demo-16", "wedding-invite-7", "demo-3");
  }
  if (s.includes("cost")) {
    return pick("demo-1", "demo-trial", "wedding-invite-7");
  }
  if (s.includes("video")) {
    return pick("demo-15-mountain", "demo-16", "demo-trial");
  }
  if (s.includes("pune") || s.includes("mumbai") || s.includes("delhi") || s.includes("bangalore")) {
    return pick("demo-1", "demo-16", "wedding-invite-7");
  }
  return pick("demo-1", "wedding-invite-7", "demo-16");
}
