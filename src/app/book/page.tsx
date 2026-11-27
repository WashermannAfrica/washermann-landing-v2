import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookFlow from "@/components/book/BookFlow";
import { hasGuestSession } from "@/lib/server/guest-session";

// Depends on the guest session cookie — never prerender or cache.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book a pickup",
  description:
    "Book a laundry pickup or delivery with Washermann — no account needed. Confirm your number and we handle the rest.",
};

export default async function BookPage() {
  const hasSession = await hasGuestSession();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div className="bg-wm-green pb-16 pt-28 text-center">
        <p className="font-body text-sm uppercase tracking-widest text-wm-mint">Logistics</p>
        <h1 className="mt-2 font-display text-3xl text-white sm:text-4xl">
          Move laundry, no account needed
        </h1>
      </div>

      <main className="flex-1">
        <div className="mx-auto -mt-10 max-w-lg px-6 pb-20">
          <div className="rounded-3xl border border-wm-green/10 bg-white p-6 shadow-xl sm:p-8">
            <BookFlow hasSession={hasSession} />
          </div>
          <p className="mt-6 text-center font-body text-xs text-wm-green/50">
            Payment is held in escrow and released once the trip is complete.{" "}
            <Link href="/book/history" className="underline">
              See your bookings
            </Link>
            .
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
