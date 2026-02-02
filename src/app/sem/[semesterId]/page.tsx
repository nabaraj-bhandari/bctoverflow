import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
              <Card className="h-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="md:text-lg">{subject.title}</CardTitle>
                </CardHeader>
              </Card>
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
