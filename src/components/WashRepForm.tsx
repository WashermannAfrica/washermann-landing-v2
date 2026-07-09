"use client";

import { useState } from "react";
import AreaSelect from "./AreaSelect";

export default function WashRepForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    areaOfLagos: "",
    address: "",
    workedLogistics: "",
    workedLaundromat: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const field = "w-full rounded-2xl bg-wm-gray px-4 py-3 font-body text-sm text-wm-green outline-none border border-transparent focus:border-wm-green/30";
  const label = "font-body text-sm font-semibold text-wm-green";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    if (!form.workedLogistics || !form.workedLaundromat) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/wash-rep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          workedLogistics: form.workedLogistics === "yes",
          workedLaundromat: form.workedLaundromat === "yes",
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
              Thanks for applying to become a Wash Rep. Our team will reach out to you soon.
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
            <h3 className="font-display text-2xl tracking-tight text-wm-green">Become a Wash Rep</h3>
            <p className="mt-1 font-body text-sm text-wm-green/60">
              Tell us a bit about you and we&apos;ll be in touch.
            </p>

            <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-4">

              <div className="flex flex-col gap-1.5">
                <label className={label}>Full name</label>
                <input required value={form.fullName} onChange={set("fullName")} className={field} placeholder="e.g. Tunde Bello" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className={label}>Phone number</label>
                  <input required type="tel" value={form.phone} onChange={set("phone")} className={field} placeholder="080…" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={label}>Email address</label>
                  <input required type="email" value={form.email} onChange={set("email")} className={field} placeholder="you@email.com" />
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

              <YesNo label="Have you worked as a logistics person before?" value={form.workedLogistics} onChange={(v) => setForm((f) => ({ ...f, workedLogistics: v }))} labelCls={label} />
              <YesNo label="Have you worked in a laundromat or laundry shop before?" value={form.workedLaundromat} onChange={(v) => setForm((f) => ({ ...f, workedLaundromat: v }))} labelCls={label} />

              {status === "error" && (
                <p className="font-body text-sm text-wm-pink">Something went wrong. Please try again.</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-1 inline-flex h-12 items-center justify-center rounded-full bg-wm-mint-btn px-7 font-body text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
              >
                {status === "loading" ? "Submitting…" : "Submit application"}
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
