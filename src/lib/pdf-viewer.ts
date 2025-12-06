import { useEffect, useMemo, useRef, useState } from "react";
import { getGoogleDriveDownloadUrl } from "@/lib/utils";
import type { Resource } from "@/lib/types";
import type {
  PDFDocumentProxy,
  RenderParameters,
  RenderTask,
} from "pdfjs-dist/types/src/display/api";

const SWIPE_THRESHOLD_PX = 40;

export const pdfBytesCache = new Map<string, Uint8Array>();
export const pdfFetchPromises = new Map<string, Promise<Uint8Array>>();

export const useDisableRefresh = () => {
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

    const preventScroll = (e: TouchEvent) => e.preventDefault();
    document.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      body.style.overscrollBehavior = originalBodyOverscroll;
      html.style.overscrollBehavior = originalHtmlOverscroll;
      body.style.overflow = originalBodyOverflow;
      html.style.overflow = originalHtmlOverflow;
      document.removeEventListener("touchmove", preventScroll);
    };
  }, []);
};

export function usePdfViewer(resource: Resource) {
  useDisableRefresh();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const pointerRef = useRef<{
    id: number | null;
    startX: number;
    startY: number;
  }>({ id: null, startX: 0, startY: 0 });
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{
    initialDistance: number;
    initialScale: number;
  } | null>(null);
  const panRef = useRef({ active: false, lastX: 0, lastY: 0 });
  const jumpInputRef = useRef<HTMLInputElement>(null);
  const renderRafRef = useRef<number | null>(null);

  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jumpInput, setJumpInput] = useState("1");
  const [userScale, setUserScale] = useState(1);

  const pdfjsRef = useRef<null | typeof import("pdfjs-dist")>(null);
  const workerUrlRef = useRef<string | null>(null);

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

  // Restore last viewed page
  useEffect(() => {
    const saved = localStorage.getItem(`pdf-page-${cacheKey}`);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!Number.isNaN(parsed) && parsed > 0) setPageNumber(parsed);
    }
  }, [cacheKey]);

  useEffect(() => {
    localStorage.setItem(`pdf-page-${cacheKey}`, String(pageNumber));
  }, [cacheKey, pageNumber]);

  useEffect(() => setJumpInput(String(pageNumber)), [pageNumber]);

  // Load PDF
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!proxyUrl) {
        setError("Invalid document URL");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (!pdfjsRef.current) {
          const pdfjs = await import("pdfjs-dist");
          workerUrlRef.current = "/pdf.worker.min.mjs";
          pdfjs.GlobalWorkerOptions.workerSrc = workerUrlRef.current;
          pdfjsRef.current = pdfjs;
        }

        let bytes = pdfBytesCache.get(cacheKey) || null;

        if (!bytes) {
          let inflight = pdfFetchPromises.get(cacheKey) || null;
          if (!inflight) {
            inflight = fetch(proxyUrl, { cache: "force-cache" })
              .then((resp) => resp.arrayBuffer())
              .then((buf) => new Uint8Array(buf));
            pdfFetchPromises.set(cacheKey, inflight);
          }

          bytes = await inflight;
          pdfFetchPromises.delete(cacheKey);
          pdfBytesCache.set(cacheKey, bytes);
        }

        const task = pdfjsRef.current.getDocument({ data: bytes.slice(0) });
        const doc = await task.promise;
        if (cancelled) return;

        pdfDocRef.current = doc;
        setNumPages(doc.numPages);
        setPageNumber((prev) => Math.min(Math.max(prev, 1), doc.numPages));
      } catch (err: any) {
        if (!cancelled) setError(err?.message || "Unable to load PDF");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
      if (renderRafRef.current) cancelAnimationFrame(renderRafRef.current);
    };
  }, [proxyUrl, cacheKey]);

  // Render page
  useEffect(() => {
    const doc = pdfDocRef.current;
    if (!doc || pageNumber < 1 || (numPages && pageNumber > numPages)) return;
    renderPage(pageNumber, doc);
  }, [pageNumber, numPages]);

  const renderPage = async (pageNum: number, doc: PDFDocumentProxy) => {
    if (!canvasRef.current || !pdfjsRef.current) return;

    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch {}
      renderTaskRef.current = null;
    }

    setRendering(true);
    try {
      const page = await doc.getPage(pageNum);
      const containerWidth = canvasWrapperRef.current?.clientWidth || 800;
      const baseViewport = page.getViewport({ scale: 1 });
      const baseScale = Math.min(1.25, containerWidth / baseViewport.width);
      const scale = baseScale * userScale;
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas context unavailable");

      const outputScale = window.devicePixelRatio || 1;
      canvas.width = viewport.width * outputScale;
      canvas.height = viewport.height * outputScale;
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      context.setTransform(outputScale, 0, 0, outputScale, 0, 0);

      const renderContext: RenderParameters & { canvas?: HTMLCanvasElement } = {
        canvasContext: context,
        viewport,
        canvas,
      };

      const task = page.render(renderContext as RenderParameters);
      renderTaskRef.current = task;
      await task.promise;
    } catch (err: any) {
      if (err?.name !== "RenderingCancelledException")
        setError("Failed to render page");
    } finally {
      renderTaskRef.current = null;
      setRendering(false);
    }
  };

  const requestRender = () => {
    const doc = pdfDocRef.current;
    if (!doc) return;
    if (renderRafRef.current) cancelAnimationFrame(renderRafRef.current);
    renderRafRef.current = requestAnimationFrame(() => {
      renderRafRef.current = null;
      renderPage(pageNumber, doc);
    });
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(jumpInput, 10);
    if (Number.isNaN(parsed)) return;
    setPageNumber(Math.min(Math.max(parsed, 1), numPages));
    jumpInputRef.current?.blur();
  };

  const nextPage = () => setPageNumber((p) => Math.min(p + 1, numPages));
  const prevPage = () => setPageNumber((p) => Math.max(p - 1, 1));

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "touch" && e.pointerType !== "pen") return;

    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (userScale > 1 && pointersRef.current.size === 1) {
      panRef.current = { active: true, lastX: e.clientX, lastY: e.clientY };
      pointerRef.current = { id: null, startX: 0, startY: 0 };
      return;
    }

    if (pointersRef.current.size === 2) {
      const pts = [...pointersRef.current.values()];
      const distance = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchRef.current = { initialDistance: distance, initialScale: userScale };
      pointerRef.current = { id: null, startX: 0, startY: 0 };
      return;
    }

    pointerRef.current = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
    };
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(e.pointerId);

    if (panRef.current.active)
      panRef.current = { active: false, lastX: 0, lastY: 0 };
    if (pointersRef.current.size < 2) pinchRef.current = null;

    if (
      pinchRef.current ||
      userScale > 1 ||
      pointerRef.current.id !== e.pointerId
    )
      return;

    const dx = e.clientX - pointerRef.current.startX;
    const dy = e.clientY - pointerRef.current.startY;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD_PX)
      dx < 0 ? nextPage() : prevPage();

    pointerRef.current = { id: null, startX: 0, startY: 0 };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (panRef.current.active && canvasWrapperRef.current) {
      const dx = e.clientX - panRef.current.lastX;
      const dy = e.clientY - panRef.current.lastY;
      canvasWrapperRef.current.scrollLeft -= dx;
      canvasWrapperRef.current.scrollTop -= dy;
      panRef.current.lastX = e.clientX;
      panRef.current.lastY = e.clientY;
      return;
    }

    if (pinchRef.current && pointersRef.current.size >= 2) {
      const pts = [...pointersRef.current.values()];
      const distance = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const ratio = distance / pinchRef.current.initialDistance;
      const next = Math.min(
        3,
        Math.max(1, pinchRef.current.initialScale * ratio)
      );
      setUserScale(next);
      requestRender();
    }
  };

  return {
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
  };
}
