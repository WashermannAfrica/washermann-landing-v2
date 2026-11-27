"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

/** Code entry → navigates to /track/<code>. Reused on /track and /track/[code]. */
export default function TrackLookup({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [code, setCode] = useState(initial);

  function go(e: React.FormEvent) {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    if (c) router.push(`/track/${encodeURIComponent(c)}`);
  }

  return (
    <form onSubmit={go} className="flex gap-2">
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Enter your tracking code"
        aria-label="Tracking code"
        maxLength={12}
        className="w-full rounded-2xl bg-wm-gray px-4 py-3 font-body text-sm tracking-[0.2em] text-wm-green outline-none border border-transparent focus:border-wm-green/30"
      />
      <button
        type="submit"
        disabled={!code.trim()}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl bg-wm-mint-btn px-5 font-body text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Search size={16} /> Track
      </button>
    </form>
  );
}
