import { NextResponse } from "next/server";
import { apiPublicFetch } from "@/lib/server/guest-session";
import { clientIp } from "@/lib/server/req";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const res = await apiPublicFetch("/guest/resend", {
    method: "POST",
    body,
    forwardIp: clientIp(request),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
