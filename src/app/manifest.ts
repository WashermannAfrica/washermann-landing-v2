import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION, BRAND_GREEN } from "@/lib/seo";

// PWA/web manifest — improves mobile "add to home screen", and the richer app
// identity is a positive mobile-usability signal.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — ${SITE_TAGLINE}`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: BRAND_GREEN,
    theme_color: BRAND_GREEN,
    // The favicon/app-icon is provided separately by app/icon.png (Next file
    // convention). /logo.png in public/ is the guaranteed manifest icon.
    icons: [{ src: "/logo.png", sizes: "any", type: "image/png" }],
  };
}
