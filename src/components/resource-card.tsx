import { Card } from "@/components/ui/card";
import { Resource } from "../lib/types";
import { cn } from "../lib/utils";

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
    const hash = id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="group relative aspect-3/4 w-full">
      <Card
        className={cn(
          "h-full w-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 cursor-pointer relative",
          "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950",
          getBackgroundColor(resource.id),
        )}
        onClick={onView}
      >
        <div className="relative h-full flex flex-col justify-between text-center">
          <div className="bg-black/40 px-3 py-2 backdrop-blur-sm">
            <p className="line-clamp-3 text-sm font-semibold leading-snug">
              {resource.title}
            </p>
          </div>

          <div className="bg-black/40 px-3 py-2 backdrop-blur-sm border-t border-white/5">
            <p className="text-sm font-semibold leading-snug">
              {resource.category.toUpperCase()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
