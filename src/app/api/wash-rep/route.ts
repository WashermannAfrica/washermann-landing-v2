const API_BASE = process.env.API_URL || "http://localhost:3000/api/v1";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${API_BASE}/marketing/wash-rep-applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 502 },
    );
  }
}
