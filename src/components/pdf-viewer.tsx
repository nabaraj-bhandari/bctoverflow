"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Loader2, X } from "lucide-react";
import { cn, getGoogleDriveDownloadUrl } from "@/lib/utils";
import { Resource } from "@/lib/types";
import { usePdfFile } from "@/hooks/usePdfFile";

interface PdfViewerProps {
  resource: Resource;
  onClose: () => void;
}

export default function PdfViewer({ resource, onClose }: PdfViewerProps) {
  const [PDFDocument, setPDFDocument] = useState<any>(null);
  const [PDFPage, setPDFPage] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const loadedPagesRef = useRef<number | null>(null);

  // Client-only dynamic import
  useEffect(() => {
    (async () => {
      const pdfModule = await import("react-pdf");
      const { pdfjs } = pdfModule;
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.react-pdf.min.mjs";

      setPDFDocument(() => pdfModule.Document);
      setPDFPage(() => pdfModule.Page);
    })();
  }, []);

  const downloadUrl = useMemo(
    () => getGoogleDriveDownloadUrl(resource.url) || resource.url,
    [resource.url]
  );

  const proxyUrl = useMemo(
    () =>
      downloadUrl
        ? `/api/pdf-proxy?file=${encodeURIComponent(downloadUrl)}`
        : null,
    [downloadUrl]
  );

  const cacheKey = useMemo(
    () => resource.id || downloadUrl || "unknown",
    [resource.id, downloadUrl]
  );

  const { memoizedFile, loading, error, setError, setLoading } = usePdfFile(
    proxyUrl,
    cacheKey
  );

  useEffect(() => {
    loadedPagesRef.current = null;
    setNumPages(0);
  }, [proxyUrl]);

  const handleLoadSuccess = useCallback((pdf: { numPages: number }) => {
    if (loadedPagesRef.current === pdf.numPages) return;
    loadedPagesRef.current = pdf.numPages;
    setNumPages(pdf.numPages);
    // loading is cleared in fetch/cached path; avoid toggling here to prevent repeated renders
  }, []);

  if (!PDFDocument || !PDFPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/90">
        <Loader2 className="h-6 w-6 animate-spin text-white/80" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm overscroll-none">
      <header className="flex items-center justify-between gap-3 border-b border-white/10 bg-black/70 px-4 py-2 text-white">
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">{resource.title}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md border border-white/20 text-white transition hover:border-white/40 hover:bg-white/10"
          )}
          aria-label="Close PDF viewer"
        >
          <X className="h-6 w-6" />
        </button>
      </header>

      <div className="flex-1 overflow-auto p-2">
        {loading && (
          <div className="flex h-full items-center justify-center text-white/80">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {error && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-white/80">
            <p>{error}</p>
          </div>
        )}

        {proxyUrl && !error && memoizedFile && (
          <PDFDocument
            file={memoizedFile}
            onLoadSuccess={handleLoadSuccess}
            onLoadError={(err: any) => {
              console.error(err);
              setError("Failed to load PDF");
              setLoading(false);
            }}
            loading=""
          >
            {Array.from({ length: numPages }, (_, i) => (
              <div
                key={`page_${i + 1}`}
                className="flex justify-center mb-4 last:mb-0 w-full"
              >
                <PDFPage
                  width={window.innerWidth * 0.95}
                  pageNumber={i + 1}
                  renderAnnotationLayer={true}
                  renderTextLayer={true}
                />
              </div>
            ))}
          </PDFDocument>
        )}
      </div>
    </div>
  );
}
