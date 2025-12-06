"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Subject, Resource, EnabledCategories } from "@/lib/types";
import {
  addResourceAction,
  updateResourceAction,
  deleteResourceAction,
  getAllSubjectsAction,
  getAllResourcesAction,
} from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Plus, Trash2, Edit, FileText } from "lucide-react";
type ResourceFormData = Omit<Resource, "id" | "thumbnail" | "thumbnailStatus">;
const categoryKeys: (keyof EnabledCategories)[] = [
  "notes",
  "pyqs",
  "books",
  "lab",
  "exam",
];

export function ResourceManager() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const { register, handleSubmit, control, reset, watch, setValue } =
    useForm<ResourceFormData>({
      defaultValues: { semester: 1, category: "notes" },
    });

  const watchedSemester = watch("semester");

  const fetchAllData = async () => {
    setLoading(true);
    const [allSubjects, allResources] = await Promise.all([
      getAllSubjectsAction(),
      getAllResourcesAction(),
    ]);
    setSubjects(allSubjects);
    setResources(allResources.sort((a, b) => a.title.localeCompare(b.title)));
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    setFilteredSubjects(subjects.filter((s) => s.semester === watchedSemester));
    setValue("subject", "");
  }, [watchedSemester, subjects, setValue]);

  const onSubmit = async (data: ResourceFormData) => {
    setIsSubmitting(true);

    const result = editingResource
      ? await updateResourceAction(editingResource.id, data)
      : await addResourceAction(data);

    if (result.success) {
      setMessage({ type: "success", text: result.message });
      resetForm();
      await fetchAllData();
    } else {
      setMessage({ type: "error", text: result.message });
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will delete the resource permanently."))
      return;
    const result = await deleteResourceAction(id);
    if (result.success) {
      setMessage({ type: "success", text: "Resource deleted" });
      setResources((prev) => prev.filter((r) => r.id !== id));
    } else {
      setMessage({ type: "error", text: result.message });
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setValue("title", resource.title);
    setValue("link", resource.link);
    setValue("semester", resource.semester);
    setValue("subject", resource.subject);
    setValue("category", resource.category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    reset({ semester: 1, category: "notes", title: "", link: "", subject: "" });
    setEditingResource(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Resources</CardTitle>
        <CardDescription>Add, edit, or delete PDF resources.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {message ? (
          <div
            className={`rounded-md border p-3 text-sm ${
              message.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 p-4 border rounded-lg"
        >
          <h3 className="font-semibold text-lg">
            {editingResource ? "Edit Resource" : "Add New Resource"}
          </h3>

          <Input
            {...register("title", { required: true })}
            placeholder="Resource Title"
          />
          <Input
            {...register("link", { required: true })}
            placeholder="Google Drive PDF Link (for viewing)"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Controller
              name="semester"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(v) => field.onChange(Number(v))}
                  value={String(field.value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => (
                      <SelectItem key={s} value={String(s)}>
                        Semester {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={filteredSubjects.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSubjects.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryKeys.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : editingResource ? (
                <Edit className="mr-2 h-4 w-4" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {editingResource ? "Update Resource" : "Add Resource"}
            </Button>
            {editingResource && (
              <Button variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Existing Resources</h3>
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2">
              {resources.map((res) => (
                <div
                  key={res.id}
                  className="flex items-center justify-between p-2 border rounded-md gap-2"
                >
                  <div className="flex items-center gap-3 flex-grow min-w-0">
                    <div className="h-14 w-10 bg-muted rounded-sm flex items-center justify-center">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-grow overflow-hidden">
                      <p className="font-semibold truncate" title={res.title}>
                        {res.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Sem {res.semester} /{" "}
                        {subjects.find((s) => s.id === res.subject)?.name ||
                          res.subject}{" "}
                        / {res.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(res)}
                      title="Edit resource"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(res.id)}
                      title="Delete resource"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
