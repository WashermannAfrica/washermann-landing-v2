import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PolicyBody from "@/components/legal/PolicyBody";
import { getPolicy, listPolicies } from "@/lib/legal";
import { SITE_URL } from "@/lib/seo";

// ISR: render published policies at build, revalidate on schedule; a newly
// created policy renders on first request then caches (dynamicParams).
export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const policies = await listPolicies();
    return policies.map((p) => ({ key: p.key }));
  } catch {
    return [];
  }
}

type Params = { params: Promise<{ key: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { key } = await params;
  const doc = await getPolicy(key);
  if (!doc) return { title: "Policy not found" };
  return {
    title: doc.title,
    alternates: { canonical: `${SITE_URL}/legal/${doc.key}` },
    openGraph: { title: `${doc.title} — Washermann`, type: "article", url: `${SITE_URL}/legal/${doc.key}` },
  };
}

export default async function PolicyPage({ params }: Params) {
  const { key } = await params;
  const doc = await getPolicy(key);
  if (!doc) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div className="bg-wm-green pb-10 pt-28">
        <p className="text-center">
          <Link href="/legal" className="font-body text-sm text-white/60 transition-colors hover:text-wm-mint">
            ← All policies
          </Link>
        </p>
      </div>

      <main className="flex-1 pt-12">
        <PolicyBody doc={doc} />
      </main>

      <Footer />
    </div>
  );
}
