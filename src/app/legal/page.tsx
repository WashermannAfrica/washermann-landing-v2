import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { listPolicies } from "@/lib/legal";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Legal & Policies",
  description: "Washermann's privacy policy, terms of service, and other legal documents.",
  alternates: { canonical: `${SITE_URL}/legal` },
};

export default async function LegalIndexPage() {
  const policies = await listPolicies();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div className="bg-wm-green pb-10 pt-28">
        <h1 className="text-center font-display text-3xl font-bold text-white sm:text-4xl">Legal &amp; Policies</h1>
      </div>

      <main className="flex-1 px-6 py-14">
        <div className="mx-auto max-w-3xl">
          {policies.length === 0 ? (
            <p className="text-center text-gray-500">No policies are published yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100">
              {policies.map((p) => (
                <li key={p.key}>
                  <Link href={`/legal/${p.key}`} className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-wm-gray/50">
                    <span>
                      <span className="block font-display font-semibold text-wm-green">{p.title}</span>
                      {p.description && <span className="mt-0.5 block text-sm text-gray-500">{p.description}</span>}
                    </span>
                    <span className="shrink-0 text-wm-mint-btn">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
