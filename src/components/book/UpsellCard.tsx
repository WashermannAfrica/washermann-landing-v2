"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface UpsellCardProps {
  id: string; // stable key for remembering dismissal
  title: string;
  body: string;
  cta: string;
  href: string;
}

/** A subtle, dismissible "create an account" nudge. Dismissal is remembered. */
export default function UpsellCard({ id, title, body, cta, href }: UpsellCardProps) {
  const key = `wm_upsell_dismissed_${id}`;
  const [dismissed, setDismissed] = useState(true); // hidden until we check storage

  useEffect(() => {
    setDismissed(localStorage.getItem(key) === "1");
  }, [key]);

  if (dismissed) return null;

  return (
    <div className="relative rounded-2xl border border-wm-green/10 bg-wm-mint-soft p-5">
      <button
        type="button"
        onClick={() => {
          localStorage.setItem(key, "1");
          setDismissed(true);
        }}
        aria-label="Dismiss"
        className="absolute right-3 top-3 text-wm-green/40 hover:text-wm-green"
      >
        <X size={16} />
      </button>
      <h3 className="pr-6 font-display text-lg text-wm-green">{title}</h3>
      <p className="mt-1 font-body text-sm text-wm-green/70">{body}</p>
      <a
        href={href}
        className="mt-3 inline-block rounded-full bg-wm-green px-5 py-2.5 font-body text-sm font-semibold text-white hover:opacity-90"
      >
        {cta}
      </a>
    </div>
  );
}
