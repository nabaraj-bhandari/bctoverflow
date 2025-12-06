"use client";

import PdfViewer from "@/components/pdf-viewer";
import { Resource } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useRef as reactUseRef } from "react";

interface PdfRouteClientProps {
  resource: Resource;
}

export default function PdfRouteClient({ resource }: PdfRouteClientProps) {
  const router = useRouter();
  const hasNavigatedBack = reactUseRef(false);

  return (
    <PdfViewer
      resource={resource}
      onClose={() => {
        if (hasNavigatedBack.current) return; // prevent multiple back
        hasNavigatedBack.current = true;
        router.back();
      }}
    />
  );
}
function useRef(arg0: boolean) {
  throw new Error("Function not implemented.");
}
