import { Resource } from "@/lib/types";
import Image from "next/image";

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <div className="relative aspect-3/4 min-w-36 sm:min-w-0 overflow-hidden rounded-sm border border-white/20 cursor-pointer">
      <Image src="/notebook_cover.webp" alt={resource.title} fill />

      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
      <div className="absolute z-10 inset-x-0 bottom-0 p-2 ">
        <p className="line-clamp-2 text-xs sm:text-sm font-medium text-white">
          {resource.title}
        </p>
      </div>
    </div>
  );
}
