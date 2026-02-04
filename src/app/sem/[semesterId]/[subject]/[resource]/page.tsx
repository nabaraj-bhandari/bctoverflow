"use client";
import Link from "next/link";
import { ResourceCard } from "@/components/resource-card";
import { useResourceSections } from "@/hooks/useCatalogData";
import { use } from "react";
import { Section } from "@/lib/types";

export default function SectionsPage({
  params,
}: {
  params: Promise<{ resource: string; subject: string }>;
}) {
  const { resource, subject } = use(params);
  const { sections, isLoading, error } = useResourceSections(subject, resource);

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
        <p className="text-destructive">Error loading sections</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl p-4">
      {sections.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {sections.map((section: Section) => (
            <Link
              key={section.id}
              href={`/viewer?pdf=${encodeURIComponent(section.url)}&title=${encodeURIComponent(section.title)}&resourceTitle=${encodeURIComponent(resource)}`}
            >
              <ResourceCard resource={section} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center text-muted-foreground">
          <p className="text-lg">No sections found.</p>
        </div>
      )}
    </div>
  );
}
