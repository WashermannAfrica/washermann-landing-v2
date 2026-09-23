import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SponsorForm from "@/components/SponsorForm";
import { getFundingView, type FundingView } from "@/lib/funding";

// Per-token, live payment state — never prerender or index.
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

type Params = { params: Promise<{ token: string }> };

const FLOW_LABEL: Record<FundingView["flow"], string> = {
  wash_fold: "Wash & Fold",
  wash_iron: "Wash & Iron",
  bundle: "Bundle",
};

function formatPickup(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });
}

export default async function SponsorPage({ params }: Params) {
  const { token } = await params;
  const view = await getFundingView(token);
  if (!view) notFound();

  const pickup = formatPickup(view.scheduledPickupAt);
  const closed = view.status !== "active";
  const closedCopy: Record<string, { title: string; body: string }> = {
    paid: {
      title: "Already taken care of 🎉",
      body: `${view.customerName}'s laundry (${view.orderRef}) has already been paid for. Thank you for your kindness!`,
    },
    expired: {
      title: "This link has expired",
      body: "Sponsor links stay open for a limited time. Ask your friend to share a fresh one from the Washermann app.",
    },
    cancelled: {
      title: "This link is no longer active",
      body: "The order was changed or cancelled, so it can no longer be paid from this link.",
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div className="bg-wm-green pb-16 pt-28 text-center">
        <p className="font-body text-sm uppercase tracking-widest text-wm-mint">
          Sponsor a wash
        </p>
        <h1 className="mt-2 font-display text-3xl text-white sm:text-4xl">
          Pay for {view.customerName}&rsquo;s laundry
        </h1>
      </div>

      <main className="flex-1">
        <div className="mx-auto -mt-10 max-w-lg px-6 pb-20">
          <div className="rounded-3xl border border-wm-green/10 bg-white p-6 shadow-xl sm:p-8">
            {/* Order summary */}
            <div className="rounded-2xl bg-wm-mint-soft p-5">
              <div className="flex items-center justify-between">
                <span className="font-body text-sm text-wm-green/70">Order</span>
                <span className="font-body text-sm font-semibold text-wm-green">
                  {view.orderRef}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-body text-sm text-wm-green/70">Service</span>
                <span className="font-body text-sm font-semibold text-wm-green">
                  {FLOW_LABEL[view.flow]}
                  {view.itemCount ? ` · ${view.itemCount} item${view.itemCount === 1 ? "" : "s"}` : ""}
                </span>
              </div>
              {pickup && (
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-body text-sm text-wm-green/70">Pickup</span>
                  <span className="font-body text-sm font-semibold text-wm-green">
                    {pickup}
                  </span>
                </div>
              )}
              <div className="mt-4 border-t border-wm-green/10 pt-4">
                <div className="flex items-end justify-between">
                  <span className="font-body text-sm text-wm-green/70">Amount</span>
                  <span className="font-display text-3xl text-wm-green">
                    ₦{view.amountNaira.toLocaleString("en-NG")}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment form or closed state */}
            <div className="mt-6">
              {closed ? (
                <div className="rounded-2xl border border-wm-green/10 bg-wm-gray px-5 py-6 text-center">
                  <h2 className="font-display text-xl text-wm-green">
                    {closedCopy[view.status]?.title ?? "This link is unavailable"}
                  </h2>
                  <p className="mt-2 font-body text-sm text-wm-green/70">
                    {closedCopy[view.status]?.body ??
                      "This funding link can no longer be paid."}
                  </p>
                </div>
              ) : (
                <SponsorForm token={view.token} amountNaira={view.amountNaira} />
              )}
            </div>
          </div>

          <p className="mt-6 text-center font-body text-xs text-wm-green/50">
            Washermann holds every payment in escrow and only releases it once the
            laundry is delivered.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
