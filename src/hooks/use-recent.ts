"use client";

import { useLocalStorage } from "./use-local-storage";
import { useCallback } from "react";
import { Resource } from "@/lib/types";

export type RecentResource = Resource & { viewedAt: number };

export function useRecentResources(limit: number = 20) {
  const [recents, setRecents, isLoading] = useLocalStorage<RecentResource[]>(
    "recent-resources",
    []
  );

  const addRecent = useCallback(
    (resource: Resource) => {
      const entry: RecentResource = { ...resource, viewedAt: Date.now() };
      setRecents((prev) => {
        const filtered = prev.filter((r) => r.id !== resource.id);
        return [entry, ...filtered].slice(0, limit);
      });
    },
    [setRecents, limit]
  );

  const clearRecents = useCallback(() => {
    setRecents([]);
  }, [setRecents]);

  return { recents, addRecent, clearRecents, isLoading };
}
