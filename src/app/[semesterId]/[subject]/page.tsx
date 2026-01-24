import React from "react";
import ResourcesPageClient from "./page.client";
import { getResourcesBySubjectCode } from "@/app/admin/actions/resources";

export default async function ResourcesPage({
  params: paramsPromise,
}: {
  params: Promise<{
    subject: string;
    semesterId: number;
  }>;
}) {
  const params = await paramsPromise;
  console.log("[ResourcesPage] Fetching resources for subject:", params.subject);
  const resources = await getResourcesBySubjectCode(params.subject);
  console.log("[ResourcesPage] Got resources:", resources.length);

  return (
    <ResourcesPageClient
      initialResources={resources}
      subjectCode={params.subject}
      semesterId={params.semesterId}
    />
  );
}
