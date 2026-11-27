import { NextResponse } from "next/server";
import { apiPublicFetch, setGuestCookies } from "@/lib/server/guest-session";
import { clientIp } from "@/lib/server/req";

// Verifies the guest OTP. On success the API returns a token pair; we store it
// in httpOnly cookies and return ONLY a sanitised body (never the tokens) to the
// browser. When the phone already has a password account, the API returns
// { accountExists: true } and no tokens — we pass that through so the UI can
// redirect the user to log in.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const res = await apiPublicFetch("/guest/verify", {
    method: "POST",
    body,
    forwardIp: clientIp(request),
  });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    return NextResponse.json(json, { status: res.status });
  }

  const data = json?.data ?? {};
  if (data.accessToken && data.refreshToken) {
    await setGuestCookies({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
    return NextResponse.json(
      { data: { user: data.user ?? null, isNew: !!data.isNew } },
      { status: 200 },
    );
  }

  // accountExists (or any token-less success) — pass through without tokens.
  return NextResponse.json(
    { data: { accountExists: !!data.accountExists }, message: json?.message },
    { status: 200 },
  );
}
