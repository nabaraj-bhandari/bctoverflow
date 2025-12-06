import { createClient } from "@supabase/supabase-js";
import type { Subject, Resource, EnabledCategories } from "@/lib/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Track missing tables so we can short-circuit repeated failing requests
const missingTables = new Set<string>();

// Simple fallbacks to keep the UI responsive when Supabase is unavailable
const fallbackSubjects: Subject[] = [];
const fallbackResources: Resource[] = [];

// Throw an error if the Supabase URL or key is not provided,
// but only on the server-side to avoid breaking the client-side build.
if (typeof window === "undefined" && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn(
    "Supabase URL or anonymous key is not provided. Database operations will fail."
  );
}

export const supabase = createClient(
  supabaseUrl || "http://localhost:54321",
  supabaseAnonKey || "dummy-key"
);

const isMissingTableError = (error: any, tableName: string) => {
  const message = (error?.message || "").toLowerCase();
  return (
    message.includes(`table '${tableName}'`) ||
    message.includes(`table "${tableName}"`) ||
    message.includes(`table ${tableName}`) ||
    message.includes("schema cache")
  );
};

const shouldSkipTable = (tableName: string) =>
  !supabaseConfigured || missingTables.has(tableName);

const markTableMissing = (tableName: string, error: any) => {
  if (!missingTables.has(tableName)) {
    missingTables.add(tableName);
    console.warn(
      `Supabase table "${tableName}" is unavailable. Falling back to empty data.`,
      error
    );
  }
};

// --- Subject Functions ---

export async function getSubjects(semester: number): Promise<Subject[]> {
  if (shouldSkipTable("subjects"))
    return fallbackSubjects.filter((s) => s.semester === semester);
  try {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .eq("semester", semester);
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    if (isMissingTableError(error, "subjects")) {
      markTableMissing("subjects", error);
      return fallbackSubjects.filter((s) => s.semester === semester);
    }
    console.error("Error fetching subjects:", error.message || error);
    return fallbackSubjects.filter((s) => s.semester === semester);
  }
}

export async function getSubjectBySlug(slug: string): Promise<Subject | null> {
  if (shouldSkipTable("subjects")) {
    return fallbackSubjects.find((s) => s.slug === slug) || null;
  }
  try {
    // Prefer a slug match; tolerate duplicates by taking the most recent
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .eq("slug", slug)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) return data;

    // Fallback: fetch list and pick first match to avoid "Cannot coerce" errors
    const { data: list, error: listError } = await supabase
      .from("subjects")
      .select("*")
      .eq("slug", slug);

    if (!listError && list && list.length > 0) {
      return list[0];
    }

    // Attempt a more robust fetch if direct match fails, by fetching all and filtering
    const allSubjects = await getAllSubjectsAction();
    const foundSubject = allSubjects.find((s) => s.slug === slug);
    if (foundSubject) return foundSubject;

    if (error) throw error;
    if (listError) throw listError;
    return null;
  } catch (error: any) {
    if (isMissingTableError(error, "subjects")) {
      markTableMissing("subjects", error);
      return fallbackSubjects.find((s) => s.slug === slug) || null;
    }
    console.error(
      `Error fetching subject by slug "${slug}":`,
      error.message || error
    );
    return null;
  }
}

export async function getSubject(subjectId: string): Promise<Subject | null> {
  if (shouldSkipTable("subjects")) {
    return fallbackSubjects.find((s) => s.id === subjectId) || null;
  }
  try {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .eq("id", subjectId)
      .single();
    if (error) throw error;
    return data;
  } catch (error: any) {
    if (isMissingTableError(error, "subjects")) {
      markTableMissing("subjects", error);
      return fallbackSubjects.find((s) => s.id === subjectId) || null;
    }
    console.error("Error fetching subject:", error.message || error);
    return null;
  }
}

// --- Resource Functions ---

export async function getResources(
  subjectSlug: string,
  category: keyof EnabledCategories
): Promise<Resource[]> {
  if (shouldSkipTable("resources")) return fallbackResources;
  try {
    const subject = await getSubjectBySlug(subjectSlug);
    if (!subject) return [];

    let query = supabase
      .from("resources")
      .select("*")
      .eq("subject", subject.id)
      .ilike("category", category as string);

    if (typeof subject.semester === "number") {
      query = query.eq("semester", subject.semester);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    if (isMissingTableError(error, "resources")) {
      markTableMissing("resources", error);
      return fallbackResources.filter(
        (r) =>
          r.subject === subjectSlug &&
          (r.category as string).toLowerCase() ===
            (category as string).toLowerCase()
      );
    }
    console.error("Error fetching resources:", error.message || error);
    return fallbackResources.filter(
      (r) =>
        r.subject === subjectSlug &&
        (r.category as string).toLowerCase() ===
          (category as string).toLowerCase()
    );
  }
}

export async function getResourcesByIds(ids: string[]): Promise<Resource[]> {
  if (ids.length === 0 || shouldSkipTable("resources"))
    return fallbackResources.filter((res) => ids.includes(res.id));
  try {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .in("id", ids);

    if (error) throw error;

    // Preserve original order
    const orderedData = ids
      .map((id) => data.find((res) => res.id === id))
      .filter(Boolean) as Resource[];
    return orderedData;
  } catch (error: any) {
    if (isMissingTableError(error, "resources")) {
      markTableMissing("resources", error);
      return fallbackResources.filter((res) => ids.includes(res.id));
    }
    console.error("Error fetching resources by IDs:", error.message || error);
    return fallbackResources.filter((res) => ids.includes(res.id));
  }
}

// Duplicating from admin actions to use on client
export async function getAllSubjectsAction(): Promise<Subject[]> {
  if (shouldSkipTable("subjects")) return fallbackSubjects;
  const { data, error } = await supabase.from("subjects").select("*");
  if (error) {
    if (isMissingTableError(error, "subjects")) {
      markTableMissing("subjects", error);
      return fallbackSubjects;
    }
    console.error("Error fetching all subjects:", error);
    return fallbackSubjects;
  }
  return data as Subject[];
}
