"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import {
  isValidNigerianPhone,
  normalizeNigerianPhone,
  formatNigerianPhone,
} from "@/lib/phone";
import { startOtp, resendOtp, verifyOtp, type VerifyResult } from "@/lib/guest";
import { PORTAL_SIGNIN_URL } from "@/lib/site";

const field =
  "w-full rounded-2xl bg-wm-gray px-4 py-3 font-body text-sm text-wm-green outline-none border border-transparent focus:border-wm-green/30";
const labelCls = "font-body text-sm font-semibold text-wm-green";
const primaryBtn =
  "w-full rounded-full bg-wm-mint-btn px-6 py-3.5 font-body text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";

interface PhoneOtpGateProps {
  /** Called once the phone is verified and a session cookie is set. */
  onVerified: (result: VerifyResult) => void;
  /** Collect an optional operator name on the phone step (booking flow). */
  collectName?: boolean;
  title: string;
  subtitle: string;
  verifyCtaLabel?: string;
}

export default function PhoneOtpGate({
  onVerified,
  collectName = false,
  title,
  subtitle,
  verifyCtaLabel = "Verify",
}: PhoneOtpGateProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountExists, setAccountExists] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const e164 = normalizeNigerianPhone(phone);
  const phoneValid = isValidNigerianPhone(phone);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startCooldown(seconds: number) {
    setCooldown(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1 && timerRef.current) clearInterval(timerRef.current);
        return c - 1 <= 0 ? 0 : c - 1;
      });
    }, 1000);
  }

  async function sendCode(e?: React.FormEvent) {
    e?.preventDefault();
    if (busy) return;
    if (!phoneValid || !e164) {
      setError("Enter a valid Nigerian mobile number.");
      return;
    }
    if (!consent) {
      setError("Please accept the privacy policy and terms to continue.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { cooldownSeconds, verificationRequired } = await startOtp(e164);
      if (verificationRequired === false) {
        // SMS verification is switched off upstream — no code to enter; go
        // straight to claiming the session.
        const result = await verifyOtp({
          phone: e164,
          consent: true,
          name: collectName && name.trim() ? name.trim() : undefined,
        });
        if (result.accountExists) {
          setAccountExists(true);
          return;
        }
        onVerified(result);
        return;
      }
      setStep("otp");
      startCooldown(cooldownSeconds || 60);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    if (cooldown > 0 || busy || !e164) return;
    setBusy(true);
    setError(null);
    try {
      const { cooldownSeconds } = await resendOtp(e164);
      startCooldown(cooldownSeconds || 60);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function submitOtp(e?: React.FormEvent) {
    e?.preventDefault();
    if (busy || !e164) return;
    if (otp.trim().length < 4) {
      setError("Enter the code we sent you.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await verifyOtp({
        phone: e164,
        otp: otp.trim(),
        consent: true,
        name: collectName && name.trim() ? name.trim() : undefined,
      });
      if (result.accountExists) {
        setAccountExists(true);
        return;
      }
      onVerified(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (accountExists) {
    return (
      <div className="rounded-2xl border border-wm-green/10 bg-wm-mint-soft px-5 py-6 text-center">
        <h2 className="font-display text-xl text-wm-green">You already have an account</h2>
        <p className="mt-2 font-body text-sm text-wm-green/70">
          This number is linked to a Washermann account. Please sign in to manage your pickups.
        </p>
        <a
          href={PORTAL_SIGNIN_URL}
          className="mt-4 inline-block rounded-full bg-wm-green px-6 py-3 font-body text-sm font-semibold text-white hover:opacity-90"
        >
          Go to sign in
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="font-display text-2xl text-wm-green">{title}</h2>
        <p className="mt-1 font-body text-sm text-wm-green/70">{subtitle}</p>
      </div>

      {step === "phone" ? (
        <form onSubmit={sendCode} className="space-y-4">
          {collectName && (
            <div className="space-y-1.5">
              <label htmlFor="g-name" className={labelCls}>
                Your name <span className="font-normal text-wm-green/50">(optional)</span>
              </label>
              <input
                id="g-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bisi's Laundry"
                className={field}
                maxLength={160}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="g-phone" className={labelCls}>
              Phone number <span className="text-wm-pink">*</span>
            </label>
            <input
              id="g-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0803 123 4567"
              className={field}
            />
            <p className="font-body text-xs text-wm-green/50">
              We&apos;ll text you a 6-digit code to confirm it&apos;s you.
            </p>
          </div>

          <label className="flex items-start gap-2.5">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-wm-mint-btn"
            />
            <span className="font-body text-xs text-wm-green/70">
              I agree to Washermann&apos;s{" "}
              <Link href="/legal/privacy-policy" className="underline" target="_blank">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/legal/terms-of-service" className="underline" target="_blank">
                Terms
              </Link>
              .
            </span>
          </label>

          {error && (
            <p
              role="alert"
              aria-live="assertive"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button type="submit" disabled={busy || !phoneValid || !consent} className={primaryBtn}>
            {busy ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Sending code…
              </span>
            ) : (
              "Send code"
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={submitOtp} className="space-y-4">
          <p className="font-body text-sm text-wm-green/70">
            Code sent to <span className="font-semibold text-wm-green">{formatNigerianPhone(phone)}</span>.{" "}
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setOtp("");
                setError(null);
              }}
              className="underline"
            >
              Change
            </button>
          </p>

          <div className="space-y-1.5">
            <label htmlFor="g-otp" className={labelCls}>
              Enter code <span className="text-wm-pink">*</span>
            </label>
            <input
              id="g-otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="123456"
              maxLength={8}
              className={`${field} tracking-[0.4em]`}
            />
          </div>

          {error && (
            <p
              role="alert"
              aria-live="assertive"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button type="submit" disabled={busy || otp.trim().length < 4} className={primaryBtn}>
            {busy ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Verifying…
              </span>
            ) : (
              verifyCtaLabel
            )}
          </button>

          <button
            type="button"
            onClick={resend}
            disabled={cooldown > 0 || busy}
            className="w-full font-body text-xs text-wm-green/60 underline disabled:no-underline disabled:opacity-60"
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
          </button>
        </form>
      )}
    </div>
  );
}
