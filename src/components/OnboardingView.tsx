// components/OnboardingView.tsx
"use client";
import { BranchSelector } from "@/components/BranchSelector";
import { SemesterSelector } from "@/components/SemesterSelector";
import { ArrowRight } from "lucide-react";

interface OnboardingViewProps {
  branches: string[];
  semesters: number[];
  selectedBranch: string;
  selectedSemester: number | null;
  onBranchSelect: (branch: string) => void;
  onSemesterSelect: (semester: number) => void;
  onComplete: () => void;
}

export function OnboardingView({
  branches,
  semesters,
  selectedBranch,
  selectedSemester,
  onBranchSelect,
  onSemesterSelect,
  onComplete,
}: OnboardingViewProps) {
  return (
    <div className="space-y-6 lg:space-y-10 max-w-2xl mx-auto py-2 md:py-12">
      <div className="flex items-center justify-center gap-2">
        <div
          className={`h-2 w-16 rounded-full transition-all ${
            selectedBranch ? "bg-primary" : "bg-white/10"
          }`}
        />
        <div
          className={`h-2 w-16 rounded-full transition-all ${
            selectedSemester ? "bg-primary" : "bg-white/10"
          }`}
        />
      </div>

      <BranchSelector
        branches={branches}
        selectedBranch={selectedBranch}
        onSelect={onBranchSelect}
      />

      {selectedBranch && (
        <SemesterSelector
          semesters={semesters}
          selectedSemester={selectedSemester}
          onSelect={onSemesterSelect}
        />
      )}

      {selectedBranch && selectedSemester && (
        <div className="flex justify-center animate-in fade-in slide-in-from-top-2 duration-300">
          <button
            onClick={onComplete}
            className="group rounded-xl px-8 py-3.5 backdrop-blur-md bg-primary hover:bg-primary/90 border border-primary/50 text-white font-semibold shadow-xl transition-all hover:scale-105 flex items-center gap-2"
          >
            Continue to Resources
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
