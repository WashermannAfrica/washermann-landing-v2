import { ImageResponse } from "next/og";
import { getPost } from "@/lib/blog";
import { SITE_NAME, BRAND_GREEN, BRAND_MINT } from "@/lib/seo";

// Per-post share image. Only used when a post has NO coverImageUrl (when it
// does, generateMetadata sets openGraph.images to the cover, which wins). This
// guarantees every shared post has a branded, title-bearing 1200×630 card.
export const alt = "Washermann Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Params = { params: Promise<{ slug: string }> };

export default async function PostOgImage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug).catch(() => null);
  const title = post?.title ?? "Washermann Blog";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: BRAND_GREEN,
          padding: "72px",
        }}
      >
        <div style={{ color: BRAND_MINT, fontSize: 30, fontWeight: 700, letterSpacing: "0.04em" }}>
          {SITE_NAME.toUpperCase()} · BLOG
        </div>
        <div
          style={{
            color: "white",
            fontSize: title.length > 80 ? 56 : 72,
            fontWeight: 800,
            lineHeight: 1.08,
            display: "flex",
          }}
        >
          {title}
        </div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 28 }}>
          washermann.com/blog
        </div>
      </div>
    ),
    { ...size }
  );
}
