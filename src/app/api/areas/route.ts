const API_BASE = process.env.API_URL || "http://localhost:3000/api/v1";

// Curated, public list of active service areas + their towns, for the
// application-form dropdowns.
export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/areas/public`, {
      headers: { "Content-Type": "application/json" },
      // Areas change rarely; cache briefly to avoid hammering the API.
      next: { revalidate: 60 },
    });
    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json({ success: true, data: [] }, { status: 200 });
  }
}
