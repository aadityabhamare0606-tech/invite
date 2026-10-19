/**
 * Single source of truth for SEO landing pages.
 *
 * Every entry becomes a real, crawlable page at `/<slug>` (see
 * `app/[slug]/page.tsx`), is listed in the sitemap, links to related pages and
 * carries its own Service + BreadcrumbList + FAQPage structured data.
 *
 * The slugs are chosen to match what people actually type into Google when
 * they are looking for a digital invitation — format ("digital", "online"),
 * occasion ("save the date", "proposal"), sharing ("WhatsApp"), language
 * ("Marathi", "Hindi"), destination and city intents.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://our-moments.in";

export type IntentFaq = { q: string; a: string };

export type IntentPage = {
  slug: string;
  /** Used as the <h1>, the <title> (template adds · OurMoment) and schema name. */
  title: string;
  /** Meta description — kept under ~160 characters. */
  description: string;
  eyebrow: string;
  price: string;
  intro: string;
  points: string[];
  faqs: IntentFaq[];
  related: string[];
  keywords: string[];
};

export const intentPages: IntentPage[] = [
  {
    slug: "wedding-invitation-website-india",
    title: "Wedding Invitation Website India",
    description:
      "Create a personalised wedding invitation website in India with your events, venue, photos, RSVP and one WhatsApp-ready link from ₹1,499.",
    eyebrow: "Digital wedding invitations",
    price: "₹1,499",
    intro:
      "A beautiful wedding website for every ceremony, guest and family member — designed in India and delivered as one link.",
    points: [
      "Mehendi, Haldi, Sangeet and Reception details on one page",
      "Venue, map, gallery, love story and RSVP in one shareable link",
      "Mobile-first design made for sharing with family on WhatsApp",
    ],
    faqs: [
      {
        q: "What is a wedding invitation website?",
        a: "It is a personalised mobile website for your wedding — your names, date, events, venue, photos, story and RSVP — that guests open with a single link. No app and no login needed.",
      },
      {
        q: "How much does a wedding invitation website cost in India?",
        a: "OurMoment wedding invitation websites start at ₹1,499, which includes personalisation with your details and delivery of your live link.",
      },
      {
        q: "Can the website include every function?",
        a: "Yes. Mehendi, Haldi, Sangeet, Wedding and Reception can each have their own card with its own date, time and venue.",
      },
    ],
    related: [
      "digital-wedding-invitation-india",
      "wedding-invitation-video-india",
      "wedding-invitation-cost-india",
    ],
    keywords: [
      "wedding invitation website India",
      "online wedding invitation India",
      "digital wedding invite India",
      "Indian wedding website",
    ],
  },
  {
    slug: "digital-wedding-invitation-india",
    title: "Digital Wedding Invitation India",
    description:
      "A digital wedding invitation for Indian weddings — animated, personalised and shareable in one link from ₹1,499. No printing, no courier, no waiting.",
    eyebrow: "Digital invitations",
    price: "₹1,499",
    intro:
      "Skip printing and couriers. A digital wedding invitation reaches every guest instantly and stays up to date in real time.",
    points: [
      "Eco-friendly and instant — no printing, postage or lost cards",
      "Editable anytime: change a venue or timing and guests see it live",
      "Opens on every phone, tablet and desktop with nothing to install",
    ],
    faqs: [
      {
        q: "Is a digital invitation suitable for elders in the family?",
        a: "Yes. It opens like a normal web page with large, readable text and clear buttons, so parents and grandparents can use it easily.",
      },
      {
        q: "Can we also print a card?",
        a: "Many families pair a digital invite with a small printed card. We design the digital version and you can print matching details from it.",
      },
      {
        q: "How do guests receive the invitation?",
        a: "You share one link on WhatsApp, Instagram or email. Guests tap it and the full invitation opens in a second.",
      },
    ],
    related: [
      "wedding-invitation-website-india",
      "online-wedding-invitation-india",
      "whatsapp-wedding-invitation",
    ],
    keywords: [
      "digital wedding invitation India",
      "digital wedding card India",
      "e invitation for wedding India",
      "paperless wedding invitation",
    ],
  },
  {
    slug: "online-wedding-invitation-india",
    title: "Online Wedding Invitation India",
    description:
      "Send an online wedding invitation that opens instantly on any phone — personalised with your names, events, venue and RSVP from ₹1,499.",
    eyebrow: "Online invitations",
    price: "₹1,499",
    intro:
      "An online wedding invitation lives on a link you own — always available, always current and effortless for your guests.",
    points: [
      "One link hosts your whole wedding — events, venue, story and gallery",
      "Guests can RSVP, see the map and add events to their calendar",
      "Nothing to download — it opens in the browser in a second",
    ],
    faqs: [
      {
        q: "Do guests need an app to open an online invitation?",
        a: "No. The invitation is a web page, so it opens in any browser on any phone with a single tap.",
      },
      {
        q: "Can I update the invitation after sharing it?",
        a: "Yes. If a timing or venue changes, we update it and every guest sees the new details on the same link.",
      },
      {
        q: "Will it work if the network is slow?",
        a: "The page is lightweight and loads quickly even on a slow 3G connection.",
      },
    ],
    related: [
      "wedding-invitation-website-india",
      "digital-wedding-invitation-india",
      "wedding-website-with-rsvp-india",
    ],
    keywords: [
      "online wedding invitation India",
      "online shaadi invitation",
      "web wedding invitation India",
      "wedding invitation link India",
    ],
  },
  {
    slug: "wedding-invitation-video-india",
    title: "Wedding Invitation Video India",
    description:
      "Order a personalised Indian wedding invitation video for WhatsApp and Instagram. Elegant animated designs, fast delivery and direct support from OurMoment.",
    eyebrow: "Wedding invitation videos",
    price: "₹399",
    intro:
      "Turn your wedding details into a shareable invitation video guests remember and forward to family.",
    points: [
      "Personalised names, dates, venues and ceremonies",
      "Designed for WhatsApp Status, chats and Instagram",
      "Fast, lightweight video delivery with direct support",
    ],
    faqs: [
      {
        q: "How much does a wedding invitation video cost?",
        a: "OurMoment wedding invitation videos start at ₹399, personalised with your names, dates and events.",
      },
      {
        q: "Can I send the video on WhatsApp?",
        a: "Yes. Most videos are kept small enough to send directly in a WhatsApp chat, and they look great on Status too.",
      },
      {
        q: "Do you offer both a video and a website?",
        a: "Yes. Many couples order a video for quick sharing and a full wedding website for all the details.",
      },
    ],
    related: [
      "animated-wedding-invitation-video",
      "whatsapp-wedding-invitation",
      "wedding-invitation-cost-india",
    ],
    keywords: [
      "wedding invitation video India",
      "shaadi invitation video",
      "wedding invite video WhatsApp",
      "animated wedding invitation video",
    ],
  },
  {
    slug: "animated-wedding-invitation-video",
    title: "Animated Wedding Invitation Video",
    description:
      "Animated wedding invitation videos for Indian weddings — your names, dates and events in motion, ready for WhatsApp Status, from ₹399.",
    eyebrow: "Animated invitation videos",
    price: "₹399",
    intro:
      "Movement makes people watch. An animated invitation video turns your details into a short film guests actually finish.",
    points: [
      "Smooth animated reveals of your names, date and venue",
      "Sized for WhatsApp Status, chats and Instagram",
      "Delivered as a lightweight file that sends easily",
    ],
    faqs: [
      {
        q: "How long is the video?",
        a: "Most invitation videos run 20 to 40 seconds — long enough to tell the story and short enough to watch fully on WhatsApp.",
      },
      {
        q: "Can I use my own photos and music?",
        a: "Yes. Send your photos and preferred track, or ask us to suggest one, and we build the video around them.",
      },
      {
        q: "Can the video be in Hindi or Marathi?",
        a: "Yes. Tell us the language your family prefers and we will set the text and voice accordingly.",
      },
    ],
    related: [
      "wedding-invitation-video-india",
      "whatsapp-wedding-invitation",
      "wedding-invitation-cost-india",
    ],
    keywords: [
      "animated wedding invitation video",
      "animated shaadi invitation",
      "wedding invitation animation India",
      "invitation video maker India",
    ],
  },
  {
    slug: "whatsapp-wedding-invitation",
    title: "WhatsApp Wedding Invitation",
    description:
      "A WhatsApp wedding invitation that opens instantly when you share the link — personalised with events, venue, map and RSVP from ₹1,499.",
    eyebrow: "Built for WhatsApp",
    price: "₹1,499",
    intro:
      "Your invitation should be as easy to send as a message. Share one link and every guest holds the full wedding.",
    points: [
      "One tap to share with a family group — no attachments needed",
      "Opens instantly in the WhatsApp browser, no app or login",
      "Includes map, RSVP and event timings so nobody has to ask",
    ],
    faqs: [
      {
        q: "Will the link preview look good on WhatsApp?",
        a: "Yes. We set the title, description and preview image so a shared link shows your wedding name and a beautiful thumbnail.",
      },
      {
        q: "Can guests RSVP from WhatsApp?",
        a: "They tap the link and RSVP on your invitation page, so every reply reaches you in one place.",
      },
      {
        q: "Does it work on a slow connection?",
        a: "Yes. The invitation is lightweight and opens quickly even on a weak network.",
      },
    ],
    related: [
      "wedding-invitation-website-india",
      "digital-wedding-invitation-india",
      "wedding-website-with-rsvp-india",
    ],
    keywords: [
      "WhatsApp wedding invitation India",
      "wedding invitation link WhatsApp",
      "send wedding invite WhatsApp",
      "shaadi invitation card WhatsApp",
    ],
  },
  {
    slug: "save-the-date-website-india",
    title: "Save The Date Website India",
    description:
      "Share your wedding date early with a personalised save the date website in India — your story, date, countdown and a simple mobile-friendly link.",
    eyebrow: "Save the date websites",
    price: "₹789",
    intro:
      "Give family and friends a beautiful first look at the date that matters, months before the wedding.",
    points: [
      "Your names, wedding date and a live countdown",
      "A simple mobile page guests can open instantly",
      "Perfect for sharing months before the wedding",
    ],
    faqs: [
      {
        q: "When should we send a save the date?",
        a: "For weddings with outstation guests, send it six to twelve months ahead. For local weddings, three to six months works well.",
      },
      {
        q: "What is the difference between save the date and the invitation?",
        a: "A save the date announces the date early so guests can plan. The full invitation later carries events, venue, timings and RSVP.",
      },
      {
        q: "Can guests RSVP on the save the date?",
        a: "Yes. A simple RSVP can be included so you can estimate the guest list early.",
      },
    ],
    related: [
      "wedding-invitation-website-india",
      "destination-wedding-invitation-website",
      "wedding-invitation-video-india",
    ],
    keywords: [
      "save the date website India",
      "save the date card digital",
      "wedding date announcement India",
      "save the date invitation online",
    ],
  },
  {
    slug: "wedding-invitation-cost-india",
    title: "Wedding Invitation Cost India",
    description:
      "See the cost of a digital wedding invitation website and video in India. OurMoment websites start at ₹1,499 and invitation videos start at ₹399.",
    eyebrow: "Simple, transparent pricing",
    price: "From ₹399",
    intro:
      "Choose the format that fits your wedding, guest list and budget — with no hidden charges.",
    points: [
      "Wedding invitation website: from ₹1,499",
      "Wedding invitation video: from ₹399",
      "Save the date website: from ₹789",
    ],
    faqs: [
      {
        q: "Is delivery included in the price?",
        a: "Yes. The price covers design, personalisation and delivery of your live link or video file.",
      },
      {
        q: "Do you charge per guest?",
        a: "No. One price covers your invitation and it can be shared with as many guests as you like.",
      },
      {
        q: "How does paying work?",
        a: "Call us and we agree the design and price first. You only confirm once you are happy with the plan.",
      },
    ],
    related: [
      "wedding-invitation-website-india",
      "wedding-invitation-video-india",
      "save-the-date-website-india",
    ],
    keywords: [
      "wedding invitation cost India",
      "digital wedding invitation price",
      "wedding website price India",
      "online invitation cost",
    ],
  },
  {
    slug: "wedding-website-with-rsvp-india",
    title: "Wedding Website with RSVP India",
    description:
      "A wedding website with RSVP built in — guests confirm attendance, guest count and meal preference in one tap. Personalised for Indian weddings from ₹1,499.",
    eyebrow: "RSVP built in",
    price: "₹1,499",
    intro:
      "Stop chasing replies across five different chats. Every RSVP lands in one simple place you can actually use.",
    points: [
      "Guests RSVP in one tap and you see every reply together",
      "Collect guest count, side of the family and meal preference",
      "Re-share the same link any time to nudge pending guests",
    ],
    faqs: [
      {
        q: "How do RSVP replies reach me?",
        a: "Every reply is stored with your invitation, so you can view the full guest list in one place instead of scrolling through chats.",
      },
      {
        q: "Can guests update their RSVP?",
        a: "Yes. If plans change, a guest can open the same link again and update their reply.",
      },
      {
        q: "Can I ask about meals or rooms?",
        a: "Yes. Add custom questions such as meal preference, number of guests or airport pickup.",
      },
    ],
    related: [
      "wedding-invitation-website-india",
      "online-wedding-invitation-india",
      "reception-invitation-website-india",
    ],
    keywords: [
      "wedding website with RSVP India",
      "online RSVP wedding India",
      "wedding invitation with RSVP",
      "guest RSVP website wedding",
    ],
  },
  {
    slug: "marathi-wedding-invitation-website",
    title: "Marathi Wedding Invitation Website",
    description:
      "Marathi wedding invitation websites with traditional warmth — lagna patrika details, Devanagari text and your family names, from ₹1,499.",
    eyebrow: "Marathi lagna invitations",
    price: "₹1,499",
    intro:
      "A Marathi wedding invitation that feels like home — traditional motifs, Devanagari text and every ceremony your family expects.",
    points: [
      "Marathi (Devanagari) text alongside English for every guest",
      "Traditional motifs — kalash, toran and shehnai-inspired design",
      "Halad, Kelvan, Mandal and Lagna functions on their own cards",
    ],
    faqs: [
      {
        q: "Can the invitation be written in Marathi?",
        a: "Yes. We set the invitation in Marathi, English or both so that every guest can read it comfortably.",
      },
      {
        q: "Do you include the lagna patrika details?",
        a: "Yes. Muhurat timings, counters and family names can be placed exactly as they appear on a printed lagna patrika.",
      },
      {
        q: "Can it match our printed card?",
        a: "Share a photo of your printed card and we will echo its colours and motifs in the digital version.",
      },
    ],
    related: [
      "wedding-invitation-website-india",
      "hindi-wedding-invitation-website",
      "mehendi-haldi-sangeet-invitation",
    ],
    keywords: [
      "Marathi wedding invitation website",
      "lagna patrika online",
      "Marathi lagna invitation digital",
      "Marathi shaadi invitation",
    ],
  },
  {
    slug: "hindi-wedding-invitation-website",
    title: "Hindi Wedding Invitation Website",
    description:
      "Hindi wedding invitation websites with shubh vivah details, Devanagari text and animated scroll effects, personalised from ₹1,499.",
    eyebrow: "Hindi shaadi invitations",
    price: "₹1,499",
    intro:
      "Shaadi ka nimantran, in the language your family speaks and reads with ease.",
    points: [
      "Hindi (Devanagari) text with elegant English support",
      "Shubh muhurat, baraat and vidaai details on their own cards",
      "Warm, traditional design with modern scroll animations",
    ],
    faqs: [
      {
        q: "Can the whole invitation be in Hindi?",
        a: "Yes. We can set everything in Hindi, or keep key names in English while the rest is in Hindi.",
      },
      {
        q: "Can we show the shubh muhurat?",
        a: "Yes. Muhurat timings and vidhi details can sit alongside each ceremony.",
      },
      {
        q: "Is Devanagari text supported properly?",
        a: "Yes. The fonts we use render Devanagari cleanly on phones, tablets and desktops.",
      },
    ],
    related: [
      "marathi-wedding-invitation-website",
      "wedding-invitation-website-india",
      "digital-wedding-invitation-india",
    ],
    keywords: [
      "Hindi wedding invitation website",
      "shaadi ka nimantran online",
      "Hindu wedding invitation digital",
      "Hindi vivah invitation card",
    ],
  },
  {
    slug: "destination-wedding-invitation-website",
    title: "Destination Wedding Invitation Website",
    description:
      "Destination wedding invitation websites with travel, stay and itinerary details for your guests, plus RSVP. Personalised from ₹1,999.",
    eyebrow: "Destination weddings",
    price: "₹1,999",
    intro:
      "When guests travel, your invitation becomes their guide — flights, stays, schedule and everything in between.",
    points: [
      "Travel and stay details, maps and directions in one link",
      "A day-by-day itinerary so every guest knows where to be",
      "Scroll-driven tropical, mountain and palace themes",
    ],
    faqs: [
      {
        q: "Can we add hotel and travel information?",
        a: "Yes. Add recommended hotels, airport details, cab notes and a day-by-day itinerary for outstation guests.",
      },
      {
        q: "Do you have destination-style designs?",
        a: "Yes. Our collection includes mountain sunrise, palace and dusk-themed invitations designed for destination celebrations.",
      },
      {
        q: "Can guests share travel details when they RSVP?",
        a: "Yes. RSVP can include travel questions so you know who is coming and when.",
      },
    ],
    related: [
      "wedding-invitation-website-india",
      "save-the-date-website-india",
      "wedding-website-with-rsvp-india",
    ],
    keywords: [
      "destination wedding invitation website",
      "destination wedding invite India",
      "beach wedding invitation India",
      "wedding itinerary website",
    ],
  },
  {
    slug: "mehendi-haldi-sangeet-invitation",
    title: "Mehendi, Haldi & Sangeet Invitation",
    description:
      "Mehendi, Haldi and Sangeet invitation websites with a card for every function — dates, venues, dress code and RSVP in one link from ₹1,499.",
    eyebrow: "One card for every function",
    price: "₹1,499",
    intro:
      "Indian weddings are many celebrations, not one. Give every function its own beautiful card on a single link.",
    points: [
      "A dedicated card for Mehendi, Haldi, Sangeet and Reception",
      "Each card carries its own date, time, venue and dress code",
      "Guests can add every function to their calendar in one tap",
    ],
    faqs: [
      {
        q: "Can each function have a different venue?",
        a: "Yes. Every card carries its own venue and map, so guests always know where to go for that function.",
      },
      {
        q: "Can we set a dress code per function?",
        a: "Yes. You can add a colour or dress suggestion to each card — many families use yellow for Haldi and a theme for Sangeet.",
      },
      {
        q: "Can guests RSVP for individual functions?",
        a: "Yes. RSVP can be per function, so you know who is attending which celebration.",
      },
    ],
    related: [
      "wedding-invitation-website-india",
      "reception-invitation-website-india",
      "wedding-website-with-rsvp-india",
    ],
    keywords: [
      "mehendi invitation website",
      "haldi invitation online",
      "sangeet invitation India",
      "multi event wedding invitation",
    ],
  },
  {
    slug: "engagement-invitation-website-india",
    title: "Engagement Invitation Website India",
    description:
      "Engagement invitation websites with ring ceremony, roka and engagement details, your proposal story and photos from ₹1,499.",
    eyebrow: "Engagement invitations",
    price: "₹1,499",
    intro:
      "The first celebration of your life together deserves more than a forwarded image.",
    points: [
      "Ring ceremony, roka and engagement details on one page",
      "Your proposal story and photos, animated on scroll",
      "The wedding save the date can follow on the same link",
    ],
    faqs: [
      {
        q: "Can we reuse the page for the wedding later?",
        a: "Yes. Many couples start with an engagement page and expand it into the full wedding invitation as plans take shape.",
      },
      {
        q: "Can it include our proposal story?",
        a: "Absolutely. Your story and photos can be presented as an animated timeline on the page.",
      },
      {
        q: "Is it suitable for a small family function?",
        a: "Yes. It works equally well for an intimate engagement or a large celebration.",
      },
    ],
    related: [
      "proposal-website-india",
      "save-the-date-website-india",
      "wedding-invitation-website-india",
    ],
    keywords: [
      "engagement invitation website India",
      "ring ceremony invitation online",
      "roka invitation digital",
      "engagement card website",
    ],
  },
  {
    slug: "reception-invitation-website-india",
    title: "Reception Invitation Website India",
    description:
      "Reception invitation websites with venue, timings and dress code, personalised and shareable in one link from ₹1,499.",
    eyebrow: "Reception invitations",
    price: "₹1,499",
    intro:
      "Keep the reception simple to find, easy to remember and beautiful to open.",
    points: [
      "Reception date, venue and map in one clear card",
      "Dress code, menu and parking notes for guests",
      "RSVP so you can plan the headcount with confidence",
    ],
    faqs: [
      {
        q: "Can this be a standalone reception invite?",
        a: "Yes. A reception page works perfectly on its own, or as one card within a full multi-event wedding website.",
      },
      {
        q: "Can we add a menu and parking details?",
        a: "Yes. Any practical detail — menu, parking, shuttle, dress code — can be added to the page.",
      },
      {
        q: "How late can we share it?",
        a: "Because it is a link, you can share it as late as you like and update details right up to the event.",
      },
    ],
    related: [
      "wedding-invitation-website-india",
      "mehendi-haldi-sangeet-invitation",
      "wedding-website-with-rsvp-india",
    ],
    keywords: [
      "reception invitation website India",
      "reception card online",
      "wedding reception invite digital",
      "reception invitation with RSVP",
    ],
  },
  {
    slug: "proposal-website-india",
    title: "Proposal Website India",
    description:
      "Interactive proposal websites that make the moment unforgettable — playful, animated and personalised. From ₹499.",
    eyebrow: "Proposal pages",
    price: "₹499",
    intro:
      "Because the most important question deserves the most memorable moment.",
    points: [
      "Interactive experiences — escaping NO buttons, memory jars, heart trails",
      "Personalised with your names, photos and inside jokes",
      "One link she can open on her phone and keep forever",
    ],
    faqs: [
      {
        q: "What is an interactive proposal page?",
        a: "It is a small personalised web page where she clicks through your story until the big question appears — with playful details like a NO button that slides away.",
      },
      {
        q: "How do I show it to her?",
        a: "Send the private link on WhatsApp, or open it on a laptop or tablet at the moment you plan to ask.",
      },
      {
        q: "Can it be customised to our story?",
        a: "Yes. Every proposal page is personalised with your names, memories and photos.",
      },
    ],
    related: [
      "will-you-marry-me-website",
      "engagement-invitation-website-india",
      "wedding-invitation-website-india",
    ],
    keywords: [
      "proposal website India",
      "proposal page online",
      "will you marry me website",
      "interactive proposal idea",
    ],
  },
  {
    slug: "will-you-marry-me-website",
    title: "Will You Marry Me Website",
    description:
      "A 'will you marry me' website that turns the question into a moment — playful, animated and personalised. From ₹499.",
    eyebrow: "Will you marry me?",
    price: "₹499",
    intro:
      "A question this big deserves more than a text. Ask it beautifully.",
    points: [
      "A playful NO button that escapes every time she tries to tap it",
      "Your story revealed chapter by chapter as she explores",
      "Designed for the phone and ready to screenshot",
    ],
    faqs: [
      {
        q: "Can I add my own photos and messages?",
        a: "Yes. Send your photos and the words you want to say, and we build the page around them.",
      },
      {
        q: "Does it work on any phone?",
        a: "Yes. The page is mobile-first and opens instantly on any device.",
      },
      {
        q: "How quickly can it be ready?",
        a: "Most proposal pages are ready within a day.",
      },
    ],
    related: [
      "proposal-website-india",
      "engagement-invitation-website-india",
      "wedding-invitation-website-india",
    ],
    keywords: [
      "will you marry me website",
      "marry me page online",
      "proposal idea website India",
      "romantic proposal website",
    ],
  },
  {
    slug: "wedding-invitation-website-mumbai",
    title: "Wedding Invitation Website Mumbai",
    description:
      "Wedding invitation websites for Mumbai couples — personalised, animated and shareable in one link from ₹1,499. No traffic, no couriers.",
    eyebrow: "Mumbai weddings",
    price: "₹1,499",
    intro:
      "From Bandra to Borivali, one link brings your whole guest list together without the traffic.",
    points: [
      "Venue maps and parking notes for city banquet halls and hotels",
      "English, Hindi and Marathi text for a city family",
      "Perfect when guests are spread across the city and beyond",
    ],
    faqs: [
      {
        q: "Do you work with Mumbai couples remotely?",
        a: "Yes. Everything is handled over a call and messages, so you never have to travel for a meeting.",
      },
      {
        q: "Can you include Marathi and Hindi?",
        a: "Yes. Mumbai families often use all three languages, and we can mix them on one invitation.",
      },
      {
        q: "How fast can it be ready?",
        a: "Rush delivery in 24 hours is available for most designs.",
      },
    ],
    related: [
      "wedding-invitation-website-india",
      "marathi-wedding-invitation-website",
      "hindi-wedding-invitation-website",
    ],
    keywords: [
      "wedding invitation website Mumbai",
      "Mumbai wedding invitation online",
      "digital invitation Mumbai",
      "shaadi invitation Mumbai",
    ],
  },
  {
    slug: "wedding-invitation-website-pune",
    title: "Wedding Invitation Website Pune",
    description:
      "Wedding invitation websites for Pune couples — traditional Marathi warmth with modern animation, personalised from ₹1,499.",
    eyebrow: "Pune weddings",
    price: "₹1,499",
    intro:
      "Pune weddings blend tradition and ease — your invitation can do the same.",
    points: [
      "Marathi and English text with traditional Maharashtrian motifs",
      "Venue and muhurat details for every function",
      "Ideal for families spread across Pune and Maharashtra",
    ],
    faqs: [
      {
        q: "Can it include Marathi lagna patrika details?",
        a: "Yes. Muhurat timings, counters and family names can be set exactly as on a printed patrika.",
      },
      {
        q: "Do you cover Kelvan and Halad functions?",
        a: "Yes. Each function can have its own card with its own date, time and venue.",
      },
      {
        q: "Is an in-person meeting needed?",
        a: "No. Everything is handled over a call and you receive a live link to review.",
      },
    ],
    related: [
      "marathi-wedding-invitation-website",
      "wedding-invitation-website-india",
      "mehendi-haldi-sangeet-invitation",
    ],
    keywords: [
      "Pune wedding invitation website",
      "Marathi wedding invitation Pune",
      "lagna patrika Pune",
      "wedding website Pune",
    ],
  },
  {
    slug: "wedding-invitation-website-delhi",
    title: "Wedding Invitation Website Delhi",
    description:
      "Wedding invitation websites for Delhi and NCR couples — animated, multi-event and shareable in one link from ₹1,499.",
    eyebrow: "Delhi & NCR weddings",
    price: "₹1,499",
    intro:
      "For big Delhi weddings, one link replaces a hundred phone calls and lost cards.",
    points: [
      "Venue maps for farmhouses, banquet halls and five-star hotels",
      "Hindi and English text so every generation can read it",
      "Separate cards for Mehendi, Sangeet, Wedding and Reception",
    ],
    faqs: [
      {
        q: "Can it handle a big guest list?",
        a: "Yes. A single link reaches every guest and all RSVPs arrive in one place.",
      },
      {
        q: "Can it be in Hindi?",
        a: "Yes. We can set the invitation in Hindi, English or both.",
      },
      {
        q: "Can each event have its own venue?",
        a: "Yes. Mehendi, Sangeet, Wedding and Reception can each carry a separate venue and map.",
      },
    ],
    related: [
      "hindi-wedding-invitation-website",
      "wedding-invitation-website-india",
      "mehendi-haldi-sangeet-invitation",
    ],
    keywords: [
      "Delhi wedding invitation website",
      "NCR wedding invitation online",
      "Delhi shaadi invitation",
      "wedding website Delhi",
    ],
  },
  {
    slug: "wedding-invitation-website-bangalore",
    title: "Wedding Invitation Website Bangalore",
    description:
      "Wedding invitation websites for Bangalore couples — multi-language, animated and shareable in one link from ₹1,499.",
    eyebrow: "Bangalore weddings",
    price: "₹1,499",
    intro:
      "For couples who grew up across India and now call Bangalore home — one link reaches everyone.",
    points: [
      "Multi-language text for families from across the country",
      "Venue maps and timings for Bangalore halls and resorts",
      "Perfect for weddings with outstation friends and colleagues",
    ],
    faqs: [
      {
        q: "Can the page include Kannada and English?",
        a: "Yes. We can set the invitation in Kannada, English, Hindi, Tamil or Telugu — or a mix.",
      },
      {
        q: "Can we separate friend RSVPs from family?",
        a: "Yes. RSVP can include categories so you can plan seating and meals accurately.",
      },
      {
        q: "How is it delivered?",
        a: "You receive a live link to review before the wedding and can request changes any time.",
      },
    ],
    related: [
      "wedding-invitation-website-india",
      "destination-wedding-invitation-website",
      "wedding-website-with-rsvp-india",
    ],
    keywords: [
      "Bangalore wedding invitation website",
      "wedding website Bangalore",
      "online wedding invitation Bangalore",
      "wedding invitation Kannada English",
    ],
  },
];

export const intentPageMap: Record<string, IntentPage> = Object.fromEntries(
  intentPages.map((page) => [page.slug, page]),
);

export function getIntentPage(slug: string): IntentPage | undefined {
  return intentPageMap[slug];
}
