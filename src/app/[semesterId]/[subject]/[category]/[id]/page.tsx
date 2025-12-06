import React from "react";
import { notFound } from "next/navigation";
import PdfRouteClient from "./page.client";
import { getResources } from "@/lib/supabase";
import { extractGoogleDriveId } from "@/lib/utils";

export default function PdfRoutePage({
  params: paramsPromise,
}: {
  params: Promise<{
    semesterId: string;
    subject: string;
    category: string;
    id: string;
  }>;
}) {
  const params = React.use(paramsPromise);

  const [resourceList] = React.use(
    Promise.all([getResources(params.subject, params.category as any)])
  ) as [Awaited<ReturnType<typeof getResources>>];

  const resource = resourceList?.find((r) => {
    const driveId = extractGoogleDriveId(r.url);
    return driveId === params.id || r.id === params.id;
  });
  if (!resource) {
    notFound();
  }

  return <PdfRouteClient resource={resource} />;
}
