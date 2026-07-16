import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://washermann.com";
const API_BASE = process.env.API_URL || "http://localhost:3000/api/v1";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.8 },
  ];

  try {
    const res = await fetch(`${API_BASE}/blog?limit=50`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const json = await res.json();
      for (const post of json.data ?? []) {
        entries.push({
          url: `${SITE_URL}/blog/${post.slug}`,
          lastModified: post.publishedAt,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  } catch {
    /* API unreachable at build — ship the static entries */
  }

  return entries;
}
