import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractGoogleDriveId(
  input: string | null | undefined
): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  try {
    const url = new URL(trimmed);
    const match = url.pathname.match(/\/file\/d\/([^/]+)/);
    if (match?.[1]) return match[1];
    const idParam = url.searchParams.get("id");
    if (idParam) return idParam;
  } catch {
    if (trimmed) return trimmed;
  }
  return trimmed || null;
}

export function getGoogleDriveDirectUrl(input: string): string | null {
  const id = extractGoogleDriveId(input);
  return id ? `https://drive.google.com/uc?export=view&id=${id}` : null;
}

export function getGoogleDriveEmbedUrl(input: string): string | null {
  const id = extractGoogleDriveId(input);
  return id ? `https://drive.google.com/file/d/${id}/preview` : null;
}

export function getGoogleDriveDownloadUrl(input: string): string | null {
  const id = extractGoogleDriveId(input);
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : null;
}
