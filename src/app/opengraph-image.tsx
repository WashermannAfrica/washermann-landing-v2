import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE, BRAND_GREEN, BRAND_MINT } from "@/lib/seo";

// Site-wide social share image (1200×630). Rendered dynamically so we never
// have to ship/maintain a static asset, and it stays on-brand. Used for the
// home page and any route without its own opengraph-image.
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: BRAND_GREEN,
          padding: "80px",
        }}
      >
        <div
          style={{
            color: BRAND_MINT,
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          {SITE_NAME.toUpperCase()}
        </div>
        <div
          style={{
            color: "white",
            fontSize: 84,
            fontWeight: 800,
            lineHeight: 1.05,
            marginTop: 24,
            maxWidth: 900,
          }}
        >
          {SITE_TAGLINE}
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: 32,
            marginTop: 28,
            maxWidth: 900,
          }}
        >
          Nigeria&apos;s premium on-demand laundry — pickup, track, delivered fresh.
        </div>
      </div>
    ),
    { ...size }
  );
}
