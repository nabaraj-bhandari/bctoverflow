"use client";

import { useState } from "react";
import { Resource } from "@/lib/types";
import { ResourceCard } from "@/components/resource-card";
import { PdfViewer } from "@/components/pdf-viewer";
import { Loader2 } from "lucide-react";
import { useRecentResources } from "@/hooks/use-recent";

interface ResourcesPageClientProps {
  initialResources: Resource[];
  subjectName: string;
  categoryLabel: string;
}

export default function ResourcesPageClient({
  initialResources,
  subjectName,
  categoryLabel,
}: ResourcesPageClientProps) {
  const [resources] = useState<Resource[]>(initialResources);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const { addRecent } = useRecentResources();

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
                addRecent(resource);
                setSelectedResource(resource);
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

      {selectedResource && (
        <PdfViewer
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </div>
  );
}
