"use client";
import { useState, useMemo, useEffect, use } from "react";
import { useResourceSections } from "@/hooks/useCatalogData";
import { PDFViewer } from "@embedpdf/react-pdf-viewer";
import { X } from "lucide-react";

interface ViewerPageProps {
  searchParams: Promise<{
    subject?: string;
    resource?: string;
  }>;
}

export default function ViewerPage({ searchParams }: ViewerPageProps) {
  // Unwrap the Promise using React.use()
  const params = use(searchParams);
  const subjectCode = params?.subject;
  const resourceId = params?.resource;

  const sections = useResourceSections(subjectCode || "", resourceId || "");
  const [selectedSection, setSelectedSection] = useState(sections[0] ?? null);

  // Auto-select first section
  useEffect(() => {
    if (sections.length > 0 && !selectedSection)
      setSelectedSection(sections[0]);
  }, [sections, selectedSection]);

  if (!subjectCode || !resourceId)
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Invalid viewer URL
      </div>
    );

  if (!selectedSection)
    return (
      <div className="flex items-center justify-center h-screen text-white">
        No sections available
      </div>
    );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const file = useMemo(
    () => `/api/pdf?url=${encodeURIComponent(selectedSection.url)}`,
    [selectedSection.url],
  );

  return (
    <div className="fixed inset-0 flex flex-col bg-black">
      {/* Header / Mobile Dropdown */}
      <div className="lg:hidden bg-black/70 border-b border-white/20 p-3 flex justify-between items-center">
        <select
          value={selectedSection.id}
          onChange={(e) => {
            const section = sections.find((s) => s.id === e.target.value);
            if (section) setSelectedSection(section);
          }}
          className="flex-1 bg-white/10 border border-white/20 rounded-sm px-3 py-2 text-sm text-white"
        >
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
        <button
          onClick={() => history.back()}
          className="ml-2 p-2 rounded-sm hover:bg-white/10"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:w-80 flex-col bg-black/80 border-r border-white/20">
          <div className="p-4 border-b border-white/20 flex justify-between items-start">
            <h3 className="text-lg font-semibold text-white">Sections</h3>
            <button
              onClick={() => history.back()}
              className="p-1 hover:bg-white/10 rounded-sm"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section)}
                className={`w-full text-left p-3 rounded-sm transition-all duration-200 ${
                  selectedSection.id === section.id
                    ? "bg-white/15 border border-white/25 shadow-lg"
                    : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
                } text-white`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </aside>
        {/* PDF Viewer */}
        <div className="flex-1 relative">
          <PDFViewer
            key={selectedSection.id}
            config={{ src: file }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
}
