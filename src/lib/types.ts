export type EnabledCategories = {
    notes: boolean;
    pyqs: boolean;
    books: boolean;
    lab: boolean;
    exam: boolean;
  };
  
  export type Subject = {
    id: string;
    name: string;
    slug: string;
    semester: number;
    enabledCategories: EnabledCategories;
  };
  
  export type Resource = {
    id: string;
    title: string;
    link: string;
    thumbnail: string | null;
    thumbnailStatus: "processing" | "success" | "failed" | null;
    semester: number;
    subject: string; // This is subject ID
    category: keyof EnabledCategories;
    approved: boolean;
    createdBy: string; // User ID
    createdAt: any; // Firestore Timestamp
  };
  