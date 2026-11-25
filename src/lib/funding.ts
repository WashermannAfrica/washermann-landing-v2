// Server-side fetcher for public order-funding ("sponsor my laundry") links.
// Never cached — a link's status flips to `paid`/`expired` and must reflect live state.
const API_BASE = process.env.API_URL || "http://localhost:3000/api/v1";

export type FundingStatus = "active" | "paid" | "expired" | "cancelled";

/** Mirrors the API's OrderFlow: wash flows plus the rep-only logistics legs. */
export type FundingFlow =
  | "wash_fold"
  | "wash_iron"
  | "bundle"
  | "logistics_delivery" // shop → customer (deliver clean)
  | "logistics_collect"; // customer → shop (collect dirty)

export const isLogisticsFlow = (flow: FundingFlow): boolean =>
  flow === "logistics_delivery" || flow === "logistics_collect";

export interface FundingView {
  token: string;
  status: FundingStatus;
  purpose: "self" | "sponsor";
  amountNaira: number;
  washPoints: number;
  expiresAt: string;
  customerName: string;
  orderRef: string;
  itemCount: number | null;
  flow: FundingFlow;
  scheduledPickupAt: string | null;
}

export async function getFundingView(token: string): Promise<FundingView | null> {
  try {
    const res = await fetch(`${API_BASE}/funding/${encodeURIComponent(token)}`, {
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
