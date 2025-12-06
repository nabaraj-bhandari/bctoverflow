import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGoogleDriveEmbedUrl(driveLink: string): string | null {
  try {
    const fileId = driveLink;

    if (driveLink) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }

    return null;
  } catch (error) {
    console.error("Invalid Google Drive URL:", error);
    return null;
  }
}
