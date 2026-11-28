import { NextResponse } from "next/server";
import { apiPublicFetch } from "@/lib/server/guest-session";
import { clientIp } from "@/lib/server/req";

// Proxies address autocomplete to the API, keeping the API base URL server-side
// and forwarding the real client IP for the API's per-IP rate limit.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params: Record<string, string> = {};
  for (const key of ["q", "sessionToken", "lat", "lng"]) {
    const v = searchParams.get(key);
    if (v) params[key] = v;
  }

  const res = await apiPublicFetch("/places/autocomplete", {
    searchParams: params,
    forwardIp: clientIp(request),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
