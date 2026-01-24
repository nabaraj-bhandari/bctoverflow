export type Subject = {
  code: string;
  title: string;
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
