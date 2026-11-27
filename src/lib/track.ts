// Server-side fetcher for the PUBLIC logistics tracking view. No auth: anyone
// with a tracking code can see the trip's status. The API payload is deliberately
// low-sensitivity (reference, flow, status, recipient FIRST name, schedule).
const API_BASE = process.env.API_URL || "http://localhost:3000/api/v1";

export type TrackFlow = "logistics_delivery" | "logistics_collect";

export interface TrackView {
  reference: string;
  flow: TrackFlow;
  status: string;
  recipientFirstName: string | null;
  scheduledPickupAt: string | null;
}

export async function getTrackView(code: string): Promise<TrackView | null> {
  const c = code.trim();
  if (!c) return null;
  try {
    const res = await fetch(`${API_BASE}/logistics/track/${encodeURIComponent(c)}`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    const json = await res.json().catch(() => null);
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export const TRACK_FLOW_LABEL: Record<TrackFlow, string> = {
  logistics_delivery: "Laundry delivery",
  logistics_collect: "Laundry pickup",
};

// ── Progress ───────────────────────────────────────────────────────────────
// A simple 4-step happy path the recipient can read at a glance.
export const TRACK_STEPS = ["Booked", "Picked up", "On the way", "Delivered"];

export function stepIndex(status: string): number {
  switch (status) {
    case "picked_up":
    case "with_vendor":
      return 1;
    case "rep_collected":
    case "ready_for_delivery":
    case "out_for_delivery":
      return 2;
    case "delivered":
    case "completed":
      return 3;
    default:
      return 0; // pending_payment, paid, scheduled, finding/assigning a rider…
  }
}

export function isTerminalFailure(status: string): boolean {
  return status === "cancelled" || status === "delivery_failed" || status === "abandoned";
}
