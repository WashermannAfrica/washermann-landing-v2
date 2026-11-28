import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SponsorForm from "@/components/SponsorForm";
import {
  getFundingView,
  isLogisticsFlow,
  type FundingFlow,
  type FundingView,
} from "@/lib/funding";

// Per-token, live payment state — never prerender or index.
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

type Params = { params: Promise<{ token: string }> };

const SERVICE_LABEL: Record<FundingFlow, string> = {
  wash_fold: "Wash & Fold",
  wash_iron: "Wash & Iron",
  bundle: "Bundle",
  logistics_collect: "Laundry pickup",
  logistics_delivery: "Laundry delivery",
};

function formatDateTime(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-NG", { dateStyle: "medium" });
}

/** Copy that differs between a wash order and a rep-only logistics leg. */
function presentation(view: FundingView) {
  const logistics = isLogisticsFlow(view.flow);
  const service = SERVICE_LABEL[view.flow];
  return {
    logistics,
    service,
    eyebrow: logistics ? service : "Sponsor a wash",
    // For logistics the named party on the order is the vendor, not the payer,
    // so we keep the heading about the trip rather than "<name>'s laundry".
    heading: logistics
      ? `Pay for your ${service.toLowerCase()}`
      : `Pay for ${view.customerName}’s laundry`,
    scheduleLabel: view.flow === "logistics_delivery" ? "Delivery" : "Pickup",
    escrow: logistics
      ? "Washermann holds your payment in escrow and only releases it once the trip is complete."
      : "Washermann holds every payment in escrow and only releases it once the laundry is delivered.",
    paidBody: logistics
      ? `This ${service.toLowerCase()} (${view.orderRef}) has already been paid for. Thank you!`
      : `${view.customerName}’s laundry (${view.orderRef}) has already been paid for. Thank you for your kindness!`,
  };
}

export default async function SponsorPage({ params }: Params) {
  const { token } = await params;
  const view = await getFundingView(token);
  if (!view) notFound();

  const p = presentation(view);
  const scheduledAt = formatDateTime(view.scheduledPickupAt);
  const expiresOn = formatDate(view.expiresAt);
  const closed = view.status !== "active";
  const closedCopy: Record<string, { title: string; body: string }> = {
    paid: {
      title: "Already taken care of 🎉",
      body: p.paidBody,
    },
    expired: {
      title: "This link has expired",
      body: "Payment links stay open for a limited time. Please ask for a fresh link and try again.",
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
          {p.eyebrow}
        </p>
        <h1 className="mt-2 font-display text-3xl text-white sm:text-4xl">
          {p.heading}
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
                  {p.service}
                  {view.itemCount
                    ? ` · ${view.itemCount} item${view.itemCount === 1 ? "" : "s"}`
                    : ""}
                </span>
              </div>
              {scheduledAt && (
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-body text-sm text-wm-green/70">
                    {p.scheduleLabel}
                  </span>
                  <span className="font-body text-sm font-semibold text-wm-green">
                    {scheduledAt}
                  </span>
                </div>
              )}
              <div className="mt-4 border-t border-wm-green/10 pt-4">
                <div className="flex items-end justify-between">
                  <span className="font-body text-sm text-wm-green/70">Amount</span>
                  <span className="font-display text-3xl text-wm-green">
                    &#8358;{view.amountNaira.toLocaleString("en-NG")}
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
                      "This payment link can no longer be paid."}
                  </p>
                </div>
              ) : (
                <>
                  <SponsorForm token={view.token} amountNaira={view.amountNaira} />
                  {expiresOn && (
                    <p className="mt-3 text-center font-body text-xs text-wm-green/50">
                      This link expires on {expiresOn}.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          <p className="mt-6 text-center font-body text-xs text-wm-green/50">
            {p.escrow}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
