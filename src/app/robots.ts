import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Crawl policy. Everything public is open; internal/preview and API proxy paths
// are excluded so drafts and non-content routes never get indexed. Points
// crawlers at the sitemap so new blog posts are discovered fast.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/blog/preview/", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
