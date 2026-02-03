"use client";

import { useRouter } from "next/navigation";
import PdfViewer from "@/components/pdf-viewer";

interface ViewerClientProps {
  url: string;
  title: string;
  resourceTitle: string;
}

export default function ViewerClient({
  url,
  title,
  resourceTitle,
}: ViewerClientProps) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <PdfViewer
      url={url}
      title={title}
      resourceTitle={resourceTitle}
      onClose={handleClose}
    />
  );
}
