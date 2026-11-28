import { NextResponse } from "next/server";
import { apiPublicFetch } from "@/lib/server/guest-session";
import { clientIp } from "@/lib/server/req";

// Proxies place details (coordinate resolution) to the API.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params: Record<string, string> = {};
  for (const key of ["placeId", "sessionToken"]) {
    const v = searchParams.get(key);
    if (v) params[key] = v;
  }

  const res = await apiPublicFetch("/places/details", {
    searchParams: params,
    forwardIp: clientIp(request),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
