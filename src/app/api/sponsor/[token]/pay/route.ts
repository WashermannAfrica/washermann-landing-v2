const API_BASE = process.env.API_URL || "http://localhost:3000/api/v1";

// Proxies a sponsor/order payment to the API so the API base URL stays server-side.
// Returns { data: { authorizationUrl, reference, amountNaira } } from the API.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    const body = await request.json();
    const res = await fetch(
      `${API_BASE}/funding/${encodeURIComponent(token)}/pay`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 502 },
    );
  }
}
