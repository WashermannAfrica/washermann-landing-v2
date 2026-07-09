"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useServiceAreas } from "@/lib/useServiceAreas";
import { LAGOS_AREAS } from "@/lib/site";

interface Option {
  value: string;      // the town/area name stored on the form
  label: string;      // display name
  group?: string;     // area name it belongs to
}

/**
 * Searchable location picker for the application forms. Shows the admin-curated
 * towns (grouped by their active area); falls back to the static Lagos LGA list
 * before launch setup. A search field filters as the applicant types — much
 * friendlier than scrolling a long native <select>.
 */
export default function AreaSelect({
  value,
  onChange,
  className,
  required,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
}) {
  const { areas, loading } = useServiceAreas();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  const options: Option[] = useMemo(() => {
    if (areas.length > 0) {
      return areas.flatMap((a) =>
        a.locations.map((l) => ({ value: l.name, label: l.name, group: a.name })),
      );
    }
    return LAGOS_AREAS.map((a) => ({ value: a, label: a }));
  }, [areas]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || (o.group?.toLowerCase().includes(q) ?? false),
    );
  }, [options, query]);

  // Close on outside click
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function pick(v: string) {
    onChange(v);
    setOpen(false);
    setQuery("");
  }

  // Group filtered options by area for display
  const grouped = useMemo(() => {
    const map = new Map<string, Option[]>();
    for (const o of filtered) {
      const key = o.group ?? "";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(o);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <div ref={wrapRef} className="relative">
      {/* Trigger — looks like the other form fields */}
      <button
        type="button"
        onClick={() => !loading && setOpen((o) => !o)}
        className={`${className} flex items-center justify-between text-left ${value ? "" : "text-wm-green/50"}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{loading ? "Loading areas…" : value || "Search your area"}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-wm-green/50">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Hidden input keeps native `required` validation working */}
      {required && (
        <input
          tabIndex={-1}
          aria-hidden="true"
          required
          value={value}
          onChange={() => {}}
          className="pointer-events-none absolute h-0 w-0 opacity-0"
        />
      )}

      {open && (
        <div className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-2xl border border-wm-green/15 bg-white shadow-xl">
          <div className="border-b border-wm-gray p-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search…"
              className="w-full rounded-xl bg-wm-gray px-3 py-2 font-body text-sm text-wm-green outline-none"
            />
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-4 py-6 text-center font-body text-sm text-wm-green/50">No area matches “{query}”.</p>
            ) : (
              grouped.map(([group, opts]) => (
                <div key={group || "all"}>
                  {group && (
                    <p className="px-4 pb-1 pt-2 font-body text-[11px] font-semibold uppercase tracking-wider text-wm-green/40">
                      {group}
                    </p>
                  )}
                  {opts.map((o) => (
                    <button
                      key={`${group}-${o.value}`}
                      type="button"
                      onClick={() => pick(o.value)}
                      className={`flex w-full items-center px-4 py-2 text-left font-body text-sm hover:bg-wm-mint-soft ${
                        value === o.value ? "bg-wm-mint-soft font-semibold text-wm-green" : "text-wm-green/80"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
