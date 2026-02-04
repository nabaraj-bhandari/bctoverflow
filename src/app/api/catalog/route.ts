import { getCatalog, getCatalogChecksum } from "@/lib/helperFunctions";

export async function GET() {
  try {
    const catalog = await getCatalog();
    const checksum = await getCatalogChecksum();

    return Response.json({
      checksum,
      data: catalog,
    });
  } catch (error) {
    console.error("Catalog error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
