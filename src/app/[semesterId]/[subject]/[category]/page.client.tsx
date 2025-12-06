"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Resource } from "@/lib/types";
import { ResourceCard } from "@/components/resource-card";
import { Loader2 } from "lucide-react";
import { extractGoogleDriveId } from "@/lib/utils";

interface ResourcesPageClientProps {
  initialResources: Resource[];
  subjectName: string;
  categoryLabel: string;
  subjectSlug: string;
  category: string;
  semesterId: string;
}

export default function ResourcesPageClient({
  initialResources,
  categoryLabel,
  subjectSlug,
  category,
  semesterId,
}: ResourcesPageClientProps) {
  const router = useRouter();
  const resources = useMemo<Resource[]>(
    () => initialResources || [],
    [initialResources]
  );

  if (!initialResources) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl p-4">
      {resources.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onView={() => {
                const driveId =
                  extractGoogleDriveId(resource.url) || resource.id;
                router.push(
                  `/${semesterId}/${subjectSlug}/${category}/${driveId}`
                );
              }}
            />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center text-muted-foreground">
          <p className="text-lg">{categoryLabel} will be updated soon.</p>
          <p>Check back later!</p>
        </div>
      )}
    </div>
  );
}
