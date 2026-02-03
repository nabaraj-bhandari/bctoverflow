"use client";

import {
  ComponentType,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Loader2, X, Download } from "lucide-react";
import { cn, slugify } from "../lib/utils";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import type { DocumentProps, PageProps } from "react-pdf";

// Import required CSS for text and annotation layers
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

const RENDER_TEXT = true; // Enable text selection
const RENDER_ANNOTATIONS = true; // Enable annotations

interface PdfViewerProps {
  url: string;
  title: string;
  resourceTitle: string;
  onClose: () => void;
}

export default function PdfViewer({
  url,
  title,
  resourceTitle,
  onClose,
}: PdfViewerProps) {
  const [PDFDocument, setPDFDocument] =
    useState<ComponentType<DocumentProps> | null>(null);
  const [PDFPage, setPDFPage] = useState<ComponentType<PageProps> | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(960);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<boolean>(false);

  // Client-only dynamic import
  useEffect(() => {
    (async () => {
      const pdfModule = await import("react-pdf");
      const { pdfjs } = pdfModule;
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

      setPDFDocument(() => pdfModule.Document);
      setPDFPage(() => pdfModule.Page);
    })();
  }, []);

  const proxyUrl = useMemo(
    () => (url ? `/api/pdf?url=${encodeURIComponent(url)}` : null),
    [url],
  );

  useEffect(() => {
    setNumPages(0);
    setLoading(true);
    setError(null);
  }, [proxyUrl]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateWidth = () => {
      const screenWidth = window.innerWidth;
      const isMobile = screenWidth < 768;

      // Calculate base width that fits the screen
      const baseWidth = isMobile
        ? screenWidth - 16 // 16px for padding (8px on each side)
        : Math.min(screenWidth * 0.95, 1200);

      setPageWidth(baseWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleLoadSuccess = useCallback((pdf: { numPages: number }) => {
    setNumPages(pdf.numPages);
    setLoading(false);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!proxyUrl || downloading) return;

    try {
      setDownloading(true);
      const response = await fetch(proxyUrl);
      const blob = await response.blob();

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${slugify(title)}-${resourceTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  }, [proxyUrl, title, resourceTitle, downloading]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const pages = useMemo(() => {
    return Array.from({ length: numPages }, (_, i) => (
      <LazyPage
        key={`page_${i + 1}`}
        pageNumber={i + 1}
        PDFPage={PDFPage!}
        width={pageWidth}
      />
    ));
  }, [numPages, PDFPage, pageWidth]);

  if (!PDFDocument || !PDFPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/90">
        <Loader2 className="h-6 w-6 animate-spin text-white/80" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm overscroll-none">
      <style jsx global>{`
        .react-pdf__Page__textContent {
          opacity: 1 !important;
          user-select: text !important;
          -webkit-user-select: text !important;
        }

        .react-pdf__Page__textContent span {
          color: transparent !important;
          opacity: 1 !important;
          position: absolute !important;
          white-space: pre !important;
          cursor: text !important;
          transform-origin: 0% 0% !important;
        }

        .react-pdf__Page__textContent ::selection {
          background: rgba(59, 130, 246, 0.3) !important;
          color: transparent !important;
        }

        .react-pdf__Page__textContent ::-moz-selection {
          background: rgba(59, 130, 246, 0.3) !important;
          color: transparent !important;
        }

        .react-pdf__Page__annotations {
          opacity: 1 !important;
        }

        .react-pdf__Page__canvas {
          display: block !important;
          user-select: none !important;
          max-width: 100% !important;
          height: auto !important;
        }

        .react-pdf__Page {
          position: relative !important;
          display: flex !important;
          justify-content: center !important;
          max-width: 100% !important;
        }
      `}</style>

      <header className="flex items-center justify-between gap-3 border-b border-white/10 bg-black/70 px-4 py-2 text-white">
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-semibold">{title}</p>
          {numPages > 0 && (
            <p className="text-xs text-white/60">{numPages} pages</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading || loading}
            className={cn(
              "flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-sm text-white transition hover:bg-white/10",
              (downloading || loading) && "cursor-not-allowed opacity-40",
            )}
            aria-label="Download PDF"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Download
          </button>

          <button
            type="button"
            onClick={onClose}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md border border-white/20 text-white transition hover:border-white/40 hover:bg-white/10",
            )}
            aria-label="Close PDF viewer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-2">
        {error && (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-sm text-white/80">
            <p>{error}</p>
          </div>
        )}

        {loading && !error && (
          <div className="flex h-full items-center justify-center text-white/80">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {proxyUrl && !error && (
          <PDFDocument
            file={proxyUrl}
            onLoadSuccess={handleLoadSuccess}
            onLoadError={(err: unknown) => {
              console.error(err);
              setError("Failed to load PDF");
              setLoading(false);
            }}
            loading=""
          >
            {pages}
          </PDFDocument>
        )}
      </div>
    </div>
  );
}

const LazyPage = memo(function LazyPage({
  pageNumber,
  PDFPage,
  width,
}: {
  pageNumber: number;
  PDFPage: ComponentType<PageProps>;
  width: number;
}) {
  const { ref, inView } = useInViewOnce({ rootMargin: "400px 0px" });
  const placeholderHeight = Math.max(Math.round(width * 1.3), 400);

  return (
    <div ref={ref} className="flex justify-center mb-4 last:mb-0 w-full">
      {inView ? (
        <PDFPage
          width={width}
          pageNumber={pageNumber}
          renderAnnotationLayer={RENDER_ANNOTATIONS}
          renderTextLayer={RENDER_TEXT}
        />
      ) : (
        <div
          className="w-full max-w-5xl animate-pulse rounded-lg border border-white/10 bg-white/5"
          style={{ height: placeholderHeight }}
        />
      )}
    </div>
  );
});
