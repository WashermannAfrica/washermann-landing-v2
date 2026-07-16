"use client";

import { useEffect, useRef, useState } from "react";
import AreaSelect from "./AreaSelect";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SalesRepForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    areaOfLagos: "",
    address: "",
    hasSalesExperience: "",
    whyJoin: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [taken, setTaken] = useState<{ email: boolean; phone: boolean }>({ email: false, phone: false });
  const [checking, setChecking] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const field = "w-full rounded-2xl bg-wm-gray px-4 py-3 font-body text-sm text-wm-green outline-none border border-transparent focus:border-wm-green/30";
  const label = "font-body text-sm font-semibold text-wm-green";

  // Debounced duplicate check — as the applicant fills email/phone
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const email = form.email.trim();
    const phone = form.phone.trim();
    const emailValid = emailRe.test(email);
    const phoneValid = phone.replace(/\D/g, "").length >= 7;
    if (!emailValid && !phoneValid) {
      setTaken({ email: false, phone: false });
      return;
    }
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      setChecking(true);
      try {
        const qs = new URLSearchParams();
        if (emailValid) qs.set("email", email);
        if (phoneValid) qs.set("phone", phone);
        const res = await fetch(`/api/sales-rep?${qs}`);
        const json = await res.json().catch(() => ({}));
        const d = json?.data ?? json ?? {};
        setTaken({
          email: emailValid ? !!d.emailTaken : false,
          phone: phoneValid ? !!d.phoneTaken : false,
        });
      } catch {
        setTaken({ email: false, phone: false }); // never block on a check failure
      } finally {
        setChecking(false);
      }
    }, 500);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [form.email, form.phone]);

  const blocked = taken.email || taken.phone;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading" || blocked) return;
    if (!form.hasSalesExperience) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/sales-rep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          areaOfLagos: form.areaOfLagos,
          address: form.address,
          hasSalesExperience: form.hasSalesExperience === "yes",
          whyJoin: form.whyJoin || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-10" onClick={onClose}>
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-wm-gray text-wm-green hover:bg-wm-green/10"
        >
          ✕
        </button>

        {status === "done" ? (
          <div className="py-10 text-center">
            <p className="font-display text-3xl tracking-tight text-wm-green">Application received! 🎉</p>
            <p className="mt-3 font-body text-sm text-wm-green/70">
              Thanks for applying to become a Washermann Sales Rep. Our team will review your
              application and email you an invite to get started.
            </p>
            <button
              onClick={onClose}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-wm-mint-btn px-7 font-body text-sm font-semibold text-white"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-display text-2xl tracking-tight text-wm-green">Become a Sales Rep</h3>
            <p className="mt-1 font-body text-sm text-wm-green/60">
              Earn cash for every customer and vendor you bring to Washermann.
            </p>

            <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-4">

              <div className="flex flex-col gap-1.5">
                <label className={label}>Full name</label>
                <input required value={form.fullName} onChange={set("fullName")} className={field} placeholder="e.g. Ada Obi" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className={label}>Phone number</label>
                  <input
                    required type="tel" value={form.phone} onChange={set("phone")} placeholder="080…"
                    className={`${field} ${taken.phone ? "border-wm-pink" : ""}`}
                  />
                  {taken.phone && <p className="font-body text-xs text-wm-pink">This phone number is already registered. Log in instead, or use another number.</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={label}>Email address</label>
                  <input
                    required type="email" value={form.email} onChange={set("email")} placeholder="you@email.com"
                    className={`${field} ${taken.email ? "border-wm-pink" : ""}`}
                  />
                  {taken.email && <p className="font-body text-xs text-wm-pink">This email is already registered. Log in instead, or use another email.</p>}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={label}>What area of Lagos do you currently live in?</label>
                <AreaSelect required value={form.areaOfLagos} onChange={(v) => setForm((f) => ({ ...f, areaOfLagos: v }))} className={field} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={label}>Address</label>
                <textarea required rows={2} value={form.address} onChange={set("address")} className={field} placeholder="Your home address" />
              </div>

              <YesNo
                label="Have you worked in sales or marketing before?"
                value={form.hasSalesExperience}
                onChange={(v) => setForm((f) => ({ ...f, hasSalesExperience: v }))}
                labelCls={label}
              />

              <div className="flex flex-col gap-1.5">
                <label className={label}>Why do you want to join? <span className="font-normal text-wm-green/50">(optional)</span></label>
                <textarea rows={3} value={form.whyJoin} onChange={set("whyJoin")} className={field} placeholder="Tell us about your network or why you'd be a great Sales Rep" />
              </div>

              {status === "error" && (
                <p className="font-body text-sm text-wm-pink">Please complete all required fields and try again.</p>
              )}

              <button
                type="submit"
                disabled={status === "loading" || blocked || checking}
                className="mt-1 inline-flex h-12 items-center justify-center rounded-full bg-wm-mint-btn px-7 font-body text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
              >
                {status === "loading" ? "Submitting…" : checking ? "Checking…" : "Submit application"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function YesNo({
  label,
  value,
  onChange,
  labelCls,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  labelCls: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelCls}>{label}</label>
      <div className="flex gap-2">
        {["yes", "no"].map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`flex-1 rounded-2xl px-4 py-2.5 font-body text-sm capitalize transition-colors ${
              value === v
                ? "bg-wm-mint-btn text-white"
                : "bg-wm-gray text-wm-green/70 hover:bg-wm-green/10"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
