import ViewerClient from "./viewer.client";

export default async function ViewerPage({
  searchParams,
}: {
  searchParams: Promise<{
    pdf?: string;
    title?: string;
    resourceTitle?: string;
  }>;
}) {
  const params = await searchParams;
  const pdfUrl = params.pdf;
  const title = params.title || "PDF Viewer";
  const resourceTitle = params.resourceTitle || "Notes";

  if (!pdfUrl) {
    return (
      <div className="container mx-auto max-w-6xl p-4">
        <div className="flex min-h-100 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              No PDF URL Provided
            </h1>
            <p className="text-gray-600">
              Please provide a PDF URL in the query parameters.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ViewerClient
      url={decodeURIComponent(pdfUrl)}
      title={title}
      resourceTitle={resourceTitle}
    />
  );
}
