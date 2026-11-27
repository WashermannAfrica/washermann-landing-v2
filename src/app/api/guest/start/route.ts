import { NextResponse } from "next/server";
import { apiPublicFetch } from "@/lib/server/guest-session";
import { clientIp } from "@/lib/server/req";

// Proxies guest OTP requests to the API, keeping the API base URL server-side
// and forwarding the real client IP for the API's per-IP rate limit.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const res = await apiPublicFetch("/guest/start", {
    method: "POST",
    body,
    forwardIp: clientIp(request),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
