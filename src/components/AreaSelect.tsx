"use client";

import { useServiceAreas } from "@/lib/useServiceAreas";
import { LAGOS_AREAS } from "@/lib/site";

/**
 * Area dropdown for the application forms. Shows the admin-curated list of towns
 * grouped under their active area; falls back to the static Lagos LGA list only
 * if no curated areas exist yet (so the form never breaks before launch setup).
 */
export default function AreaSelect({
  value,
  onChange,
  className,
  required,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  required?: boolean;
}) {
  const { areas, loading } = useServiceAreas();
  const hasCurated = areas.length > 0;

  return (
    <select required={required} value={value} onChange={onChange} className={className} disabled={loading}>
      <option value="" disabled>
        {loading ? "Loading areas…" : "Select your area"}
      </option>

      {loading
        ? null
        : hasCurated
        ? areas.map((a) => (
            <optgroup key={a.id} label={a.name}>
              {a.locations.map((l) => (
                <option key={l.id} value={l.name}>
                  {l.name}
                </option>
              ))}
            </optgroup>
          ))
        : LAGOS_AREAS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
    </select>
  );
}
