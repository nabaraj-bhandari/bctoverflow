import { CDN_BASE } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ error: "Resource id is required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  try {
    const sections = await prisma.section.findMany({
      where: { resourceId: id },
    });

    if (!sections) {
      return new Response(JSON.stringify({ error: "No section not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const result = sections.map((section) => ({
      id: section.id,
      title: section.title,
      url: `${CDN_BASE}/resources/${section.subjectCode}/${section.resourceId}/sections/${slugify(section.title)}.pdf`,
    }));

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal Server ErrorS" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
