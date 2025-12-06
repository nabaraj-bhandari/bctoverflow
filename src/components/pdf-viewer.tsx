"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn, getGoogleDriveEmbedUrl } from "@/lib/utils";
import { Resource } from "@/lib/types";

interface PdfViewerProps {
  resource: Resource;
  onClose: () => void;
}

// Prevent pull-to-refresh and overscroll bounce when viewer is open
const useDisableRefresh = () => {
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    const originalBodyOverscroll = body.style.overscrollBehavior;
    const originalHtmlOverscroll = html.style.overscrollBehavior;
    const originalBodyOverflow = body.style.overflow;
    const originalHtmlOverflow = html.style.overflow;

    body.style.overscrollBehavior = "none";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";

    return () => {
      body.style.overscrollBehavior = originalBodyOverscroll;
      html.style.overscrollBehavior = originalHtmlOverscroll;
      body.style.overflow = originalBodyOverflow;
      html.style.overflow = originalHtmlOverflow;
    };
  }, []);
};

export function PdfViewer({ resource, onClose }: PdfViewerProps) {
  useDisableRefresh();

  const embedUrl = getGoogleDriveEmbedUrl(resource.url) || resource.url;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm overscroll-none">
      <header className="flex items-center justify-between gap-3 border-b border-white/10 bg-black/60 px-4 py-2 text-white">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{resource.title}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-white/40 hover:bg-white/10"
          )}
          aria-label="Close PDF viewer"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="flex-1 overflow-hidden">
        {embedUrl ? (
          <div className="relative h-full w-full">
            <div
              className="absolute top-0 right-0 z-10"
              style={{
                width: "60px",
                height: "60px",
                background: "transparent",
              }}
            />

            <iframe
              key={embedUrl}
              src={embedUrl}
              className="h-full w-full border-0 select-none"
              loading="lazy"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              sandbox="allow-same-origin allow-scripts allow-popups"
              style={{ touchAction: "none" }}
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-white/80">
            Unable to load document.
          </div>
        )}
      </div>
    </div>
  );
}
