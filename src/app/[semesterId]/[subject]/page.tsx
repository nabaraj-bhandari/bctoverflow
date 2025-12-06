import { getSubjectBySlug } from "@/lib/supabase";
import { EnabledCategories } from "@/lib/types";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Book,
  FileText,
  FlaskConical,
  GraduationCap,
  Zap,
} from "lucide-react";
import React from "react";

export default function SubjectCategoriesPage({
  params: paramsPromise,
}: {
  params: Promise<{ semesterId: string; subject: string }>;
}) {
  const params = React.use(paramsPromise);
  const semesterId = params.semesterId;
  const subjectSlug = params.subject;

  const subject = React.use(getSubjectBySlug(subjectSlug));

  if (!subject) {
    return <div className="p-4">Subject not found.</div>;
  }

  const allCategories: {
    key: keyof EnabledCategories;
    label: string;
    icon: React.ElementType;
  }[] = [
    { key: "notes", label: "Notes", icon: FileText },
    { key: "pyqs", label: "PYQs", icon: Zap },
    { key: "books", label: "Books", icon: Book },
    { key: "lab", label: "Lab Reports", icon: FlaskConical },
    { key: "exam", label: "Exam Mode", icon: GraduationCap },
  ];

  const enabledCategories = allCategories.filter(
    (cat) => subject.enabledCategories[cat.key]
  );

  return (
    <div className="container mx-auto max-w-4xl p-4">
      {enabledCategories.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {enabledCategories.map((category) => (
            <Link
              key={category.key}
              href={`/${semesterId}/${subjectSlug}/${category.key}`}
            >
              <Card className="group transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{category.label}</CardTitle>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center text-muted-foreground">
          <p className="text-lg">
            No resource categories available for this subject.
          </p>
        </div>
      )}
    </div>
  );
}
