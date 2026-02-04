import { getCatalogChecksum } from "@/lib/helperFunctions";

export async function GET() {
  try {
    const checksum = await getCatalogChecksum();

    return Response.json({ checksum });
  } catch (error) {
    console.error("Checksum error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
