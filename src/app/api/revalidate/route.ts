import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

// Pinged by the API when a post is approved/archived so publishes go live
// immediately instead of waiting out the ISR window.
const SECRET = process.env.REVALIDATE_SECRET || "";

export async function POST(req: NextRequest) {
  if (!SECRET) return NextResponse.json({ error: "revalidation not configured" }, { status: 503 });

  const body = (await req.json().catch(() => ({}))) as { secret?: string; slug?: string };
  if (body.secret !== SECRET) return NextResponse.json({ error: "invalid secret" }, { status: 401 });

  // Tag-based: busts the fetch cache that the blog pages read through.
  // Next 16 requires a cache-life profile as the second argument; "max"
  // expires the entry immediately regardless of its configured lifetime.
  revalidateTag("blog", "max");
  if (body.slug) revalidateTag(`blog:${body.slug}`, "max");
  // Path-based: regenerates the ISR'd index page + sitemap
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  if (body.slug) revalidatePath(`/blog/${body.slug}`);

  return NextResponse.json({ revalidated: true, slug: body.slug ?? null });
}
