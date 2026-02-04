export interface Section {
  id: string;
  title: string;
  url: string;
}

export interface Resource {
  id: string;
  subjectCode: string;
  title: string;
  sections: Section[];
}

export interface Subject {
  code: string;
  resources: Resource[];
}

export interface CatalogResponse {
  checksum: string;
  data: Subject[];
}
