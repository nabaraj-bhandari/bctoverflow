// components/BranchSelector.tsx
"use client";
import { Check } from "lucide-react";

interface BranchSelectorProps {
  branches: string[];
  selectedBranch: string;
  onSelect: (branch: string) => void;
}

export function BranchSelector({
  branches,
  selectedBranch,
  onSelect,
}: BranchSelectorProps) {
  return (
    <section className="space-y-4">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome! Let&apos;s get started
        </h1>
        <p className="text-md text-muted-foreground">Choose your branch</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {branches.map((branch) => (
          <button
            key={branch}
            onClick={() => onSelect(branch)}
            className={`rounded-md p-6 backdrop-blur-md border transition-all shadow-lg group ${
              selectedBranch === branch
                ? "bg-white/15 border-primary/50 ring-2 ring-primary/30"
                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
            }`}
          >
            <span className="font-semibold text-lg text-foreground flex justify-between items-center">
              {branch}

              <Check
                className={`w-4 h-4 text-primary transition-all duration-200 ${
                  selectedBranch === branch
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-75"
                }`}
              />
            </span>
            <p className="text-xs text-muted-foreground text-left">
              {branch === "BCT"
                ? "Computer Engineering"
                : "Electronics & Communication"}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
