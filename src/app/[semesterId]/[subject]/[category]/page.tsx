import React from "react";
import ResourcesPageClient from "./page.client";
import { getResources, getSubjectBySlug } from "@/lib/supabase";

const categoryLabels: { [key: string]: string } = {
  notes: "Notes",
  pyqs: "PYQs",
  books: "Books",
  lab: "Lab Reports",
  exam: "Exam Mode",
};

export default function ResourcesPage({
  params: paramsPromise,
}: {
  params: Promise<{
    subject: string;
    category: any;
    semesterId: string;
  }>;
}) {
  const params = React.use(paramsPromise);

  const [resources, subject] = React.use(
    Promise.all([
      getResources(params.subject, params.category),
      getSubjectBySlug(params.subject),
    ])
  );

  const subjectName = subject?.name || "";
  const categoryLabel = categoryLabels[params.category] || params.category;

  return (
    <ResourcesPageClient
      initialResources={resources}
      subjectName={subjectName}
      categoryLabel={categoryLabel}
      subjectSlug={params.subject}
      category={params.category}
      semesterId={params.semesterId}
    />
  );
}
