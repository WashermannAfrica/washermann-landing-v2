import { NextResponse } from "next/server";
import { apiGuestFetch } from "@/lib/server/guest-session";

// Creates a card payment link for a guest's leg. Returns the API's funding/
// sponsor shareUrl (or Paystack URL) for the browser to open.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const res = await apiGuestFetch(`/logistics/${encodeURIComponent(id)}/payment-link`, {
    method: "POST",
    body,
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
