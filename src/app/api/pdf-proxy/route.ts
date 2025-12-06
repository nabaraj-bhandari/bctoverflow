import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const file = req.nextUrl.searchParams.get("file");
  if (!file) {
    return NextResponse.json(
      { error: "Missing file parameter" },
      { status: 400 }
    );
  }

  // Restrict to Google Drive URLs only
  try {
    const url = new URL(file);
    if (
      ![
        "drive.google.com",
        "docs.google.com",
        "lh3.googleusercontent.com",
      ].includes(url.hostname)
    ) {
      return NextResponse.json(
        { error: "Only Google Drive URLs are allowed" },
        { status: 403 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const upstream = await fetch(file, {
      headers: { Accept: "application/pdf" },
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream error ${upstream.status}` },
        { status: upstream.status }
      );
    }

    const headers = new Headers(upstream.headers);
    headers.set("Content-Type", "application/pdf");
    headers.set(
      "Cache-Control",
      "public, max-age=0, s-maxage=0, must-revalidate"
    );

    return new NextResponse(upstream.body, { status: 200, headers });
  } catch (err) {
    console.error("pdf-proxy error", err);
    return NextResponse.json({ error: "Failed to fetch PDF" }, { status: 500 });
  }
}
