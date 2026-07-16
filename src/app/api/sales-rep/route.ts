const API_BASE = process.env.API_URL || "http://localhost:3000/api/v1";

// Pre-submit availability check for the application form (email/phone already taken?)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const qs = new URLSearchParams();
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");
    if (email) qs.set("email", email);
    if (phone) qs.set("phone", phone);
    const res = await fetch(`${API_BASE}/sales-rep/applications/availability?${qs}`, {
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json({ success: false }, { status: 502 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${API_BASE}/sales-rep/applications`, {
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
