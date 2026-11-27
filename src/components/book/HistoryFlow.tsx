"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import PhoneOtpGate from "./PhoneOtpGate";
import UpsellCard from "./UpsellCard";
import {
  listMyLogistics,
  statusLabel,
  isUnpaid,
  nairaFmt,
  FLOW_LABEL,
  ApiError,
  type LogisticsLeg,
} from "@/lib/guest";
import { PORTAL_SIGNUP_URL } from "@/lib/site";

export default function HistoryFlow({ hasSession }: { hasSession: boolean }) {
  const [authed, setAuthed] = useState(hasSession);
  const [loading, setLoading] = useState(hasSession);
  const [rows, setRows] = useState<LogisticsLeg[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await listMyLogistics());
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setAuthed(false);
      } else {
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  if (!authed) {
    return (
      <PhoneOtpGate
        title="Your bookings"
        subtitle="Enter your number and we'll text a code to show your pickups."
        verifyCtaLabel="View bookings"
        onVerified={() => setAuthed(true)}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-10 text-wm-mint-btn">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rows.length === 0 ? (
        <div className="rounded-2xl bg-wm-gray p-6 text-center font-body text-sm text-wm-green/70">
          No bookings yet.{" "}
          <Link href="/book" className="font-semibold text-wm-green underline">
            Book a pickup
          </Link>
          .
        </div>
      ) : (
        rows.map((r) => (
          <div key={r.id} className="rounded-2xl border border-wm-green/10 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-body text-sm font-semibold text-wm-green">
                {FLOW_LABEL[r.flow]}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 font-body text-xs font-semibold ${
                  isUnpaid(r.status)
                    ? "bg-wm-cream text-wm-maroon"
                    : "bg-wm-mint-soft text-wm-green"
                }`}
              >
                {statusLabel(r.status)}
              </span>
            </div>
            <p className="mt-1 font-body text-xs text-wm-green/60">
              {r.reference} · {nairaFmt(r.nairaEquivalentSnapshot)}
            </p>
            {r.trackingToken && (
              <p className="mt-1 font-body text-xs text-wm-green/60">
                Tracking: <span className="font-semibold text-wm-green">{r.trackingToken}</span>
              </p>
            )}
            {r.recipient && (
              <p className="mt-1 truncate font-body text-xs text-wm-green/60">
                {r.recipient.name} — {r.recipient.address}
              </p>
            )}
          </div>
        ))
      )}

      <div className="flex justify-center">
        <Link
          href="/book"
          className="rounded-full bg-wm-mint-btn px-6 py-3 font-body text-sm font-semibold text-white hover:opacity-90"
        >
          Book another pickup
        </Link>
      </div>

      <UpsellCard
        id="history"
        title="Keep everything in one place"
        body="Create a free account to manage pickups across devices and get the Washermann app."
        cta="Create an account"
        href={PORTAL_SIGNUP_URL}
      />
    </div>
  );
}
