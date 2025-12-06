import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getGoogleDriveEmbedUrl(driveLink: string): string | null {
    try {
      const url = new URL(driveLink);
      let fileId: string | null = null;
      
      // Standard sharing link format
      const match = url.pathname.match(/\/file\/d\/([^/]+)/);
      if (match && match[1]) {
        fileId = match[1];
      } else {
        // Link with 'id' query parameter (e.g., from file preview)
        fileId = url.searchParams.get('id');
      }
      
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
      
      return null;
    } catch (error) {
      console.error("Invalid Google Drive URL:", error);
      return null;
    }
  }