"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { Resource } from "@/lib/types";
import { subjectsBySem } from "@/data/subjects";
import {
  getAllResources,
  createResourceAction,
  updateResourceAction,
  deleteResourceAction,
} from "@/app/admin/actions/resources";

const categoryLabels: Record<string, string> = {
  notes: "Notes",
  pyqs: "PYQs",
  books: "Books",
  exam: "Exam",
  syllabus: "Syllabus",
  assessments: "Assessments",
  lab: "Lab Reports",
};

const extractDriveId = (link: string): string => {
  const trimmed = link.trim();
  try {
    const url = new URL(trimmed);
    const match = url.pathname.match(/\/file\/d\/([^/]+)/);
    if (match?.[1]) return match[1];
    const idParam = url.searchParams.get("id");
    if (idParam) return idParam;
  } catch { }
  return trimmed;
};

// Map subject code to subject object
const getSubjectByCode = (code: string) => {
  for (const semesterSubjects of Object.values(subjectsBySem)) {
    const found = semesterSubjects.find((s) => s.code === code);
    if (found) return found;
  }
  return null;
};

// Get all subject codes
const getAllSubjectCodes = () => {
  const codes: string[] = [];
  for (const subjects of Object.values(subjectsBySem)) {
    codes.push(...subjects.map((s) => s.code));
  }
  return codes;
};

export function ResourceManager() {
  const [mounted, setMounted] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  type FormState = {
    title: string;
    url: string;
    subjectCode: string;
    category: string;
  };

  const emptyForm: FormState = {
    title: "",
    url: "",
    subjectCode: "",
    category: "notes",
  };

  const [form, setForm] = useState<FormState>(emptyForm);

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("[ResourceManager] Fetching resources...");
      const startTime = Date.now();
      const data = await getAllResources();
      const duration = Date.now() - startTime;
      console.log(`[ResourceManager] Fetched ${data.length} resources in ${duration}ms`);
      setResources(data);

      // Set default subject on first load
      const allCodes = getAllSubjectCodes();
      if (!form.subjectCode && allCodes.length > 0) {
        setForm((prev) => ({
          ...prev,
          subjectCode: allCodes[0],
        }));
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load resources";
      console.error("[ResourceManager] Error fetching resources:", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [form.subjectCode]);

  useEffect(() => {
    setMounted(true);
    void refreshData();
  }, [refreshData]);

  const sortedResources = useMemo(
    () =>
      [...resources].sort(
        (a, b) => a.subjectCode.localeCompare(b.subjectCode) || a.title.localeCompare(b.title),
      ),
    [resources],
  );

  const allSubjectCodes = useMemo(() => getAllSubjectCodes(), []);

  const resetForm = () => {
    setEditingId(null);
    const allCodes = getAllSubjectCodes();
    setForm({
      ...emptyForm,
      subjectCode: allCodes[0] || "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subjectCode) {
      setError("Select a subject first");
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      title: form.title.trim(),
      url: extractDriveId(form.url),
      subjectCode: form.subjectCode,
      category: form.category,
    };

    try {
      if (editingId) {
        const result = await updateResourceAction(editingId, {
          title: payload.title,
          url: payload.url,
          category: payload.category,
        });

        if (!result.success) throw new Error(result.error);
      } else {
        const result = await createResourceAction(payload);

        if (!result.success) throw new Error(result.error);
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
      subjectCode: resource.subjectCode,
      category: resource.category,
    });
    setError(null);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "This will delete the resource. Continue?",
    );
    if (!confirmed) return;

    setSaving(true);
    setError(null);

    try {
      const result = await deleteResourceAction(id);

      if (!result.success) throw new Error(result.error);
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

  if (!mounted) {
    return null;
  }

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
              <Label>Subject</Label>
              <Select
                value={form.subjectCode || ""}
                onValueChange={(value) => updateForm("subjectCode", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {allSubjectCodes.map((code) => {
                    const subject = getSubjectByCode(code);
                    return (
                      <SelectItem key={code} value={code}>
                        {subject?.title || code}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(value) => updateForm("category", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
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
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Loading resources...
              </p>
              <p className="text-xs text-muted-foreground">
                This may take a moment on first load.
              </p>
            </div>
          ) : sortedResources.length === 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">No resources found.</p>
              {error && (
                <p className="text-xs text-destructive">Error: {error}</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {sortedResources.map((res) => {
                const subject = getSubjectByCode(res.subjectCode);
                return (
                  <div key={res.id} className="rounded-lg border p-3 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{res.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {subject?.title || res.subjectCode}
                        </p>
                        <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-1 text-xs">
                          {categoryLabels[res.category] || res.category}
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
