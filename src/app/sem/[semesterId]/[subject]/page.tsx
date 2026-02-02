import Link from "next/link";
import { ResourceCard } from "@/components/resource-card";
import { Resource } from "@/lib/types";

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{
    semesterId: number;
    subject: string;
  }>;
}) {
  const { semesterId, subject } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/subject?code=${subject}`,
    { cache: "no-store" },
  );

  const resources: Resource[] = await res.json();

  return (
    <div className="container mx-auto max-w-6xl p-4">
      {resources.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {resources.map((resource) => (
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
          <p>Try selecting a different subject!</p>
        </div>
      )}
    </div>
  );
}
