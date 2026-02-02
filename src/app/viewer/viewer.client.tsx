"use client";

import { useRouter } from "next/navigation";
import PdfViewer from "@/components/pdf-viewer";

interface ViewerClientProps {
  url: string;
  title: string;
}

export default function ViewerClient({ url, title }: ViewerClientProps) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return <PdfViewer url={url} title={title} onClose={handleClose} />;
}
