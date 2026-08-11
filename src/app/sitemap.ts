import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://ai-enablement-handoff-lab.vercel.app",
      lastModified: "2026-08-11",
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://ai-enablement-handoff-lab.vercel.app/handoff",
      lastModified: "2026-08-11",
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
