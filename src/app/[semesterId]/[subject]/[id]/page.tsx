import React from "react";
import { notFound } from "next/navigation";
import PdfRouteClient from "./page.client";
import { extractGoogleDriveId } from "@/lib/utils";
import { getResourcesBySubjectCode } from "@/app/admin/actions/resources";
import type { Categories } from "@/lib/types";

export default async function PdfRoutePage({
  params: paramsPromise,
}: {
  params: Promise<{
    semesterId: string;
    subject: string;
    category: keyof Categories;
    id: string;
  }>;
}) {
  const params = await paramsPromise;

  const resourceList = await getResourcesBySubjectCode(params.subject);

  const resource = resourceList?.find((r) => {
    const driveId = extractGoogleDriveId(r.url);
    return driveId === params.id || r.id === params.id;
  });
  if (!resource) {
    notFound();
  }

  return <PdfRouteClient resource={resource} />;
}
