import { Resource, Section } from "@/lib/types";
import { cn } from "@/lib/utils";

const COLORS = [
  "bg-blue-900/20",
  "bg-purple-900/20",
  "bg-pink-900/20",
  "bg-red-900/20",
  "bg-orange-900/20",
  "bg-yellow-900/20",
  "bg-green-900/20",
  "bg-teal-900/20",
];

const colorFromId = (id: string) =>
  COLORS[id.split("").reduce((h, c) => h + c.charCodeAt(0), 0) % COLORS.length];

export function ResourceCard({ resource }: { resource: Resource | Section }) {
  return (
    <div className="group relative aspect-3/4 w-full">
      <div
        className={cn(
          "relative h-full w-full cursor-pointer overflow-hidden rounded-lg border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/20",
          colorFromId(resource.id),
        )}
      >
        <div className="bg-black/40 px-3 py-2 backdrop-blur-sm">
          <p className="line-clamp-3 text-sm font-semibold leading-snug">
            {resource.title}
          </p>
        </div>
      </div>
    </div>
  );
}
