"use client";

import { useEffect, useState } from "react";
import { X, Check, Trash2 } from "lucide-react";

const branches = ["BCT", "BEI"];
const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

async function clearAllSiteData() {
  localStorage.clear();
  sessionStorage.clear();

  if ("caches" in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
  }

  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations.map((registration) => registration.unregister()),
    );
  }

  alert("Cache cleared successfully! Your settings have been preserved.");
  window.location.reload();
}
export function SettingsModal({ isOpen, onClose }: ModalProps) {
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);

  const handleBranchChange = (branch: string) => {
    setSelectedBranch(branch);
    localStorage.setItem("config:branch", branch);
  };

  const handleSemesterChange = (semester: number) => {
    setSelectedSemester(semester);
    localStorage.setItem("config:semester", semester.toString());
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed top-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-5 fade-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Settings
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <div className="space-y-3">
            <label className="text-foreground font-semibold text-sm block">
              Branch
            </label>
            <div className="grid grid-cols-2 gap-3">
              {branches.map((branch) => (
                <button
                  key={branch}
                  onClick={() => handleBranchChange(branch)}
                  className={`px-4 py-3 rounded-lg backdrop-blur-md border transition-all ${
                    selectedBranch === branch
                      ? "bg-white/15 border-primary/50"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <span className="font-medium text-foreground flex justify-between items-center">
                    {branch}
                    {selectedBranch === branch && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-foreground font-semibold text-sm block">
              Semester
            </label>
            <div className="grid grid-cols-4 gap-2">
              {semesters.map((semester) => (
                <button
                  key={semester}
                  onClick={() => handleSemesterChange(semester)}
                  className={`px-3 py-3 rounded-lg backdrop-blur-md border transition-all ${
                    selectedSemester === semester
                      ? "bg-white/15 border-primary/50"
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
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <label className="text-foreground font-semibold text-sm block">
              Data Management
            </label>
            <button
              onClick={() => clearAllSiteData()}
              className="w-full px-4 py-3 rounded-lg backdrop-blur-md bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/40 transition-all text-red-500 font-medium flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Cache
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
