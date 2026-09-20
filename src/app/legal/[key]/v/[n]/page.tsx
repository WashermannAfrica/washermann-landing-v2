import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PolicyBody from "@/components/legal/PolicyBody";
import { getPolicyVersion } from "@/lib/legal";

// A pinned, historical version — linked from a user's consent record. Not indexed.
export const revalidate = 300;
export const dynamicParams = true;
export const metadata: Metadata = { robots: { index: false, follow: false } };

type Params = { params: Promise<{ key: string; n: string }> };

export default async function PolicyVersionPage({ params }: Params) {
  const { key, n } = await params;
  const versionNumber = Number(n);
  if (!Number.isInteger(versionNumber) || versionNumber < 1) notFound();

  const doc = await getPolicyVersion(key, versionNumber);
  if (!doc) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div className="bg-wm-green pb-10 pt-28">
        <p className="text-center">
          <Link href={`/legal/${key}`} className="font-body text-sm text-white/60 transition-colors hover:text-wm-mint">
            ← Current version
          </Link>
        </p>
      </div>

      <main className="flex-1 pt-12">
        <div className="mx-auto mb-6 max-w-3xl px-6">
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            You are viewing a specific archived version (v{doc.versionNumber}) of this policy.{" "}
            <Link href={`/legal/${key}`} className="font-semibold underline">View the current version</Link>.
          </p>
        </div>
        <PolicyBody doc={doc} />
      </main>

      <Footer />
    </div>
  );
}
