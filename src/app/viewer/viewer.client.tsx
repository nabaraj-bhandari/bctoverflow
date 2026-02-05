"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  PDFViewer,
  PDFViewerRef,
  CommandsPlugin,
  UIPlugin,
  ToolbarItem,
  GroupItem,
} from "@embedpdf/react-pdf-viewer";
import { Loader2 } from "lucide-react";

interface ViewerClientProps {
  url: string;
  title: string;
  resourceTitle: string;
}

function isGroupItem(item: ToolbarItem): item is GroupItem {
  return item.type === "group";
}

export default function ViewerClient({
  url,
  title,
  resourceTitle,
}: ViewerClientProps) {
  const viewerRef = useRef<PDFViewerRef>(null);
  const [downloading, setDownloading] = useState(false);

  const file = useMemo(() => `/api/pdf?url=${encodeURIComponent(url)}`, [url]);

  const download = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);

    const res = await fetch(file);
    const blob = await res.blob();

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${title}-${resourceTitle}.pdf`;
    a.click();

    URL.revokeObjectURL(a.href);
    setDownloading(false);
  }, [file, title, resourceTitle, downloading]);

  const handleReady = useCallback(async () => {
    const container = viewerRef.current?.container;
    if (!container) return;

    const registry = await container.registry;
    const commands = registry.getPlugin<CommandsPlugin>("commands")?.provides();
    const ui = registry.getPlugin<UIPlugin>("ui")?.provides();

    if (!commands || !ui) return;

    commands.registerCommand({
      id: "viewer.title",
      label: title,
      action: () => {},
    });

    commands.registerCommand({
      id: "viewer.download",
      label: "Download",
      icon: "download",
      action: download,
    });

    const schema = ui.getSchema();
    const toolbar = schema.toolbars["main-toolbar"];
    if (!toolbar) return;

    const items: ToolbarItem[] = structuredClone(toolbar.items);

    items.unshift({
      type: "command-button",
      id: "viewer-title",
      commandId: "viewer.title",
      variant: "text",
    });

    const rightGroup = items.find(
      (item): item is GroupItem =>
        isGroupItem(item) && item.id === "right-group",
    );

    if (rightGroup) {
      rightGroup.items.push({
        type: "command-button",
        id: "download-btn",
        commandId: "viewer.download",
        variant: "icon",
      });
    }

    ui.mergeSchema({
      toolbars: {
        "main-toolbar": {
          ...toolbar,
          items,
        },
      },
    });
  }, [download, title]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm overscroll-none">
      <PDFViewer
        ref={viewerRef}
        config={{
          src: url,
          disabledCategories: [
            "document-print",
            "document",
            "tools",
            "redaction",
            "document-export",
            "zoom",
            "panel",
          ],
        }}
        onReady={handleReady}
        style={{ width: "100%", height: "100%" }}
      />

      {downloading && (
        <div className="pointer-events-none fixed bottom-4 right-4 flex items-center gap-2 rounded-md bg-black/80 px-3 py-2 text-sm text-white">
          <Loader2 className="h-4 w-4 animate-spin" />
          Downloading…
        </div>
      )}
    </div>
  );
}
