"use client";

import { useState } from "react";

type Tone = "onDark" | "onLight";

export default function WaitlistForm({
  source,
  buttonLabel = "Join the Waitlist",
  tone = "onLight",
  showSegment = true,
}: {
  source: "hero" | "waitlist" | "final-cta";
  buttonLabel?: string;
  tone?: Tone;
  showSegment?: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [segment, setSegment] = useState<"individual" | "company">("individual");
  const [honey, setHoney] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const dark = tone === "onDark";
  const inputBase =
    "w-full rounded-full px-5 h-12 font-body text-sm outline-none transition-colors";
  const inputCls = dark
    ? `${inputBase} bg-white/10 text-white placeholder-white/50 focus:bg-white/15`
    : `${inputBase} bg-white text-wm-green placeholder-wm-green/40 border border-wm-green/10 focus:border-wm-green/30`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, segment, source, company_website: honey }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div
        className={`rounded-3xl px-7 py-6 text-center font-body ${
          dark ? "bg-white/10 text-white" : "bg-white text-wm-green"
        }`}
      >
        <p className="font-display text-2xl tracking-tight">You&apos;re on the list! 🎉</p>
        <p className={`mt-2 text-sm ${dark ? "text-white/70" : "text-wm-green/70"}`}>
          We&apos;ll be in touch the moment we launch in your area.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto flex w-full max-w-md flex-col gap-3">
      {/* honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={honey}
        onChange={(e) => setHoney(e.target.value)}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden
      />

      <input
        type="text"
        required
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputCls}
      />
      <input
        type="email"
        required
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputCls}
      />

      {showSegment && (
        <div className="flex items-center justify-center gap-2 text-sm">
          {(["individual", "company"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSegment(s)}
              className={`rounded-full px-4 py-2 font-body transition-colors ${
                segment === s
                  ? "bg-wm-mint-btn text-white"
                  : dark
                    ? "bg-white/10 text-white/70 hover:bg-white/15"
                    : "bg-white text-wm-green/60 border border-wm-green/10 hover:border-wm-green/30"
              }`}
            >
              {s === "individual" ? "For myself" : "For my company"}
            </button>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-1 inline-flex h-12 items-center justify-center rounded-full bg-wm-mint-btn px-7 font-body text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
      >
        {status === "loading" ? "Submitting…" : buttonLabel}
      </button>

      {status === "error" && (
        <p className="text-center font-body text-sm text-wm-pink">{message}</p>
      )}
    </form>
  );
}
