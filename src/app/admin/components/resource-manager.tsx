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
  } catch {}
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

const STORAGE_KEY = "selected-subject-code";

export function ResourceManager() {
  const [mounted, setMounted] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const [editingId, setEditingId] = useState<string | null>(null);
  type FormState = {
    title: string;
    url: string;
    category: string;
  };

  const emptyForm: FormState = {
    title: "",
    url: "",
    category: "notes",
  };

  const [form, setForm] = useState<FormState>(emptyForm);

  const updateForm = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Load previously selected subject from localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    const allCodes = getAllSubjectCodes();

    if (saved && allCodes.includes(saved)) {
      setSelectedSubject(saved);
    } else if (allCodes.length > 0) {
      setSelectedSubject(allCodes[0]);
    }
  }, []);

  // Save selected subject to localStorage whenever it changes
  useEffect(() => {
    if (selectedSubject) {
      localStorage.setItem(STORAGE_KEY, selectedSubject);
    }
  }, [selectedSubject]);

  const refreshData = useCallback(async () => {
    if (!selectedSubject) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getAllResources();
      setResources(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load resources";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (selectedSubject) {
      void refreshData();
    }
  }, [selectedSubject, refreshData]);

  const filteredResources = useMemo(
    () =>
      resources
        .filter((r) => r.subjectCode === selectedSubject)
        .sort((a, b) => a.title.localeCompare(b.title)),
    [resources, selectedSubject],
  );

  const allSubjectCodes = useMemo(() => getAllSubjectCodes(), []);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubjectChange = (code: string) => {
    setSelectedSubject(code);
    resetForm();
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selectedSubject) {
      setError("Select a subject first");
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      title: form.title.trim(),
      url: extractDriveId(form.url),
      subjectCode: selectedSubject,
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

  const currentSubject = getSubjectByCode(selectedSubject);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Select Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedSubject} onValueChange={handleSubjectChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a subject to manage" />
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
          {currentSubject && (
            <p className="mt-2 text-sm text-muted-foreground">
              Managing resources for:{" "}
              <span className="font-semibold">{currentSubject.title}</span>
            </p>
          )}
        </CardContent>
      </Card>

      {selectedSubject && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>
                {editingId ? "Edit Resource" : "Add Resource"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => updateForm("title", e.target.value)}
                    placeholder="Resource title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">Google Drive Link or ID</Label>
                  <Input
                    id="url"
                    value={form.url}
                    onChange={(e) => updateForm("url", e.target.value)}
                    placeholder="Paste Drive link or file ID"
                  />
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
                  <Button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex-1"
                  >
                    {saving ? "Saving..." : editingId ? "Update" : "Create"}
                  </Button>
                  {editingId && (
                    <Button
                      variant="secondary"
                      onClick={resetForm}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Resources ({filteredResources.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Loading resources...
                  </p>
                </div>
              ) : filteredResources.length === 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    No resources found for this subject.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Add your first resource using the form on the left.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredResources.map((res) => (
                    <div
                      key={res.id}
                      className="rounded-lg border p-3 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-semibold">{res.title}</p>
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
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
