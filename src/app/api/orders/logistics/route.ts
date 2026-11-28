import { NextResponse } from "next/server";
import { apiGuestFetch } from "@/lib/server/guest-session";

// The signed-in guest's own logistics legs (newest first), for the history view.
export async function GET() {
  const res = await apiGuestFetch("/orders/me", {
    method: "GET",
    searchParams: { flow: "logistics", limit: "100" },
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
