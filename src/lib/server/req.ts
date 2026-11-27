/** Best-effort real client IP from a Route Handler request (behind Vercel). */
export function clientIp(request: Request): string | null {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim() || null;
  return request.headers.get("x-real-ip");
}
