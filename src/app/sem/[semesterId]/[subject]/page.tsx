"use client";
import Link from "next/link";
import { ResourceCard } from "@/components/resource-card";
import { useSubjectResources } from "@/hooks/useCatalogData";
import { use } from "react";
import { Resource } from "@/lib/types";

export default function ResourcesPage({
  params,
}: {
  params: Promise<{ semesterId: number; subject: string }>;
}) {
  const { semesterId, subject } = use(params);
  const { resources, isLoading, error } = useSubjectResources(subject);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl p-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="aspect-3/4 animate-pulse rounded-lg bg-card/60"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-destructive">Error loading resources</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl p-4">
      {resources.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {resources.map((resource: Resource) => (
            <Link
              key={resource.id}
              href={`/sem/${semesterId}/${subject}/${resource.id}`}
            >
              <ResourceCard resource={resource} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center text-muted-foreground">
          <p className="text-lg">No resources found for this subject.</p>
        </div>
      )}
    </div>
  );
}
