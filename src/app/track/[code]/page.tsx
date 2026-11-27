import type { Metadata } from "next";
import { CheckCircle2, Circle, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrackLookup from "@/components/track/TrackLookup";
import {
  getTrackView,
  TRACK_FLOW_LABEL,
  TRACK_STEPS,
  stepIndex,
  isTerminalFailure,
} from "@/lib/track";
import { statusLabel } from "@/lib/guest";

// Per-code live status — never prerender or index.
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Track a booking",
  robots: { index: false, follow: false },
};

function formatDateTime(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });
}

type Params = { params: Promise<{ code: string }> };

export default async function TrackCodePage({ params }: Params) {
  const { code } = await params;
  const view = await getTrackView(code);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div className="bg-wm-green pb-16 pt-28 text-center">
        <p className="font-body text-sm uppercase tracking-widest text-wm-mint">Tracking</p>
        <h1 className="mt-2 font-display text-3xl text-white sm:text-4xl">
          {view ? TRACK_FLOW_LABEL[view.flow] : "Track your laundry"}
        </h1>
      </div>

      <main className="flex-1">
        <div className="mx-auto -mt-10 max-w-lg px-6 pb-20">
          <div className="rounded-3xl border border-wm-green/10 bg-white p-6 shadow-xl sm:p-8">
            {!view ? (
              <NotFound code={code} />
            ) : (
              <Found view={view} />
            )}
          </div>

          <div className="mt-6">
            <p className="mb-2 text-center font-body text-xs text-wm-green/50">
              Track another booking
            </p>
            <TrackLookup />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function NotFound({ code }: { code: string }) {
  return (
    <div className="text-center">
      <h2 className="font-display text-xl text-wm-green">We couldn&apos;t find that code</h2>
      <p className="mt-2 font-body text-sm text-wm-green/70">
        No booking matches{" "}
        <span className="font-semibold text-wm-green">{code}</span>. Check the code and try
        again — it&apos;s the short code you got when you booked.
      </p>
    </div>
  );
}

function Found({ view }: { view: NonNullable<Awaited<ReturnType<typeof getTrackView>>> }) {
  const scheduledAt = formatDateTime(view.scheduledPickupAt);
  const failed = isTerminalFailure(view.status);
  const idx = stepIndex(view.status);

  return (
    <div>
      {view.recipientFirstName && (
        <p className="font-body text-sm text-wm-green/70">Hi {view.recipientFirstName},</p>
      )}
      <p className="mt-1 font-body text-sm text-wm-green/70">
        Here&apos;s the latest on your {TRACK_FLOW_LABEL[view.flow].toLowerCase()}.
      </p>

      {failed ? (
        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-wm-peach/60 px-4 py-4">
          <XCircle size={20} className="mt-0.5 shrink-0 text-wm-maroon" />
          <div>
            <p className="font-body text-sm font-semibold text-wm-maroon">
              {statusLabel(view.status)}
            </p>
            <p className="mt-0.5 font-body text-xs text-wm-green/70">
              Please contact whoever arranged this delivery for help.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-5 rounded-2xl bg-wm-mint-soft px-4 py-3 text-center">
            <p className="font-display text-lg text-wm-green">{statusLabel(view.status)}</p>
          </div>

          <ol className="mt-6 space-y-3">
            {TRACK_STEPS.map((label, i) => {
              const done = i <= idx;
              const current = i === idx;
              return (
                <li key={label} className="flex items-center gap-3">
                  {done ? (
                    <CheckCircle2 size={20} className="shrink-0 text-wm-mint-btn" />
                  ) : (
                    <Circle size={20} className="shrink-0 text-wm-green/20" />
                  )}
                  <span
                    className={`font-body text-sm ${
                      current
                        ? "font-semibold text-wm-green"
                        : done
                          ? "text-wm-green/70"
                          : "text-wm-green/40"
                    }`}
                  >
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>
        </>
      )}

      <div className="mt-6 border-t border-wm-green/10 pt-4">
        <Row label="Reference" value={view.reference} />
        {scheduledAt && <Row label="Scheduled" value={scheduledAt} />}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="font-body text-sm text-wm-green/70">{label}</span>
      <span className="font-body text-sm font-semibold text-wm-green">{value}</span>
    </div>
  );
}
