// ─── Guest logistics: browser client for the landing-page funnel ──────────────
// Calls the same-origin /api/* proxy routes (which attach the httpOnly session
// cookie and talk to washermann-api). No tokens are ever handled here.

export type GuestChoice = "delivery" | "pickup";

export type OrderFlow = "logistics_delivery" | "logistics_collect";

export const CHOICE_TO_FLOW: Record<GuestChoice, OrderFlow> = {
  delivery: "logistics_delivery", // shop → customer (deliver clean)
  pickup: "logistics_collect", // customer → shop (collect dirty)
};

export interface Recipient {
  name: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface GuestBookingInput {
  flow: OrderFlow;
  shopAddress: string;
  shopLatitude: number;
  shopLongitude: number;
  recipient: Recipient;
  scheduledPickupAt?: string;
  note?: string;
}

export interface CreatedLeg {
  id: string;
  reference: string;
  flow: OrderFlow;
  status: string;
  nairaEquivalent: number;
  totalWP: number;
  trackingToken: string | null;
  scheduledPickupAt: string | null;
}

export interface LogisticsLeg {
  id: string;
  reference: string;
  flow: OrderFlow;
  status: string;
  recipient: Recipient | null;
  nairaEquivalentSnapshot: number | null;
  scheduledPickupAt: string | null;
  createdAt: string;
  trackingToken: string | null;
}

export interface VerifyResult {
  accountExists?: boolean;
  isNew?: boolean;
  user?: { id: string; phone: string | null } | null;
}

/** Unwrap the API's `{ data }` envelope, tolerating a bare object. */
function unwrap<T>(payload: unknown): T {
  const p = payload as { data?: T } | T;
  if (p && typeof p === "object" && "data" in (p as object)) {
    return (p as { data: T }).data;
  }
  return p as T;
}

/** An error carrying the HTTP status, so callers can detect e.g. a 401 session expiry. */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function post<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(
      (json as { message?: string })?.message || "Something went wrong. Please try again.",
      res.status,
    );
  }
  return unwrap<T>(json);
}

// ─── OTP ──────────────────────────────────────────────────────────────────────

export interface OtpStart {
  cooldownSeconds: number;
  /** false when the backend has phone verification switched off (SMS outage). */
  verificationRequired?: boolean;
}

export async function startOtp(phone: string): Promise<OtpStart> {
  return post<OtpStart>("/api/guest/start", { phone });
}

export async function resendOtp(phone: string): Promise<OtpStart> {
  return post<OtpStart>("/api/guest/resend", { phone });
}

export async function verifyOtp(input: {
  phone: string;
  otp?: string;
  consent: boolean;
  name?: string;
}): Promise<VerifyResult> {
  return post<VerifyResult>("/api/guest/verify", input);
}

// ─── Booking ────────────────────────────────────────────────────────────────

export async function createGuestBooking(input: GuestBookingInput): Promise<CreatedLeg> {
  return post<CreatedLeg>("/api/logistics/guest", input);
}

const URL_KEYS = ["authorizationUrl", "checkoutUrl", "paymentUrl", "url", "shareUrl", "link"];

function extractUrl(obj: Record<string, unknown> | null | undefined): string | null {
  if (!obj) return null;
  for (const k of URL_KEYS) {
    const v = obj[k];
    if (typeof v === "string" && /^https?:\/\//.test(v)) return v;
  }
  return null;
}

/** Create the card payment link for a leg and return the URL to open. */
export async function createPaymentLink(legId: string): Promise<string> {
  const data = await post<Record<string, unknown>>(
    `/api/logistics/${encodeURIComponent(legId)}/payment-link`,
    { purpose: "self" },
  );
  const url = extractUrl(data);
  if (!url) throw new Error("No payment link was returned. Please try again.");
  return url;
}

// ─── History ──────────────────────────────────────────────────────────────────

export async function listMyLogistics(): Promise<LogisticsLeg[]> {
  const res = await fetch("/api/orders/logistics", { method: "GET" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(
      (json as { message?: string })?.message || "Could not load your bookings.",
      res.status,
    );
  }
  const rows = unwrap<LogisticsLeg[]>(json) ?? [];
  return Array.isArray(rows)
    ? rows.filter((o) => o.flow === "logistics_collect" || o.flow === "logistics_delivery")
    : [];
}

// ─── Display helpers ──────────────────────────────────────────────────────────

export const FLOW_LABEL: Record<OrderFlow, string> = {
  logistics_delivery: "Delivery to your customer",
  logistics_collect: "Pickup from your customer",
};

const STATUS_LABEL: Record<string, string> = {
  pending_payment: "Awaiting payment",
  paid: "Paid",
  broadcasting_rep: "Finding a rider",
  rep_assigned: "Rider assigned",
  scheduled: "Scheduled",
  rep_en_route_pickup: "Rider on the way",
  picked_up: "Picked up",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  completed: "Completed",
  delivery_failed: "Delivery failed",
  cancelled: "Cancelled",
};

export function statusLabel(status: string): string {
  return STATUS_LABEL[status] ?? status.replace(/_/g, " ");
}

export function isUnpaid(status: string): boolean {
  return status === "pending_payment";
}

export function nairaFmt(n: number | null | undefined): string {
  return `₦${Number(n ?? 0).toLocaleString("en-NG")}`;
}
