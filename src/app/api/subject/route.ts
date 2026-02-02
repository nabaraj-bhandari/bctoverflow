import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return new Response(JSON.stringify({ error: "Code is required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  try {
    const resources = await prisma.resource.findMany({
      where: { subjectCode: code },
    });

    if (!resources) {
      return new Response(JSON.stringify({ error: "Resources not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const result = resources.map((resource) => ({
      id: resource.id,
      title: resource.title,
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
