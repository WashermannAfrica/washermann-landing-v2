import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogArticle from "@/components/blog/BlogArticle";
import BlogCard from "@/components/blog/BlogCard";
import { getPost, getPosts, getRelated } from "@/lib/blog";
import { SITE_URL, SITE_NAME, abs } from "@/lib/seo";

// ISR: statically render known posts at build, serve them from the CDN, and
// revalidate on the tag-based schedule (publish also triggers on-demand
// revalidation via /api/revalidate). Cacheable + crawler-fast, which SSR
// (force-dynamic) is not. dynamicParams lets posts created after build render
// on first request, then cache.
export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const { posts } = await getPosts(1);
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    // API unreachable at build — ship with none; all posts render on demand.
    return [];
  }
}

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
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
      types: { "application/rss+xml": `${SITE_URL}/blog/rss.xml` },
    },
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

  const url = `${SITE_URL}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt || undefined,
        image: post.coverImageUrl || abs("/logo.png"),
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: { "@type": "Person", name: post.author.name },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          logo: { "@type": "ImageObject", url: abs("/logo.png") },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
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
