import { NextResponse } from "next/server";
import { apiGuestFetch } from "@/lib/server/guest-session";

// Creates a guest logistics leg as the signed-in guest (token from the httpOnly
// cookie; refreshed transparently if the access token has expired).
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const res = await apiGuestFetch("/logistics/guest", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
