import type { MetadataRoute } from "next";
import { SITE_URL, intentPages } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const homeImages = [
    "/assets/demos/demo-1.webp",
    "/assets/demos/demo-16.webp",
    "/assets/demos/wedding-invite-7-501.webp",
    "/assets/demos/demo-15-mountain-502.webp",
  ].map((path) => `${SITE_URL}${path}`);

  const core: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
      images: homeImages,
    },
    {
      url: `${SITE_URL}/proposals`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/save-the-date`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    /* The memories routes are marked index:true in their own metadata, so
       they have to be listed here too. */
    {
      url: `${SITE_URL}/memories`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/memories/family-story`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/memories/family-moments`,
      changeFrequency: "monthly",
      priority: 0.7,
      images: [`${SITE_URL}/demos/family-moments/images/newborn.webp`],
    },
    {
      url: `${SITE_URL}/memories/wedding-memories`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/memories/time-capsule`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const intent: MetadataRoute.Sitemap = intentPages.map((page) => ({
    url: `${SITE_URL}/${page.slug}`,
    changeFrequency: page.slug === "wedding-invitation-cost-india" ? "monthly" : "weekly",
    priority: page.slug === "wedding-invitation-website-india" ? 0.95 : 0.8,
  }));

  return [...core, ...intent];
}
