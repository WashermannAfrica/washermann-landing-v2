import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogArticle from "@/components/blog/BlogArticle";
import { getPreview } from "@/lib/blog";

// Reviewer preview of the DRAFT copy — never cached, never indexed.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Draft preview — Washermann",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ token?: string }> };

export default async function BlogPreviewPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { token } = await searchParams;
  const post = token ? await getPreview(id, token) : null;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <div className="bg-wm-green pb-10 pt-28" />

      <main className="flex-1 pt-8">
        {!post ? (
          <p className="px-6 py-24 text-center text-gray-500">
            This preview link is invalid or has expired. Mint a fresh one from the admin editor.
          </p>
        ) : (
          <>
            <p className="mx-auto mb-8 max-w-3xl px-6">
              <span className="block rounded-2xl bg-wm-cream px-4 py-3 text-center font-body text-sm font-semibold text-wm-green">
                Draft preview — this is not published. Readers cannot see it.
              </span>
            </p>
            <BlogArticle post={post} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
