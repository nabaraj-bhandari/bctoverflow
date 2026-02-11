"use client";
import { useSubjectResources } from "@/hooks/useCatalogData";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ResourceCard } from "./ResourceCard";

type Props = {
  subject: {
    code: string;
    title: string;
  };
};

export function SubjectResourcesSection({ subject }: Props) {
  const resources = useSubjectResources(subject.code);
  const [expanded, setExpanded] = useState(false);

  if (resources.length === 0) return null;

  return (
    <>
      <section className="backdrop-blur-md bg-white/5 border border-white/10 rounded-sm overflow-hidden transition-all duration-300 hover:bg-white/8 hover:border-white/15">
        <div
          className="flex items-center justify-between cursor-pointer px-4 py-3 select-none"
          onClick={() => setExpanded((v) => !v)}
        >
          <div>
            <h2 className="text-base md:text-lg font-semibold text-foreground">
              {subject.title}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {resources.length} resource{resources.length !== 1 ? "s" : ""}{" "}
              available
            </p>
          </div>
          <button className="text-primary p-1 rounded-sm hover:bg-white/5 transition-colors">
            <ChevronDown
              className={`w-6 h-6 transition-transform duration-300 ease-out ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
        {expanded && (
          <div className="border-t border-white/10 bg-white/3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-4">
              {resources.map((resource) => (
                <Link
                  key={resource.id}
                  href={`/viewer?subject=${subject.code}&resource=${resource.id}`}
                  className="cursor-pointer"
                >
                  <ResourceCard resource={resource} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
