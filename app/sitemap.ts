import type { MetadataRoute } from "next";
import { SITE_URL, intentPages } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const homeImages = [
    "/assets/demos/demo-1.webp",
    "/assets/demos/demo-16.webp",
    "/assets/demos/wedding-invite-7-501.webp",
    "/assets/demos/demo-15-mountain-502.webp",
  ].map((path) => `${SITE_URL}${path}`);

  const core: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      images: homeImages,
    },
    {
      url: `${SITE_URL}/proposals`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/save-the-date`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    /* The memories routes are marked index:true in their own metadata, so
       they have to be listed here too. */
    {
      url: `${SITE_URL}/memories`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/memories/family-story`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/memories/wedding-memories`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/memories/time-capsule`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const intent: MetadataRoute.Sitemap = intentPages.map((page) => ({
    url: `${SITE_URL}/${page.slug}`,
    lastModified: now,
    changeFrequency: page.slug === "wedding-invitation-cost-india" ? "monthly" : "weekly",
    priority: page.slug === "wedding-invitation-website-india" ? 0.95 : 0.8,
  }));

  return [...core, ...intent];
}
