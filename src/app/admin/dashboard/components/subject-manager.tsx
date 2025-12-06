"use client";

import { useEffect, useState } from "react";
import { Subject, EnabledCategories } from "@/lib/types";
import { getSubjects } from "@/lib/supabase";
import {
  addSubjectAction,
  updateSubjectAction,
  deleteSubjectAction,
} from "../actions";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
import { Loader2, Plus, Trash2, Edit } from "lucide-react";

type SubjectFormData = {
  name: string;
  slug: string;
  enabledCategories: EnabledCategories;
};

const categoryKeys: (keyof EnabledCategories)[] = [
  "notes",
  "pyqs",
  "books",
  "lab",
  "exam",
];

export function SubjectManager() {
  const [semester, setSemester] = useState(1);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { register, handleSubmit, control, reset, setValue, watch } =
    useForm<SubjectFormData>({
      defaultValues: {
        name: "",
        slug: "",
        enabledCategories: {
          notes: true,
          pyqs: true,
          books: true,
          lab: false,
          exam: false,
        },
      },
    });

  useEffect(() => {
    async function fetchSubjects() {
      setLoading(true);
      const fetchedSubjects = await getSubjects(semester);
      setSubjects(fetchedSubjects);
      setLoading(false);
    }
    fetchSubjects();
  }, [semester]);

  const handleSemesterChange = (value: string) => {
    setSemester(Number(value));
    setEditingSubject(null);
    reset();
  };

  const onSubmit = async (data: SubjectFormData) => {
    setIsSubmitting(true);
    const action = editingSubject
      ? updateSubjectAction(
          editingSubject.id,
          data.name,
          data.slug,
          data.enabledCategories
        )
      : addSubjectAction(
          semester,
          data.name,
          data.slug,
          data.enabledCategories
        );

    const result = await action;

    if (result.success) {
      setMessage({ type: "success", text: result.message });
      const fetchedSubjects = await getSubjects(semester);
      setSubjects(fetchedSubjects);
      reset();
      setEditingSubject(null);
    } else {
      setMessage({ type: "error", text: result.message });
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this subject? This action cannot be undone."
      )
    )
      return;

    const result = await deleteSubjectAction(id);
    if (result.success) {
      setMessage({ type: "success", text: "Subject deleted" });
      setSubjects(subjects.filter((s) => s.id !== id));
    } else {
      setMessage({ type: "error", text: result.message });
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setValue("name", subject.name);
    setValue("slug", subject.slug || "");
    setValue("enabledCategories", subject.enabledCategories);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Subjects</CardTitle>
        <CardDescription>
          Add, edit, or delete subjects for each semester.
        </CardDescription>
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

        <div className="flex items-center gap-4">
          <Label htmlFor="semester-select">Semester</Label>
          <Select
            onValueChange={handleSemesterChange}
            defaultValue={String(semester)}
          >
            <SelectTrigger id="semester-select" className="w-[180px]">
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => (
                <SelectItem key={sem} value={String(sem)}>
                  Semester {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 p-4 border rounded-lg"
        >
          <h3 className="font-semibold text-lg">
            {editingSubject ? "Edit Subject" : "Add New Subject"}
          </h3>
          <Input
            {...register("name", { required: true })}
            placeholder="Subject Name"
          />
          <Input
            {...register("slug", { required: true })}
            placeholder="subject-slug"
          />
          <div className="space-y-2">
            <Label>Enabled Categories</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categoryKeys.map((key) => (
                <div key={key} className="flex items-center gap-2">
                  <Controller
                    name={`enabledCategories.${key}`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={key}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor={key} className="capitalize">
                    {key === "pyqs" ? "PYQs" : key}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : editingSubject ? (
                <Edit className="mr-2 h-4 w-4" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {editingSubject ? "Update Subject" : "Add Subject"}
            </Button>
            {editingSubject && (
              <Button
                variant="ghost"
                onClick={() => {
                  setEditingSubject(null);
                  reset();
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg">
            Existing Subjects for Semester {semester}
          </h3>
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : subjects.length > 0 ? (
            <ul className="space-y-2">
              {subjects.map((subject) => (
                <li
                  key={subject.id}
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <span>{subject.name}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(subject)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(subject.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">
              No subjects found for this semester.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
