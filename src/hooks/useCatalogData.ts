"use client";

import { useState, useEffect } from "react";
import { Subject } from "@/lib/types";

export function useCatalogData() {
  const [catalogData, setCatalogData] = useState<Subject[]>(() => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("catalog:data");
    return data ? JSON.parse(data) : [];
  });

  useEffect(() => {
    const updateCatalog = () => {
      const data = localStorage.getItem("catalog:data");
      setCatalogData(data ? JSON.parse(data) : []);
    };

    window.addEventListener("storage", updateCatalog);
    window.addEventListener("catalog-updated", updateCatalog);

    return () => {
      window.removeEventListener("storage", updateCatalog);
      window.removeEventListener("catalog-updated", updateCatalog);
    };
  }, []);

  return catalogData;
}

export function useSubjectResources(subjectCode: string) {
  const catalogData = useCatalogData();
  const subject = catalogData.find((s) => s.code === subjectCode);
  return subject?.resources || [];
}

export function useResourceSections(subjectCode: string, resourceId: string) {
  const catalogData = useCatalogData();
  const subject = catalogData.find((s) => s.code === subjectCode);
  const resource = subject?.resources?.find((r) => r.id === resourceId);
  return resource?.sections || [];
}
