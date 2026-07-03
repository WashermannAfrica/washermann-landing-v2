import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/blog/BlogCard";
import { getPosts } from "@/lib/blog";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog — Washermann",
  description:
    "Laundry tips, product updates, and stories from the team building Nigeria's smartest laundry service.",
};

export default async function BlogIndexPage() {
  const { posts } = await getPosts(1);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      {/* Dark header band (the fixed navbar sits on top of it) */}
      <section className="bg-wm-green px-6 pb-16 pt-36 text-center">
        <h1 className="font-display text-4xl font-bold text-wm-mint sm:text-5xl">The Washermann Blog</h1>
        <p className="mx-auto mt-4 max-w-xl font-body text-white/70">
          Laundry wisdom, product updates, and stories from the team.
        </p>
      </section>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14">
        {posts.length === 0 ? (
          <p className="py-20 text-center text-gray-400">Fresh stories are on the way — check back soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
