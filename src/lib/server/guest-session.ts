// Server-only helpers for the guest logistics session.
//
// The guest's access + refresh JWTs live in httpOnly cookies set here — the
// browser never sees a token in JS (XSS-safe). The access token is short-lived
// (15m); apiGuestFetch transparently refreshes it with the 7-day refresh token
// and rotates both cookies, so a returning guest stays signed in without
// re-doing OTP. All reads/writes happen inside Route Handlers.

// Imported only by Route Handlers; next/headers' cookies() is itself server-only.
import { cookies } from "next/headers";

const API_BASE = process.env.API_URL || "http://localhost:3000/api/v1";

export const GUEST_ACCESS_COOKIE = "wm_guest";
export const GUEST_REFRESH_COOKIE = "wm_guest_rt";

const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7d — matches the refresh token's life

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

export async function setGuestCookies(tokens: TokenPair): Promise<void> {
  const jar = await cookies();
  jar.set(GUEST_ACCESS_COOKIE, tokens.accessToken, cookieOptions);
  jar.set(GUEST_REFRESH_COOKIE, tokens.refreshToken, cookieOptions);
}

export async function clearGuestCookies(): Promise<void> {
  const jar = await cookies();
  jar.delete(GUEST_ACCESS_COOKIE);
  jar.delete(GUEST_REFRESH_COOKIE);
}

export async function hasGuestSession(): Promise<boolean> {
  const jar = await cookies();
  return !!(jar.get(GUEST_ACCESS_COOKIE)?.value || jar.get(GUEST_REFRESH_COOKIE)?.value);
}

async function refreshTokens(refreshToken: string): Promise<TokenPair | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json().catch(() => null);
    const data = json?.data ?? json;
    if (data?.accessToken && data?.refreshToken) {
      return { accessToken: data.accessToken, refreshToken: data.refreshToken };
    }
    return null;
  } catch {
    return null;
  }
}

interface GuestFetchInit {
  method?: string;
  body?: unknown;
  searchParams?: Record<string, string>;
  /** Client IP to forward to the API for rate-limiting (guest start/verify). */
  forwardIp?: string | null;
}

function buildUrl(path: string, searchParams?: Record<string, string>): string {
  const url = new URL(`${API_BASE}${path}`);
  if (searchParams) {
    for (const [k, v] of Object.entries(searchParams)) url.searchParams.set(k, v);
  }
  return url.toString();
}

async function callApi(url: string, init: GuestFetchInit, accessToken?: string): Promise<Response> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  if (init.forwardIp) headers["x-forwarded-for"] = init.forwardIp;
  return fetch(url, {
    method: init.method ?? "GET",
    headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
  });
}

/**
 * Call the API as the current guest. Attaches the access token; on a 401 with a
 * refresh token available, refreshes once, rotates the cookies, and retries.
 * Returns a 401 Response when there is no usable session.
 */
export async function apiGuestFetch(path: string, init: GuestFetchInit = {}): Promise<Response> {
  const jar = await cookies();
  const accessToken = jar.get(GUEST_ACCESS_COOKIE)?.value;
  const refreshToken = jar.get(GUEST_REFRESH_COOKIE)?.value;

  if (!accessToken && !refreshToken) {
    return new Response(JSON.stringify({ message: "Please verify your phone to continue." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = buildUrl(path, init.searchParams);
  let res = accessToken
    ? await callApi(url, init, accessToken)
    : new Response(null, { status: 401 });

  if (res.status === 401 && refreshToken) {
    const rotated = await refreshTokens(refreshToken);
    if (rotated) {
      await setGuestCookies(rotated);
      res = await callApi(url, init, rotated.accessToken);
    } else {
      await clearGuestCookies();
    }
  }

  return res;
}

/** Direct (session-less) call to the API — used by guest start/verify. */
export async function apiPublicFetch(path: string, init: GuestFetchInit = {}): Promise<Response> {
  return callApi(buildUrl(path, init.searchParams), init);
}
