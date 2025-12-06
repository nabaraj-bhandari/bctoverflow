"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase, getAllSubjectsAction } from "@/lib/supabase";
import { EnabledCategories, Resource, Subject } from "@/lib/types";

const semesters = Array.from({ length: 8 }, (_, idx) => idx + 1);

const categoryLabels: Record<keyof EnabledCategories, string> = {
  notes: "Notes",
  pyqs: "PYQs",
  books: "Books",
  lab: "Lab",
  exam: "Exam",
};

const normalizeSubject = (
  subject: Partial<Subject> & { enabledCategories?: EnabledCategories }
): Subject => ({
  id: subject.id ?? "",
  name: subject.name ?? "",
  slug: subject.slug ?? "",
  semester: Number(subject.semester ?? 0),
  enabled_categories: subject.enabled_categories ||
    subject.enabledCategories || {
      notes: true,
      pyqs: true,
      books: true,
      lab: false,
      exam: false,
    },
});

const normalizeResource = (resource: Partial<Resource>): Resource => ({
  id: resource.id ?? "",
  title: resource.title ?? "",
  url: resource.url ?? "",
  semester: Number(resource.semester ?? 0),
  subject: resource.subject ?? "",
  category: resource.category ?? "notes",
});

const extractDriveId = (link: string): string => {
  const trimmed = link.trim();
  try {
    const url = new URL(trimmed);
    const match = url.pathname.match(/\/file\/d\/([^/]+)/);
    if (match?.[1]) return match[1];
    const idParam = url.searchParams.get("id");
    if (idParam) return idParam;
  } catch {}
  return trimmed;
};

export function ResourceManager() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  type FormState = {
    title: string;
    url: string;
    semester: number | "";
    subjectId: string;
    category: keyof EnabledCategories;
  };

  const emptyForm: FormState = {
    title: "",
    url: "",
    semester: 1,
    subjectId: "",
    category: "notes",
  };

  const [form, setForm] = useState<FormState>(emptyForm);
  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const subjectIdRef = useRef(form.subjectId);
  useEffect(() => {
    subjectIdRef.current = form.subjectId;
  }, [form.subjectId]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [subjectList, resourceResult] = await Promise.all([
        getAllSubjectsAction(),
        supabase.from("resources").select("*"),
      ]);

      if (resourceResult.error) throw resourceResult.error;

      setSubjects(subjectList.map(normalizeSubject));
      setResources((resourceResult.data || []).map(normalizeResource));

      // Default subject on first load only
      if (!subjectIdRef.current && subjectList.length > 0) {
        const first = subjectList[0];
        subjectIdRef.current = first.id;
        setForm((prev) => ({
          ...prev,
          semester: first.semester,
          subjectId: first.id,
        }));
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load resources";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

  useEffect(() => {
    const matchingSubject = subjects.find((s) => s.semester === form.semester);
    if (matchingSubject && !form.subjectId) {
      setForm((prev) => ({ ...prev, subjectId: matchingSubject.id }));
    }
  }, [form.semester, form.subjectId, subjects]);

  const sortedResources = useMemo(
    () =>
      [...resources].sort(
        (a, b) => b.semester - a.semester || a.title.localeCompare(b.title)
      ),
    [resources]
  );

  const selectedSubject = subjects.find((s) => s.id === form.subjectId);
  const availableCategories = useMemo(() => {
    const enabled = selectedSubject?.enabled_categories;
    if (!enabled)
      return Object.keys(categoryLabels) as (keyof EnabledCategories)[];
    return (Object.keys(enabled) as (keyof EnabledCategories)[]).filter(
      (key) => enabled[key]
    );
  }, [selectedSubject]);

  const resetForm = () => {
    setEditingId(null);
    const firstSubject = subjects[0];
    setForm({
      ...emptyForm,
      semester: firstSubject ? firstSubject.semester : 1,
      subjectId: firstSubject ? firstSubject.id : "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subjectId) {
      setError("Select a subject first");
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      title: form.title.trim(),
      url: extractDriveId(form.url),
      semester:
        typeof form.semester === "number"
          ? form.semester
          : Number(form.semester),
      subject: form.subjectId,
      category: form.category,
    };

    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from("resources")
          .update(payload)
          .eq("id", editingId);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("resources")
          .insert(payload);

        if (insertError) throw insertError;
      }

      await refreshData();
      resetForm();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unable to save resource";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingId(resource.id);
    setForm({
      title: resource.title,
      url: resource.url,
      semester: resource.semester,
      subjectId: resource.subject,
      category: resource.category as keyof EnabledCategories,
    });
    setError(null);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "This will delete the resource. Continue?"
    );
    if (!confirmed) return;

    setSaving(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from("resources")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
      await refreshData();
      if (editingId === id) resetForm();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unable to delete resource";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const subjectOptionsForSemester = useMemo(
    () => subjects.filter((s) => s.semester === form.semester),
    [subjects, form.semester]
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>
            {editingId ? "Edit Resource" : "Create Resource"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
                placeholder="Resource title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">Google Drive Link or ID</Label>
              <Input
                id="url"
                value={form.url}
                onChange={(e) => updateForm("url", e.target.value)}
                placeholder="Paste Drive link or file ID"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Semester</Label>
              <Select
                value={String(form.semester)}
                onValueChange={(value) => updateForm("semester", Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((sem) => (
                    <SelectItem key={sem} value={String(sem)}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Subject</Label>
              <Select
                value={form.subjectId || "none"}
                onValueChange={(value) => updateForm("subjectId", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjectOptionsForSemester.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No subjects for this semester
                    </SelectItem>
                  ) : (
                    subjectOptionsForSemester.map((subj) => (
                      <SelectItem key={subj.id} value={subj.id}>
                        {subj.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(value) =>
                  updateForm("category", value as keyof EnabledCategories)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.length === 0 ? (
                    <SelectItem value="notes">Notes</SelectItem>
                  ) : (
                    availableCategories.map((key) => (
                      <SelectItem key={key} value={key}>
                        {categoryLabels[key]}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-2">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <p className="text-sm text-muted-foreground">
              Loading resources...
            </p>
          ) : sortedResources.length === 0 ? (
            <p className="text-sm text-muted-foreground">No resources found.</p>
          ) : (
            <div className="space-y-3">
              {sortedResources.map((res) => {
                const resSubject = subjects.find((s) => s.id === res.subject);
                return (
                  <div key={res.id} className="rounded-lg border p-3 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{res.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Semester {res.semester} ·{" "}
                          {resSubject?.name || "Unknown"}
                        </p>
                        <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-1 text-xs">
                          {categoryLabels[
                            res.category as keyof EnabledCategories
                          ] || res.category}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(res)}
                          disabled={saving}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(res.id)}
                          disabled={saving}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
