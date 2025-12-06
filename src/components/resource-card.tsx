"use client";

import { Card } from "@/components/ui/card";
import { Resource } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ResourceCardProps {
  resource: Resource;
  onView: () => void;
}

export function ResourceCard({ resource, onView }: ResourceCardProps) {
  const getBackgroundColor = (id: string) => {
    const colors = [
      "bg-blue-900/20",
      "bg-purple-900/20",
      "bg-pink-900/20",
      "bg-red-900/20",
      "bg-orange-900/20",
      "bg-yellow-900/20",
      "bg-green-900/20",
      "bg-teal-900/20",
    ];
    // Simple hash to get a consistent color for each resource
    const hash = id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="group relative aspect-[3/4] w-full">
      <Card
        className={cn(
            "h-full w-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 cursor-pointer flex flex-col justify-center items-center p-4 text-center",
            getBackgroundColor(resource.id)
        )}
        onClick={onView}
      >
        <div className="relative flex-grow w-full">
          <div
            className={cn(
              "absolute inset-0 flex flex-col overflow-hidden rounded-lg border border-white/5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white",
              getBackgroundColor(resource.id)
            )}
          >
            <div className="grid flex-1 grid-cols-4 gap-1 p-3 opacity-80">
              {Array.from({ length: 16 }).map((_, idx) => (
                <span
                  key={idx}
                  className="h-2 rounded-sm bg-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
                />
              ))}
            </div>
            <div className="relative bg-black/40 px-3 py-2 backdrop-blur-sm">
              <p className="line-clamp-3 text-sm font-semibold leading-snug">
                {resource.title}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
