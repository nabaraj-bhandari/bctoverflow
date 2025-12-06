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
  enabled_categories: EnabledCategories;
};

export type Resource = {
  id: string;
  title: string;
  url: string;
  semester: number;
  subject: string; // This is subject ID
  category: keyof EnabledCategories;
};
