"use client";
import { OnboardingView } from "@/components/OnboardingView";
import { LoadingState } from "@/components/LoadingState";
import { subjectsBySem } from "@/data/subjects";
import { useEffect, useState } from "react";
import { SubjectResourcesSection } from "./SubjectResourcesSection";

const BRANCHES = ["BCT", "BEI"];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const getSubjects = (branch: string, semester?: number) => {
  if (!semester) return [];
  if (branch === "BCT" || branch === "BEI") {
    return subjectsBySem[semester] ?? [];
  }
  return [];
};

export default function HomePage() {
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);

    const savedBranch = localStorage.getItem("config:branch");
    const savedSemester = localStorage.getItem("config:semester");

    if (savedBranch) setSelectedBranch(savedBranch);
    if (savedSemester) setSelectedSemester(parseInt(savedSemester, 10));
    if (savedBranch && savedSemester) setIsConfigured(true);
  }, []);

  const subjects = getSubjects(selectedBranch, selectedSemester ?? undefined);

  const handleSaveConfiguration = () => {
    if (selectedBranch && selectedSemester) {
      localStorage.setItem("config:branch", selectedBranch);
      localStorage.setItem("config:semester", selectedSemester.toString());
      setIsConfigured(true);
    }
  };

  if (!isHydrated) {
    return <LoadingState />;
  }

  return (
    <main className="mx-auto max-w-7xl p-2 md:p-6">
      {!isConfigured ? (
        <OnboardingView
          branches={BRANCHES}
          semesters={SEMESTERS}
          selectedBranch={selectedBranch}
          selectedSemester={selectedSemester}
          onBranchSelect={setSelectedBranch}
          onSemesterSelect={setSelectedSemester}
          onComplete={handleSaveConfiguration}
        />
      ) : (
        <section className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <h1 className="text-lg md:text-xl text-center font-bold text-foreground">
            {selectedBranch} · Semester {selectedSemester}
          </h1>

          <div className="space-y-4 md:space-y-6">
            {subjects.map((subject) => (
              <SubjectResourcesSection key={subject.code} subject={subject} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
