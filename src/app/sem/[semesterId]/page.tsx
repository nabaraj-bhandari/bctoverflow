import Link from "next/link";
import { BookOpen } from "lucide-react";
import React from "react";
import { Subject, subjectsBySem } from "@/data/subjects";

export default function SubjectsPage({
  params: paramsPromise,
}: {
  params: Promise<{ semesterId: string }>;
}) {
  const params = React.use(paramsPromise);
  const semester = parseInt(params.semesterId);
  const subjects = subjectsBySem[semester];

  if (isNaN(semester) || semester < 1 || semester > 8) {
    return <div className="p-4">Invalid semester format in URL.</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl p-4">
      {subjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject: Subject) => (
            <Link key={subject.code} href={`/sem/${semester}/${subject.code}`}>
              <div className="h-20 rounded-lg border bg-card p-4 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold md:text-lg">{subject.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground mt-16">
          <p className="text-lg">No subjects found for this semester.</p>
          <p>Will be updated soon.</p>
        </div>
      )}
    </div>
  );
}
