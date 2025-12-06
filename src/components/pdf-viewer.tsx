"use client";

import { getGoogleDriveEmbedUrl } from "@/lib/utils";
import { Resource } from "@/lib/types";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface PdfViewerProps {
  resource: Resource;
  onClose: () => void;
}

export function PdfViewer({ resource, onClose }: PdfViewerProps) {
  const embedUrl = getGoogleDriveEmbedUrl(resource.link);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in-0"
      onClick={onClose}
    >
      <div
        className="relative h-[95vh] w-[95vw] max-w-4xl bg-background rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-12 bg-background/80 backdrop-blur-sm flex items-center justify-between px-2 z-10">
          <h3 className="text-sm font-medium truncate pl-2 pr-10 text-foreground">{resource.title}</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close viewer" className="absolute top-2 right-2">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="h-full w-full pt-12"
            allow="autoplay"
            title={resource.title}
          ></iframe>
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center text-destructive">
            <p>Could not load PDF. The provided link might be invalid.</p>
          </div>
        )}
      </div>
    </div>
  );
}
