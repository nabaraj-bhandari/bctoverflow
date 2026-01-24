export type Subject = {
  id: string;
  name: string;
  slug: string;
  semester: number;
};

export type Resource = {
  id: string;
  title: string;
  url: string;
  subjectCode: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Categories =
  | "Notes"
  | "Books"
  | "PYQs"
  | "Syllabus"
  | "Assessments"
  | "Lab Reports";
