import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { CDN_BASE } from "./data";
import type { Subject } from "./types";

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function getCatalog(): Promise<Subject[]> {
  const catalog = await prisma.subject.findMany({
    include: {
      resources: {
        include: {
          sections: {
            select: {
              id: true,
              title: true,
            },
            orderBy: { id: "asc" },
          },
        },
        orderBy: { id: "asc" },
      },
    },
  });

  return catalog.map((c) => ({
    code: c.code,
    resources: c.resources.map((r) => ({
      id: r.id,
      subjectCode: r.subjectCode,
      title: r.title,
      sections: r.sections.map((s) => ({
        id: s.id,
        title: s.title,
        url: `${CDN_BASE}/resources/${r.subjectCode}/${r.id}/sections/${slugify(s.title)}.pdf`,
      })),
    })),
  }));
}

export async function getCatalogChecksum(): Promise<string> {
  const metadata = await prisma.metaData.findUnique({
    where: { id: 1 },
  });
  return metadata?.checksum || "";
}

export function catalogChecksum(catalog: unknown): string {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(catalog))
    .digest("hex");
}
