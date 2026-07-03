import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogArticle from "@/components/blog/BlogArticle";
import BlogCard from "@/components/blog/BlogCard";
import { getPost, getRelated } from "@/lib/blog";

// force-dynamic: renders per request, same as the preview route. Chosen after
// Turbopack's ISR response cache corrupted for this route in dev ("require is
// not defined" replayed from a poisoned in-memory entry — only a server
// restart clears it). A post render is one cheap indexed API read either way.
export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://washermann.com";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found — Washermann" };

  const title = post.seoTitle || `${post.title} — Washermann Blog`;
  const description = post.seoDescription || post.excerpt || undefined;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/blog/${post.slug}`,
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
    },
    twitter: {
      card: post.coverImageUrl ? "summary_large_image" : "summary",
      title,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = await getRelated(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.coverImageUrl || undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Person", name: post.author.name },
    publisher: { "@type": "Organization", name: "Washermann", url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      {/* Dark band so the fixed navbar reads correctly, then the article */}
      <div className="bg-wm-green pb-10 pt-28">
        <p className="text-center">
          <Link href="/blog" className="font-body text-sm text-white/60 transition-colors hover:text-wm-mint">
            ← All posts
          </Link>
        </p>
      </div>

      <main className="flex-1 pt-12">
        <BlogArticle post={post} />

        {related.length > 0 && (
          <section className="border-t border-gray-100 bg-wm-gray/60 px-6 py-14">
            <div className="mx-auto max-w-6xl">
              <h2 className="font-display text-2xl font-bold text-wm-green">More like this</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <BlogCard key={p.slug} post={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
