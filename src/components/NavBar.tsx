"use client";

import { SettingsModal } from "@/components/SettingsModal";
import { Bell, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface NavBarProps {
  hasNewNotices: boolean;
}

export default function NavBar({ hasNewNotices }: NavBarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <nav className="w-full bg-white/0 backdrop-blur-lg border-b border-white/20">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 select-none hover:opacity-90 transition-opacity"
          >
            <Image
              src="/logo.png"
              alt="BCT Overflow"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="text-lg font-semibold text-foreground tracking-tight">
              BCT Overflow
            </span>
          </Link>

          <div className="flex gap-2">
            <div
              aria-label="Notices"
              className="relative flex items-center justify-center w-10 h-10 rounded-xl text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-default"
            >
              <Bell className="w-5 h-5" />
              {hasNewNotices && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
            <button
              aria-label="Settings"
              className="relative flex items-center justify-center w-10 h-10 rounded-xl text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-default"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
