"use client";

import { useEffect, useState } from "react";

export type ServiceArea = {
  id: string;
  name: string;
  state: string;
  locations: { id: string; name: string }[];
};

/** Fetches the curated list of active service areas (with their towns) from the API. */
export function useServiceAreas() {
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch("/api/areas")
      .then((r) => r.json())
      .then((j) => {
        if (alive) setAreas(Array.isArray(j?.data) ? j.data : []);
      })
      .catch(() => {
        if (alive) setAreas([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { areas, loading };
}
