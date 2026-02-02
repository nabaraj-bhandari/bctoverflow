import { useEffect, useRef, useState } from "react";

interface UseInViewOnceOptions {
  rootMargin?: string;
  threshold?: number | number[];
}

export function useInViewOnce(options: UseInViewOnceOptions = {}) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: options.rootMargin || "0px",
        threshold: options.threshold || 0,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [inView, options.rootMargin, options.threshold]);

  return { ref, inView };
}
