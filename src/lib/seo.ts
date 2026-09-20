// ─── Central SEO configuration ───────────────────────────────────────────────
// One place for the site's identity, default share metadata, and structured-data
// builders. Every route imports from here so titles, canonicals, OG tags and
// JSON-LD stay consistent — the single source of SEO truth.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://washermann.com"
).replace(/\/$/, "");

export const SITE_NAME = "Washermann";
export const SITE_TAGLINE = "Clean Clothes, Zero Stress";

/** Default meta description — concise, keyword-rich, benefit-led, < 160 chars. */
export const SITE_DESCRIPTION =
  "Washermann is Nigeria's premium on-demand laundry and dry-cleaning service. " +
  "Book a pickup in Lagos, track your order live, and get fresh, folded clothes delivered to your door.";

/** Primary keyword targets (intent + local). Order = rough priority. */
export const SITE_KEYWORDS = [
  "laundry service Lagos",
  "dry cleaning Lagos",
  "laundry pickup and delivery",
  "on-demand laundry Nigeria",
  "wash and fold Lagos",
  "laundromat near me",
  "Washermann",
  "affordable laundry Lagos",
  "same day laundry Lagos",
];

/** Brand colours (from tailwind.config). */
export const BRAND_GREEN = "#08523C";
export const BRAND_MINT = "#3ECFAB";

/**
 * Official social / external profiles. Used for Organization `sameAs`, which
 * strengthens brand entity signals and the Google knowledge panel.
 * TODO: replace with the real, live profile URLs before launch — wrong or dead
 * URLs here hurt more than help, so leave this empty until they're confirmed.
 */
export const SOCIAL_LINKS: string[] = [
  // "https://www.instagram.com/washermann",
  // "https://twitter.com/washermann",
  // "https://www.facebook.com/washermann",
  // "https://www.linkedin.com/company/washermann",
];

/** Absolute URL helper. */
export const abs = (path = "/"): string =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Organization structured data — the brand entity. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: abs("/logo.png"),
    description: SITE_DESCRIPTION,
    ...(SOCIAL_LINKS.length ? { sameAs: SOCIAL_LINKS } : {}),
    areaServed: { "@type": "City", name: "Lagos" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lagos",
      addressCountry: "NG",
    },
  };
}

/** WebSite structured data — enables the sitelinks search box for /blog. */
export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Service structured data — the laundry offering itself (local SEO). */
export function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Laundry and dry cleaning pickup & delivery",
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "City", name: "Lagos" },
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  };
}
