"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { Subject, Resource, EnabledCategories } from "@/lib/types";

// --- Subject Actions ---

export async function addSubjectAction(
  semester: number,
  name: string,
  slug: string,
  enabledCategories: EnabledCategories
) {
  try {
    const finalSlug = slug;
    const { error } = await supabase
      .from("subjects")
      .insert([{ name, slug: finalSlug, enabledCategories, semester }]);
    if (error) throw error;

    revalidatePath(`/admin/dashboard`);
    revalidatePath(`/${semester}`);
    return { success: true, message: "Subject added successfully." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateSubjectAction(
  id: string,
  name: string,
  slug: string,
  enabledCategories: EnabledCategories
) {
  try {
    const finalSlug = slug;
    const { data, error } = await supabase
      .from("subjects")
      .update({ name, slug: finalSlug, enabledCategories })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath(`/admin/dashboard`);
    if (data) {
      revalidatePath(`/${data.semester}`);
      revalidatePath(`/${data.semester}/${id}`);
    }
    return { success: true, message: "Subject updated successfully." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteSubjectAction(id: string) {
  try {
    const { data, error } = await supabase
      .from("subjects")
      .delete()
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;

    if (data) {
      revalidatePath(`/admin/dashboard`);
      revalidatePath(`/${data.semester}`);
    }
    return { success: true, message: "Subject deleted successfully." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getAllSubjectsAction(): Promise<Subject[]> {
  const { data, error } = await supabase.from("subjects").select("*");
  if (error) {
    console.error("Error fetching all subjects:", error);
    return [];
  }
  return data as Subject[];
}

const revalidateResourcePath = async (
  resource: Pick<Resource, "semester" | "subject" | "category">
) => {
  try {
    const { data: subj } = await supabase
      .from("subjects")
      .select("slug, name")
      .eq("id", resource.subject)
      .single();

    const subjectSlug = subj?.slug;
    revalidatePath(
      `/sem${resource.semester}/${subjectSlug}/${(
        resource.category as string
      ).toLowerCase()}`
    );
  } catch (err) {
    console.warn("Revalidate path fallback (subject lookup failed):", err);
    revalidatePath(
      `/sem${resource.semester}/${resource.subject}/${resource.category}`
    );
  }
};

// --- Resource Actions ---

export async function addResourceAction(
  data: Omit<Resource, "id" | "thumbnail" | "thumbnailStatus">
) {
  try {
    const normalizedCategory = (data.category as string).toLowerCase();
    const newResource = {
      ...data,
      category: normalizedCategory as Resource["category"],
      thumbnail: null,
      thumbnailStatus: null,
    };

    const { error } = await supabase
      .from("resources")
      .insert([newResource])
      .select()
      .single();
    if (error) throw error;

    revalidatePath(`/admin/dashboard`);
    await revalidateResourcePath({
      semester: data.semester,
      subject: data.subject,
      category: normalizedCategory as Resource["category"],
    });
    return { success: true, message: "Resource added." };
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to add resource: ${error.message}`,
    };
  }
}

export async function updateResourceAction(
  id: string,
  data: Partial<Omit<Resource, "id">>
) {
  try {
    // Fetch existing record so we can revalidate the right path even if fields are not provided
    const { data: existing, error: fetchError } = await supabase
      .from("resources")
      .select("semester,subject,category")
      .eq("id", id)
      .single();
    if (fetchError) throw fetchError;

    const updateData: Partial<Omit<Resource, "id">> = {
      ...data,
      category: data.category
        ? ((data.category as string).toLowerCase() as Resource["category"])
        : data.category,
    };

    const { error } = await supabase
      .from("resources")
      .update(updateData)
      .eq("id", id);
    if (error) throw error;

    const pathData = {
      semester: data.semester ?? existing.semester,
      subject: data.subject ?? existing.subject,
      category:
        (data.category as string | undefined)?.toLowerCase() ??
        existing.category,
    };

    revalidatePath(`/admin/dashboard`);
    await revalidateResourcePath(pathData);
    return { success: true, message: "Resource updated successfully." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteResourceAction(id: string) {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from("resources")
      .select("semester,subject,category")
      .eq("id", id)
      .single();
    if (fetchError) throw fetchError;

    const { error } = await supabase.from("resources").delete().eq("id", id);
    if (error) throw error;

    revalidatePath(`/admin/dashboard`);
    if (existing) {
      await revalidateResourcePath(existing);
    }
    return { success: true, message: "Resource deleted successfully." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getAllResourcesAction(): Promise<Resource[]> {
  const { data, error } = await supabase.from("resources").select("*");
  if (error) {
    console.error("Error fetching resources:", error);
    return [];
  }
  return data as Resource[];
}

// Thumbnail regeneration intentionally disabled; keep export stub removed to avoid unused code.
