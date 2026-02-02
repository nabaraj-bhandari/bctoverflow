// data/subjects.ts

export type Subject = {
  code: string;
  title: string;
};

export const semesters: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

export const subjectsBySem: Record<number, readonly Subject[]> = {
  1: [
    {
      code: "ENSH101",
      title: "Engineering Mathematics I",
    },
    {
      code: "ENCT101",
      title: "Computer Programming",
    },
    {
      code: "ENME101",
      title: "Engineering Drawing",
    },
    {
      code: "ENEX101",
      title: "Fundamental of Electrical and Electronics Engineering",
    },
    {
      code: "ENSH102",
      title: "Engineering Physics",
    },
    {
      code: "ENME106",
      title: "Engineering Workshop",
    },
  ],
  2: [
    {
      code: "ENSH151",
      title: "Engineering Mathematics II",
    },
    {
      code: "ENCT151",
      title: "Object Oriented Programming",
    },
    {
      code: "ENEX152",
      title: "Digital Logic",
    },
    {
      code: "ENEX151",
      title: "Electronic Device and Circuits",
    },
    {
      code: "ENSH153",
      title: "Engineering Chemistry",
    },
    {
      code: "ENEE154",
      title: "Electrical Circuits and Machines",
    },
  ],
  3: [
    {
      code: "ENSH201",
      title: "Engineering Mathematics III",
    },
    {
      code: "ENSH204",
      title: "Communication English",
    },
    {
      code: "ENCT201",
      title: "Computer Graphics and Visualization",
    },
    {
      code: "ENCT202",
      title: "Foundation of Data Science",
    },
    {
      code: "ENCT203",
      title: "Theory of Computation",
    },
    {
      code: "ENEX201",
      title: "Microprocessors",
    },
  ],
  4: [
    {
      code: "ENSH252",
      title: "Numerical Methods",
    },
    {
      code: "ENEX252",
      title: "Instrumentation",
    },
    {
      code: "ENEX254",
      title: "Electromagnetics",
    },
    {
      code: "ENCT252",
      title: "Data Structure and Algorithm",
    },
    {
      code: "ENCT253",
      title: "Data Communication",
    },
    {
      code: "ENCT254",
      title: "Operating System",
    },
  ],
  5: [
    {
      code: "ENSH304",
      title: "Probability and Statistics",
    },
    {
      code: "ENCT301",
      title: "Database Management System",
    },
    {
      code: "ENCT302",
      title: "Web Application Programming",
    },
    {
      code: "ENCT303",
      title: "Computer Organization and Architecture",
    },
    {
      code: "ENCT304",
      title: "Computer Networks",
    },
    {
      code: "ENCT325-344",
      title: "Elective I",
    },
  ],
  6: [
    {
      code: "ENCE356",
      title: "Engineering Economics",
    },
    {
      code: "ENCT351",
      title: "Artificial Intelligence",
    },
    {
      code: "ENCT352",
      title: "Software Engineering",
    },
    {
      code: "ENCT353",
      title: "Simulation and Modeling",
    },
    {
      code: "ENCT354",
      title: "Minor Project",
    },
    {
      code: "ENCT385-399",
      title: "Elective II",
    },
  ],
  7: [
    {
      code: "ENEX416",
      title: "Digital Signal Analysis and Processing",
    },
    {
      code: "ENCT411",
      title: "Distributed and Cloud Computing",
    },
    {
      code: "ENCT412",
      title: "ICT Project Management",
    },
    {
      code: "ENEX417",
      title: "Energy, Environment and Social Engineering",
    },
    {
      code: "ENCT435-444",
      title: "Elective III",
    },
    {
      code: "ENCT413",
      title: "Project I",
    },
  ],
  8: [
    {
      code: "ENCT463",
      title: "Network and Cyber Security",
    },
    {
      code: "ENCT465-474",
      title: "Elective IV",
    },
    {
      code: "ENCT462",
      title: "Internship",
    },
    {
      code: "ENCT461",
      title: "Project II",
    },
  ],
};
