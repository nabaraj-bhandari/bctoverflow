"use client";

import { useSyncExternalStore } from "react";
import { Subject } from "@/lib/types";

// Cache for the catalog data
let cachedData: Subject[] = [];
let cachedDataString: string | null = null;

// ✅ Cache for server snapshot (empty array)
const emptyArray: Subject[] = [];

// Subscribe to localStorage changes
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  // Also listen for custom storage events (for same-tab updates)
  window.addEventListener("catalog-updated", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("catalog-updated", callback);
  };
}

// Get catalog from localStorage with caching
function getSnapshot(): Subject[] {
  if (typeof window === "undefined") return emptyArray;

  const data = localStorage.getItem("catalog:data");

  // Return cached data if localStorage hasn't changed
  if (data === cachedDataString && cachedData !== null) {
    return cachedData;
  }

  // Parse and cache new data
  cachedDataString = data;
  cachedData = data ? JSON.parse(data) : emptyArray;
  return cachedData;
}

// ✅ Server-side snapshot - always return the same cached empty array
function getServerSnapshot(): Subject[] {
  return emptyArray;
}

export function useCatalogData() {
  const catalogData = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return {
    catalogData,
    isLoading: false,
    error: null,
  };
}

export function useSubjectResources(subjectCode: string) {
  const { catalogData, isLoading, error } = useCatalogData();
  const subject = catalogData.find((s) => s.code === subjectCode);

  return {
    resources: subject?.resources || [],
    isLoading,
    error,
  };
}

export function useResourceSections(subjectCode: string, resourceId: string) {
  const { catalogData, isLoading, error } = useCatalogData();
  const subject = catalogData.find((s) => s.code === subjectCode);
  const resource = subject?.resources?.find((r) => r.id === resourceId);

  return {
    sections: resource?.sections || [],
    isLoading,
    error,
  };
}
