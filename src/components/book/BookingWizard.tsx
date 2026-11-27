"use client";

import { useState } from "react";
import { Loader2, Truck, PackageCheck, Copy, Check } from "lucide-react";
import AddressSearch, { type SelectedAddress } from "./AddressSearch";
import UpsellCard from "./UpsellCard";
import { isValidNigerianPhone, normalizeNigerianPhone } from "@/lib/phone";
import {
  createGuestBooking,
  createPaymentLink,
  CHOICE_TO_FLOW,
  FLOW_LABEL,
  nairaFmt,
  ApiError,
  type GuestChoice,
  type CreatedLeg,
} from "@/lib/guest";
import { PORTAL_SIGNUP_URL } from "@/lib/site";

const field =
  "w-full rounded-2xl bg-wm-gray px-4 py-3 font-body text-sm text-wm-green outline-none border border-transparent focus:border-wm-green/30";
const labelCls = "font-body text-sm font-semibold text-wm-green";
const primaryBtn =
  "w-full rounded-full bg-wm-mint-btn px-6 py-3.5 font-body text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";

interface BookingWizardProps {
  /** Called when the API reports the session is no longer valid (401). */
  onSessionExpired: () => void;
}

const CHOICES: { value: GuestChoice; label: string; hint: string }[] = [
  { value: "delivery", label: "Deliver clean laundry", hint: "From your shop → your customer" },
  { value: "pickup", label: "Collect dirty laundry", hint: "From your customer → your shop" },
];

export default function BookingWizard({ onSessionExpired }: BookingWizardProps) {
  const [choice, setChoice] = useState<GuestChoice>("delivery");
  const [shop, setShop] = useState<SelectedAddress | null>(null);
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientAddr, setRecipientAddr] = useState<SelectedAddress | null>(null);
  const [scheduledAt, setScheduledAt] = useState("");
  const [note, setNote] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedLeg | null>(null);
  const [copied, setCopied] = useState(false);

  const recipientPhoneValid = isValidNigerianPhone(recipientPhone);
  const canSubmit =
    !!shop &&
    !!recipientAddr &&
    recipientName.trim().length > 0 &&
    recipientPhoneValid;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !canSubmit || !shop || !recipientAddr) return;
    const recipientE164 = normalizeNigerianPhone(recipientPhone);
    if (!recipientE164) {
      setError("Enter a valid customer phone number.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const leg = await createGuestBooking({
        flow: CHOICE_TO_FLOW[choice],
        shopAddress: shop.address,
        shopLatitude: shop.latitude,
        shopLongitude: shop.longitude,
        recipient: {
          name: recipientName.trim(),
          phone: recipientE164,
          address: recipientAddr.address,
          latitude: recipientAddr.latitude,
          longitude: recipientAddr.longitude,
        },
        scheduledPickupAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
        note: note.trim() || undefined,
      });
      setCreated(leg);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onSessionExpired();
        return;
      }
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function pay() {
    if (!created || busy) return;
    setBusy(true);
    setError(null);
    try {
      const url = await createPaymentLink(created.id);
      window.location.href = url;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onSessionExpired();
        return;
      }
      setError((err as Error).message);
      setBusy(false);
    }
  }

  // ── Created: show the summary + proceed to payment ──
  if (created) {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl bg-wm-mint-soft p-5 text-center">
          <PackageCheck className="mx-auto text-wm-mint-btn" size={32} />
          <h2 className="mt-2 font-display text-2xl text-wm-green">Booking created</h2>
          <p className="mt-1 font-body text-sm text-wm-green/70">
            Pay to dispatch a rider. Your clothes move once payment is confirmed.
          </p>
        </div>

        <div className="rounded-2xl border border-wm-green/10 bg-white p-5">
          <Row label="Service" value={FLOW_LABEL[created.flow]} />
          <Row label="Reference" value={created.reference} />
          {created.trackingToken && (
            <div className="flex items-center justify-between py-2">
              <span className="font-body text-sm text-wm-green/70">Tracking code</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(created.trackingToken as string);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-wm-green"
              >
                {created.trackingToken}
                {copied ? <Check size={13} className="text-wm-mint-btn" /> : <Copy size={13} />}
              </button>
            </div>
          )}
          <div className="mt-2 flex items-end justify-between border-t border-wm-green/10 pt-3">
            <span className="font-body text-sm text-wm-green/70">Amount</span>
            <span className="font-display text-2xl text-wm-green">
              {nairaFmt(created.nairaEquivalent)}
            </span>
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700">
            {error}
          </p>
        )}

        <button onClick={pay} disabled={busy} className={primaryBtn}>
          {busy ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Opening secure checkout…
            </span>
          ) : (
            `Pay ${nairaFmt(created.nairaEquivalent)}`
          )}
        </button>

        <UpsellCard
          id="post-booking"
          title="Save time next time"
          body="Create a free account to manage pickups from any device, skip re-entering your number, and get the Washermann app."
          cta="Create an account"
          href={PORTAL_SIGNUP_URL}
        />
      </div>
    );
  }

  // ── Form ──
  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="space-y-2">
        <span className={labelCls}>What do you need?</span>
        <div className="grid gap-2 sm:grid-cols-2">
          {CHOICES.map((c) => {
            const active = choice === c.value;
            return (
              <button
                type="button"
                key={c.value}
                onClick={() => setChoice(c.value)}
                className={`rounded-2xl border p-4 text-left transition-colors ${
                  active
                    ? "border-wm-mint-btn bg-wm-mint-soft"
                    : "border-wm-green/10 bg-white hover:border-wm-green/30"
                }`}
              >
                <Truck size={18} className="text-wm-mint-btn" />
                <span className="mt-2 block font-body text-sm font-semibold text-wm-green">
                  {c.label}
                </span>
                <span className="block font-body text-xs text-wm-green/60">{c.hint}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AddressSearch
        id="shop-address"
        label="Your shop / pickup point"
        required
        value={shop}
        onChange={setShop}
        placeholder="Where your laundry business is"
      />

      <div className="rounded-2xl border border-wm-green/10 p-4">
        <p className="mb-3 font-body text-sm font-semibold text-wm-green">Your customer</p>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="r-name" className={labelCls}>
              Name <span className="text-wm-pink">*</span>
            </label>
            <input
              id="r-name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Customer's name"
              className={field}
              maxLength={160}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="r-phone" className={labelCls}>
              Phone <span className="text-wm-pink">*</span>
            </label>
            <input
              id="r-phone"
              type="tel"
              inputMode="tel"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              placeholder="0803 123 4567"
              className={field}
            />
          </div>
          <AddressSearch
            id="r-address"
            label="Customer address"
            required
            value={recipientAddr}
            onChange={setRecipientAddr}
            proximity={shop ? { latitude: shop.latitude, longitude: shop.longitude } : undefined}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="sched" className={labelCls}>
          Preferred time <span className="font-normal text-wm-green/50">(optional)</span>
        </label>
        <input
          id="sched"
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className={field}
        />
        <p className="font-body text-xs text-wm-green/50">Leave blank to dispatch as soon as possible.</p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="note" className={labelCls}>
          Note for the rider <span className="font-normal text-wm-green/50">(optional)</span>
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Landmarks, gate code, instructions…"
          className={`${field} min-h-[72px] resize-y`}
          maxLength={1000}
        />
      </div>

      {error && (
        <p role="alert" aria-live="assertive" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700">
          {error}
        </p>
      )}

      <button type="submit" disabled={busy || !canSubmit} className={primaryBtn}>
        {busy ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" /> Creating booking…
          </span>
        ) : (
          "Review & book"
        )}
      </button>
      <p className="text-center font-body text-xs text-wm-green/50">
        You&apos;ll see the price before you pay.
      </p>
    </form>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="font-body text-sm text-wm-green/70">{label}</span>
      <span className="font-body text-sm font-semibold text-wm-green">{value}</span>
    </div>
  );
}
