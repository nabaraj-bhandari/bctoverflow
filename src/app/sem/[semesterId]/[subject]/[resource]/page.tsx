import Link from "next/link";
import { ResourceCard } from "@/components/resource-card";
import { Section } from "@/lib/types";

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{
    resource: string;
  }>;
}) {
  const { resource } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/resource?id=${resource}`,
    { next: { revalidate: 60 * 5 } },
  );
  const sections: Section[] = await res.json();

  return (
    <div className="container mx-auto max-w-6xl p-4">
      {sections.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {sections.map((section) => (
            <Link
              key={section.id}
              href={`/viewer?pdf=${encodeURIComponent(section.url)}&title=${encodeURIComponent(section.title)}`}
            >
              <ResourceCard resource={section} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center text-muted-foreground">
          <p className="text-lg">No resources found for this subject.</p>
          <p>Try selecting a different subject!</p>
        </div>
      )}
    </div>
  );
}
