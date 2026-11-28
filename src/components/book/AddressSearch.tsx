"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Search, Check, X, Loader2 } from "lucide-react";
import {
  placeAutocomplete,
  placeDetails,
  newSessionToken,
  type PlaceSuggestion,
} from "@/lib/places";

export interface SelectedAddress {
  address: string;
  latitude: number;
  longitude: number;
}

interface AddressSearchProps {
  label: string;
  required?: boolean;
  value: SelectedAddress | null;
  onChange: (value: SelectedAddress | null) => void;
  proximity?: { latitude: number; longitude: number };
  error?: string;
  id: string;
  placeholder?: string;
}

/**
 * Address → coordinates picker backed by Google Places (via our backend proxy).
 * The user searches, picks a real place, and we resolve its latitude/longitude
 * (the backend requires them). Editing the text after a pick clears the captured
 * point so a stale coordinate is never sent.
 */
export default function AddressSearch({
  label,
  required,
  value,
  onChange,
  proximity,
  error,
  id,
  placeholder = "Search a street, area or landmark",
}: AddressSearchProps) {
  const [query, setQuery] = useState(value?.address ?? "");
  const [hits, setHits] = useState<PlaceSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [noHits, setNoHits] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  // One Places session token per "start typing → pick" cycle (billing).
  const sessionRef = useRef("");

  const selected = value != null && value.address === query;

  useEffect(() => {
    const q = query.trim();
    if (selected || q.length < 3) {
      setHits([]);
      setNoHits(false);
      return;
    }
    if (!sessionRef.current) sessionRef.current = newSessionToken();
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setSearching(true);
      setLookupError("");
      try {
        const found = await placeAutocomplete(q, {
          sessionToken: sessionRef.current,
          proximity,
          signal: ctrl.signal,
        });
        setHits(found);
        setNoHits(found.length === 0);
        setOpen(true);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setLookupError((err as Error).message || "Address lookup failed.");
          setHits([]);
        }
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [query, selected, proximity]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  async function pick(h: PlaceSuggestion) {
    setOpen(false);
    setHits([]);
    setNoHits(false);
    setQuery(h.placeName);
    setResolving(true);
    setLookupError("");
    try {
      const loc = await placeDetails(h.placeId, sessionRef.current);
      onChange({ address: loc.placeName, latitude: loc.latitude, longitude: loc.longitude });
      setQuery(loc.placeName);
    } catch (err) {
      setLookupError((err as Error).message || "Could not load that address.");
      onChange(null);
    } finally {
      sessionRef.current = ""; // close the billable session; next search starts a new one
      setResolving(false);
    }
  }

  function onType(v: string) {
    setQuery(v);
    if (value) onChange(null); // editing invalidates the captured coordinates
  }

  function clear() {
    setQuery("");
    onChange(null);
    setHits([]);
    setNoHits(false);
    sessionRef.current = "";
  }

  const labelEl = (
    <label htmlFor={id} className="font-body text-sm font-semibold text-wm-green">
      {label} {required && <span className="text-wm-pink">*</span>}
    </label>
  );

  return (
    <div className="space-y-1.5" ref={boxRef}>
      {labelEl}
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-wm-green/50">
          {selected ? <MapPin size={16} className="text-wm-mint-btn" /> : <Search size={16} />}
        </span>
        <input
          id={id}
          value={query}
          onChange={(e) => onType(e.target.value)}
          onFocus={() => hits.length > 0 && setOpen(true)}
          autoComplete="off"
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          className={`w-full rounded-2xl bg-wm-gray py-3 pl-11 pr-11 font-body text-sm text-wm-green outline-none border ${
            error ? "border-red-300" : selected ? "border-wm-mint-btn/40" : "border-transparent"
          } focus:border-wm-green/30`}
        />
        {searching || resolving ? (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-wm-mint-btn">
            <Loader2 size={16} className="animate-spin" />
          </span>
        ) : query ? (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear address"
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-wm-green/50 hover:bg-wm-green/5"
          >
            <X size={15} />
          </button>
        ) : null}

        {open && (hits.length > 0 || noHits) && (
          <div className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-wm-green/10 bg-white p-1.5 shadow-lg">
            {hits.map((h) => (
              <button
                key={h.placeId}
                type="button"
                onClick={() => pick(h)}
                className="flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left hover:bg-wm-gray"
              >
                <MapPin size={16} className="mt-0.5 shrink-0 text-wm-green/40" />
                <span className="min-w-0">
                  <span className="block truncate font-body text-sm font-medium text-wm-green">
                    {h.name}
                  </span>
                  <span className="block truncate font-body text-xs text-wm-green/50">
                    {h.placeName}
                  </span>
                </span>
              </button>
            ))}
            {noHits && (
              <p className="px-3 py-2.5 font-body text-sm text-wm-green/50">
                No places found. Try a nearby landmark.
              </p>
            )}
          </div>
        )}
      </div>

      {selected && (
        <p className="flex items-center gap-1.5 font-body text-xs text-wm-mint-btn">
          <Check size={13} strokeWidth={3} /> Location captured
        </p>
      )}
      {lookupError && !selected && (
        <p className="font-body text-xs text-red-600">{lookupError}</p>
      )}
      {error && <p className="font-body text-xs text-red-600">{error}</p>}
    </div>
  );
}
