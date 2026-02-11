// components/SemesterSelector.tsx
"use client";
import { Check } from "lucide-react";

interface SemesterSelectorProps {
  semesters: number[];
  selectedSemester: number | null;
  onSelect: (semester: number) => void;
}

export function SemesterSelector({
  semesters,
  selectedSemester,
  onSelect,
}: SemesterSelectorProps) {
  return (
    <section className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="text-center space-y-2">
        <p className="text-md text-muted-foreground">Choose your semester</p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {semesters.map((semester) => (
          <button
            key={semester}
            onClick={() => onSelect(semester)}
            className={`rounded-md p-4 backdrop-blur-md border transition-all shadow-lg flex justify-center ${
              selectedSemester === semester
                ? "bg-white/15 border-primary/50 ring-2 ring-primary/30"
                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
            }`}
          >
            <span className="font-semibold text-lg text-foreground flex items-center gap-2">
              {semester}

              <Check
                className={`w-4 h-4 text-primary transition-all duration-200 ${
                  selectedSemester === semester
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-75"
                }`}
              />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
