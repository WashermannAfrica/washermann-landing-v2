// Server-side blog fetchers. Pages using these run with ISR (revalidate: 300)
// plus on-demand revalidation pinged by the API when a post is approved.
const API_BASE = process.env.API_URL || "http://localhost:3000/api/v1";

export interface BlogAuthor {
  name: string;
  avatarUrl: string | null;
}

export interface BlogCardData {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  tags: string[];
  readingTimeMins: number;
  publishedAt: string;
  author: BlogAuthor;
}

export interface BlogPostData extends BlogCardData {
  bodyHtml: string;
  seoTitle: string | null;
  seoDescription: string | null;
  updatedAt: string;
  preview?: boolean;
}

const REVALIDATE = 300; // seconds — publish also triggers on-demand revalidation

export async function getPosts(page = 1, tag?: string): Promise<{ posts: BlogCardData[]; pages: number }> {
  const qs = new URLSearchParams({ page: String(page), limit: "12" });
  if (tag) qs.set("tag", tag);
  try {
    const res = await fetch(`${API_BASE}/blog?${qs}`, {
      next: { revalidate: REVALIDATE, tags: ["blog"] },
    });
    if (!res.ok) return { posts: [], pages: 0 };
    const json = await res.json();
    return { posts: json.data ?? [], pages: json.meta?.pages ?? 0 };
  } catch {
    // API unreachable (e.g. during a build) — degrade to empty, revalidate later.
    return { posts: [], pages: 0 };
  }
}

export async function getPost(slug: string): Promise<BlogPostData | null> {
  try {
    const res = await fetch(`${API_BASE}/blog/${encodeURIComponent(slug)}`, {
      next: { revalidate: REVALIDATE, tags: ["blog", `blog:${slug}`] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function getRelated(slug: string): Promise<BlogCardData[]> {
  try {
    const res = await fetch(`${API_BASE}/blog/${encodeURIComponent(slug)}/related`, {
      next: { revalidate: REVALIDATE, tags: ["blog"] },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

/** Draft preview for reviewers — never cached, requires the signed token. */
export async function getPreview(id: string, token: string): Promise<BlogPostData | null> {
  const res = await fetch(
    `${API_BASE}/blog/preview/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`,
    { cache: "no-store" },
  );
  if (!res.ok) return null;
  const json = await res.json();
  return json.data ?? null;
}

export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
}
