// Server-side policy (legal) fetchers. Pages run with ISR (revalidate: 300);
// publishing a new version in the admin CMS surfaces on the next revalidation.
const API_BASE = process.env.API_URL || "http://localhost:3000/api/v1";

export interface PolicySummary {
  key: string;
  title: string;
  description: string | null;
  audiences: string[];
}

export interface PolicyDocument {
  key: string;
  title: string;
  versionNumber: number;
  effectiveDate: string;
  contentHtml: string;
  contentHash: string;
}

const REVALIDATE = 300;

export async function listPolicies(): Promise<PolicySummary[]> {
  try {
    const res = await fetch(`${API_BASE}/policies`, {
      next: { revalidate: REVALIDATE, tags: ["policies"] },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function getPolicy(key: string): Promise<PolicyDocument | null> {
  try {
    const res = await fetch(`${API_BASE}/policies/${encodeURIComponent(key)}`, {
      next: { revalidate: REVALIDATE, tags: ["policies", `policy:${key}`] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

/** A specific pinned version — used by consent-record links. Not cached long. */
export async function getPolicyVersion(key: string, versionNumber: number): Promise<PolicyDocument | null> {
  try {
    const res = await fetch(
      `${API_BASE}/policies/${encodeURIComponent(key)}/versions/${versionNumber}`,
      { next: { revalidate: REVALIDATE } },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export function formatEffectiveDate(iso: string): string {
  // effectiveDate is a date-only string (YYYY-MM-DD)
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
}
