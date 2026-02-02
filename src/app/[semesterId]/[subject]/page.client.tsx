"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Resource } from "../../../lib/types";
import { ResourceCard } from "@/components/resource-card";
import { Loader2 } from "lucide-react";
import { extractGoogleDriveId } from "../../../lib/utils";
import { Button } from "@/components/ui/button";

interface ResourcesPageClientProps {
  initialResources: Resource[];
  subjectCode: string;
  semesterId: number;
}

const CATEGORIES = [
  { label: "All", value: null },
  { label: "Notes", value: "notes" },
  { label: "Books", value: "books" },
  { label: "PYQs", value: "pyqs" },
  { label: "Exams", value: "exam" },
  { label: "Syllabus", value: "syllabus" },
];

export default function ResourcesPageClient({
  initialResources,
  subjectCode,
  semesterId,
}: ResourcesPageClientProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const resources = useMemo<Resource[]>(
    () => initialResources || [],
    [initialResources],
  );

  const filteredResources = useMemo(() => {
    if (!selectedCategory) return resources;
    return resources.filter((r) => r.category === selectedCategory);
  }, [resources, selectedCategory]);

  const availableCategories = useMemo(() => {
    const categories: { label: string; value: string | null }[] = [
      { label: "All", value: null },
    ];
    const uniqueCategories = new Set(resources.map((r) => r.category));

    CATEGORIES.slice(1).forEach((category) => {
      if (category.value && uniqueCategories.has(category.value)) {
        categories.push(category);
      }
    });

    return categories;
  }, [resources]);

  if (!initialResources) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl p-4">
      {/* Category Filter Chips */}
      {availableCategories.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {availableCategories.map((category) => (
            <Button
              key={category.value || "all"}
              variant={
                selectedCategory === category.value ? "default" : "outline"
              }
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className="rounded-full"
            >
              {category.label}
            </Button>
          ))}
        </div>
      )}

      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onView={() => {
                const driveId =
                  extractGoogleDriveId(resource.url) || resource.id;
                router.push(`/${semesterId}/${subjectCode}/${driveId}`);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center text-muted-foreground">
          <p className="text-lg">No resources found for this category.</p>
          <p>Try selecting a different category!</p>
        </div>
      )}
    </div>
  );
}
