import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrackLookup from "@/components/track/TrackLookup";

export const metadata: Metadata = {
  title: "Track a booking",
  description:
    "Track your Washermann laundry pickup or delivery with your tracking code.",
};

export default function TrackIndexPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div className="bg-wm-green pb-16 pt-28 text-center">
        <p className="font-body text-sm uppercase tracking-widest text-wm-mint">Tracking</p>
        <h1 className="mt-2 font-display text-3xl text-white sm:text-4xl">Track your laundry</h1>
      </div>

      <main className="flex-1">
        <div className="mx-auto -mt-10 max-w-lg px-6 pb-20">
          <div className="rounded-3xl border border-wm-green/10 bg-white p-6 shadow-xl sm:p-8">
            <h2 className="font-display text-2xl text-wm-green">Enter your code</h2>
            <p className="mb-5 mt-1 font-body text-sm text-wm-green/70">
              You got a short tracking code when you booked — enter it to see where your laundry is.
            </p>
            <TrackLookup />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
