"use client";

import { usePdfViewer } from "@/lib/pdf-viewer";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Resource } from "@/lib/types";

interface PdfViewerProps {
  resource: Resource;
  onClose: () => void;
}

export default function PdfViewer({ resource, onClose }: PdfViewerProps) {
  const {
    pageNumber,
    numPages,
    loading,
    error,
    rendering,
    jumpInput,
    canvasRef,
    canvasWrapperRef,
    jumpInputRef,
    setJumpInput,
    handleJumpSubmit,
    handlePointerDown,
    handlePointerMove,
    handlePointerEnd,
  } = usePdfViewer(resource);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm overscroll-none">
      <header className="flex items-center justify-between gap-3 border-b border-white/10 bg-black/70 px-4 py-2 text-white">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{resource.title}</p>
          <p className="text-[11px] text-white/60">
            Page {pageNumber}
            {numPages ? ` / ${numPages}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <form className="flex items-center gap-2" onSubmit={handleJumpSubmit}>
            <label className="text-xs text-white/70" htmlFor="jump-input">
              Jump to
            </label>
            <input
              id="jump-input"
              type="number"
              min={1}
              max={numPages || undefined}
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              onFocus={() => setJumpInput("")}
              ref={jumpInputRef}
              className="h-8 w-20 rounded border border-white/20 bg-black/40 px-2 text-sm text-white outline-none ring-0 focus:border-white/50"
            />
          </form>
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
        </div>
      </header>

      <div className="flex-1 overflow-hidden p-2">
        {loading ? (
          <div className="flex h-full items-center justify-center text-white/80">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-white/80">
            <p>{error}</p>
          </div>
        ) : (
          <div
            ref={canvasWrapperRef}
            className="flex h-full items-center justify-center overflow-auto"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
          >
            <canvas ref={canvasRef} className="shadow-xl" />
          </div>
        )}
      </div>

      {rendering && !loading && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 text-white/70">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
    </div>
  );
}
