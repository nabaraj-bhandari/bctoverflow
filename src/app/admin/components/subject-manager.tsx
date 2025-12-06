"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { EnabledCategories, Subject } from "@/lib/types";

const semesters = Array.from({ length: 8 }, (_, idx) => idx + 1);

const emptyCategories: EnabledCategories = {
  notes: true,
  pyqs: true,
  books: true,
  lab: false,
  exam: false,
};

const normalizeSubject = (subject: any): Subject => ({
  id: subject.id,
  name: subject.name,
  slug: subject.slug,
  semester: Number(subject.semester),
  enabled_categories:
    subject.enabled_categories ||
    subject.enabledCategories ||
    ({ ...emptyCategories } as EnabledCategories),
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export function SubjectManager() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [semester, setSemester] = useState<number | "">(1);
  const [categories, setCategories] = useState<EnabledCategories>({
    ...emptyCategories,
  });

  useEffect(() => {
    refreshSubjects();
  }, []);

  const sortedSubjects = useMemo(
    () =>
      [...subjects].sort(
        (a, b) => a.semester - b.semester || a.name.localeCompare(b.name)
      ),
    [subjects]
  );

  const refreshSubjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllSubjectsAction();
      setSubjects(data.map(normalizeSubject));
    } catch (err: any) {
      setError(err?.message || "Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setSemester(1);
    setCategories({ ...emptyCategories });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: name.trim(),
      slug: slugify(slug || name),
      semester: typeof semester === "number" ? semester : Number(semester),
      enabled_categories: categories,
    };

    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from("subjects")
          .update(payload)
          .eq("id", editingId);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("subjects")
          .insert(payload);

        if (insertError) throw insertError;
      }

      await refreshSubjects();
      resetForm();
    } catch (err: any) {
      setError(err?.message || "Unable to save subject");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditingId(subject.id);
    setName(subject.name);
    setSlug(subject.slug);
    setSemester(subject.semester);
    setCategories({ ...emptyCategories, ...subject.enabled_categories });
    setError(null);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("This will delete the subject. Continue?");
    if (!confirmed) return;

    setSaving(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from("subjects")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
      await refreshSubjects();
      if (editingId === id) resetForm();
    } catch (err: any) {
      setError(err?.message || "Unable to delete subject");
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = (key: keyof EnabledCategories) => {
    setCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>{editingId ? "Edit Subject" : "Create Subject"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Data Structures"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="data-structures"
              />
            </div>
            <div className="space-y-2">
              <Label>Semester</Label>
              <Select
                value={String(semester)}
                onValueChange={(value) => setSemester(Number(value))}
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
              <Label>Categories</Label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  Object.keys(emptyCategories) as (keyof EnabledCategories)[]
                ).map((key) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
                  >
                    <Checkbox
                      checked={categories[key]}
                      onCheckedChange={() => toggleCategory(key)}
                    />
                    <span className="capitalize">{key}</span>
                  </label>
                ))}
              </div>
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
          <CardTitle>Subjects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading subjects...</p>
          ) : sortedSubjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No subjects found.</p>
          ) : (
            <div className="space-y-3">
              {sortedSubjects.map((subject) => (
                <div
                  key={subject.id}
                  className="rounded-lg border p-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{subject.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Slug: {subject.slug} · Semester {subject.semester}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(subject)}
                        disabled={saving}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(subject.id)}
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
  );
}
