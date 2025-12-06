"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";

export const useSemester = () => {
  const [semester, setSemester, isSemesterLoading] = useLocalStorage<number | null>("bct-overflow-semester", null);
  return { semester, setSemester, isSemesterLoading };
};
