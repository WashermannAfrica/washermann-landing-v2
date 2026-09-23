"use client";

import { useState } from "react";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SponsorForm({
  token,
  amountNaira,
}: {
  token: string;
  amountNaira: number;
}) {
  const [form, setForm] = useState({ email: "", name: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const field =
    "w-full rounded-2xl bg-wm-gray px-4 py-3 font-body text-sm text-wm-green outline-none border border-transparent focus:border-wm-green/30";
  const label = "font-body text-sm font-semibold text-wm-green";

  const emailValid = emailRe.test(form.email.trim());

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading" || !emailValid) return;
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch(`/api/sponsor/${encodeURIComponent(token)}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          name: form.name.trim() || undefined,
          message: form.message.trim() || undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      const url = json?.data?.authorizationUrl ?? json?.authorizationUrl;
      if (!res.ok || !url) {
        setStatus("error");
        setError(
          json?.message ||
            "We couldn't start this payment. The link may have expired or already been paid.",
        );
        return;
      }
      // Hand off to Paystack's hosted checkout.
      window.location.href = url;
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="sponsor-email" className={label}>
          Your email <span className="text-wm-pink">*</span>
        </label>
        <input
          id="sponsor-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={form.email}
          onChange={set("email")}
          placeholder="you@example.com"
          className={field}
          required
        />
        <p className="font-body text-xs text-wm-green/50">
          Your Paystack receipt goes here. We never share it.
        </p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="sponsor-name" className={label}>
          Your name <span className="font-normal text-wm-green/50">(optional)</span>
        </label>
        <input
          id="sponsor-name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={set("name")}
          placeholder="So they know who to thank"
          className={field}
          maxLength={160}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="sponsor-message" className={label}>
          Message <span className="font-normal text-wm-green/50">(optional)</span>
        </label>
        <textarea
          id="sponsor-message"
          value={form.message}
          onChange={set("message")}
          placeholder="Add a short note…"
          className={`${field} min-h-[88px] resize-y`}
          maxLength={500}
        />
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading" || !emailValid}
        className="w-full rounded-full bg-wm-mint-btn px-6 py-3.5 font-body text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading"
          ? "Redirecting to secure checkout…"
          : `Pay ₦${amountNaira.toLocaleString("en-NG")}`}
      </button>

      <p className="text-center font-body text-xs text-wm-green/50">
        Secured by Paystack. You’ll be redirected to complete the payment.
      </p>
    </form>
  );
}
