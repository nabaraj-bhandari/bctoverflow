import { useEffect, useMemo, useState } from "react";

const cacheApiName = "pdf-byte-cache-v1";

export function usePdfFile(proxyUrl: string | null, cacheKey: string) {
  const [fileData, setFileData] = useState<ArrayBuffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fileCache = useMemo(() => {
    if (typeof window === "undefined") return null;
    const globalWithCache = window as typeof window & {
      __pdfFileCache?: Map<string, ArrayBuffer>;
    };
    if (!globalWithCache.__pdfFileCache) {
      globalWithCache.__pdfFileCache = new Map();
    }
    return globalWithCache.__pdfFileCache;
  }, []);

  const cacheApiAvailable = useMemo(
    () => typeof window !== "undefined" && "caches" in window,
    []
  );

  useEffect(() => {
    setFileData(null);
    setLoading(true);
    setError(null);
  }, [proxyUrl]);

  useEffect(() => {
    if (!proxyUrl || !fileCache) {
      setLoading(false);
      return;
    }
    if (fileData) return;

    const cached = fileCache.get(cacheKey);
    if (cached) {
      if (fileData !== cached) {
        setFileData(cached);
      }
      if (loading) setLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadFile = async () => {
      try {
        setLoading(true);
        let buffer: ArrayBuffer | null = null;

        if (cacheApiAvailable) {
          const cache = await caches.open(cacheApiName);
          const match = await cache.match(proxyUrl);
          if (match) {
            buffer = await match.arrayBuffer();
          }
        }

        if (!buffer) {
          const res = await fetch(proxyUrl, { signal: controller.signal });
          if (!res.ok) {
            throw new Error(`Failed to fetch PDF (${res.status})`);
          }
          buffer = await res.arrayBuffer();

          if (cacheApiAvailable && buffer) {
            const cache = await caches.open(cacheApiName);
            const response = new Response(buffer.slice(0), {
              headers: { "Content-Type": "application/pdf" },
            });
            cache.put(proxyUrl, response);
          }
        }

        if (!buffer) throw new Error("No PDF data available");

        const cloned = buffer.slice(0);
        fileCache.set(cacheKey, cloned);
        setFileData(cloned);
      } catch (err: any) {
        if (controller.signal.aborted) return;
        console.error("pdf fetch error", err);
        setError("Failed to load PDF");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadFile();
    return () => controller.abort();
  }, [cacheKey, fileCache, proxyUrl, fileData, cacheApiAvailable]);

  const memoizedFile = useMemo(() => {
    if (!fileData) return null;
    return { data: new Uint8Array(fileData.slice(0)) };
  }, [fileData]);

  return { memoizedFile, loading, error, setError, setLoading };
}
