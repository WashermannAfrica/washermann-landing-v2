// Address lookup via the backend's Google Places (New) proxy. The browser never
// sees the Google key — it calls our own /api/places/* routes, which forward to
// the API. Autocomplete returns predictions without coordinates; picking one
// resolves it to a latitude/longitude via details. A session token groups the
// typing + pick into a single billable Places session.

export interface PlaceSuggestion {
  placeId: string;
  /** Short place name, e.g. "Ikate". */
  name: string;
  /** Full address line, e.g. "Ikate, Lekki, Lagos, Nigeria". */
  placeName: string;
}

export interface PlaceLocation extends PlaceSuggestion {
  latitude: number;
  longitude: number;
}

export interface AutocompleteOptions {
  sessionToken?: string;
  /** Bias results toward a point for more relevant hits. */
  proximity?: { latitude: number; longitude: number };
  signal?: AbortSignal;
}

/** A fresh Places session token (one per "start typing → pick" cycle). */
export function newSessionToken(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

export async function placeAutocomplete(
  query: string,
  opts: AutocompleteOptions = {},
): Promise<PlaceSuggestion[]> {
  const q = query.trim();
  if (q.length < 3) return [];

  const params = new URLSearchParams({ q });
  if (opts.sessionToken) params.set("sessionToken", opts.sessionToken);
  if (opts.proximity) {
    params.set("lat", opts.proximity.latitude.toFixed(5));
    params.set("lng", opts.proximity.longitude.toFixed(5));
  }

  const res = await fetch(`/api/places/autocomplete?${params.toString()}`, {
    signal: opts.signal,
  });
  if (!res.ok) throw new Error("Could not look up that address. Please try again.");
  const json = (await res.json()) as { data?: PlaceSuggestion[] };
  return json.data ?? [];
}

export async function placeDetails(
  placeId: string,
  sessionToken?: string,
): Promise<PlaceLocation> {
  const params = new URLSearchParams({ placeId });
  if (sessionToken) params.set("sessionToken", sessionToken);

  const res = await fetch(`/api/places/details?${params.toString()}`);
  if (!res.ok) throw new Error("Could not load that address. Please try again.");
  const json = (await res.json()) as { data?: PlaceLocation };
  if (!json.data) throw new Error("Could not load that address. Please try again.");
  return json.data;
}
