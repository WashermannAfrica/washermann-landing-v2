import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HistoryFlow from "@/components/book/HistoryFlow";
import { hasGuestSession } from "@/lib/server/guest-session";

// Depends on the guest session cookie — never prerender or cache.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your bookings",
  description: "See your Washermann laundry pickups and deliveries.",
  robots: { index: false, follow: false },
};

export default async function HistoryPage() {
  const hasSession = await hasGuestSession();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div className="bg-wm-green pb-16 pt-28 text-center">
        <p className="font-body text-sm uppercase tracking-widest text-wm-mint">Your bookings</p>
        <h1 className="mt-2 font-display text-3xl text-white sm:text-4xl">Track your pickups</h1>
      </div>

      <main className="flex-1">
        <div className="mx-auto -mt-10 max-w-lg px-6 pb-20">
          <div className="rounded-3xl border border-wm-green/10 bg-white p-6 shadow-xl sm:p-8">
            <HistoryFlow hasSession={hasSession} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
