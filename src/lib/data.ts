export const GITHUB_OWNER = "nabaraj-bhandari";
export const GITHUB_REPO = "academic-resources";
export const GITHUB_BRANCH = "main";
export const CDN_BASE = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;

export type Subject = {
  code: string;
  title: string;
};

export type SemNo = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Semester = {
  year: number;
  semester: "Odd" | "Even";
  semNo: SemNo;
  subjects: Subject[];
  totalMarks?: number; // optional
};

export const semesters: Semester[] = [
  // Year 1
  {
    year: 1,
    semester: "Odd",
    semNo: 1,
    totalMarks: 675,
    subjects: [
      { code: "ENSH_101", title: "Engineering Mathematics I" },
      { code: "ENCT_101", title: "Computer Programming" },
      { code: "ENME_101", title: "Engineering Drawing" },
      {
        code: "ENEX_101",
        title: "Fundamental of Electrical and Electronics Engineering",
      },
      { code: "ENSH_102", title: "Engineering Physics" },
      { code: "ENME_106", title: "Engineering Workshop" },
    ],
  },
  {
    year: 1,
    semester: "Even",
    semNo: 2,
    totalMarks: 800,
    subjects: [
      { code: "ENSH_151", title: "Engineering Mathematics II" },
      { code: "ENCT_151", title: "Object Oriented Programming" },
      { code: "ENEX_152", title: "Digital Logic" },
      { code: "ENEX_151", title: "Electronic Device and Circuits" },
      { code: "ENSH_153", title: "Engineering Chemistry" },
      { code: "ENEE_154", title: "Electrical Circuits and Machines" },
    ],
  },
  // Year 2
  {
    year: 2,
    semester: "Odd",
    semNo: 3,
    totalMarks: 775,
    subjects: [
      { code: "ENSH_201", title: "Engineering Mathematics III" },
      { code: "ENSH_204", title: "Communication English" },
      { code: "ENCT_201", title: "Computer Graphics and Visualization" },
      { code: "ENCT_202", title: "Foundation of Data Science" },
      { code: "ENCT_203", title: "Theory of Computation" },
      { code: "ENEX_201", title: "Microprocessors" },
    ],
  },
  {
    year: 2,
    semester: "Even",
    semNo: 4,
    totalMarks: 800,
    subjects: [
      { code: "ENSH_252", title: "Numerical Methods" },
      { code: "ENEX_252", title: "Instrumentation" },
      { code: "ENEX_254", title: "Electromagnetics" },
      { code: "ENCT_252", title: "Data Structure and Algorithm" },
      { code: "ENCT_253", title: "Data Communication" },
      { code: "ENCT_254", title: "Operating System" },
    ],
  },
  // Year 3
  {
    year: 3,
    semester: "Odd",
    semNo: 5,
    totalMarks: 800,
    subjects: [
      { code: "ENSH_304", title: "Probability and Statistics" },
      { code: "ENCT_301", title: "Database Management System" },
      { code: "ENCT_302", title: "Web Application Programming" },
      { code: "ENCT_303", title: "Computer Organization and Architecture" },
      { code: "ENCT_304", title: "Computer Networks" },
      { code: "ENCT_325-344", title: "Elective I" },
    ],
  },
  {
    year: 3,
    semester: "Even",
    semNo: 6,
    totalMarks: 675,
    subjects: [
      { code: "ENCE_356", title: "Engineering Economics" },
      { code: "ENCT_351", title: "Artificial Intelligence" },
      { code: "ENCT_352", title: "Software Engineering" },
      { code: "ENCT_353", title: "Simulation and Modeling" },
      { code: "ENCT_354", title: "Minor Project" },
      { code: "ENCT_385-399", title: "Elective II" },
    ],
  },
  // Year 4
  {
    year: 4,
    semester: "Odd",
    semNo: 7,
    totalMarks: 625,
    subjects: [
      { code: "ENEX_416", title: "Digital Signal Analysis and Processing" },
      { code: "ENCT_411", title: "Distributed and Cloud Computing" },
      { code: "ENCT_412", title: "ICT Project Management" },
      { code: "ENEX_417", title: "Energy, Environment and Social Engineering" },
      { code: "ENCT_435-444", title: "Elective III" },
      { code: "ENCT_413", title: "Project I" },
    ],
  },
  {
    year: 4,
    semester: "Even",
    semNo: 8,
    totalMarks: 550,
    subjects: [
      { code: "ENCT_463", title: "Network and Cyber Security" },
      { code: "ENCT_465-474", title: "Elective IV" },
      { code: "ENCT_462", title: "Internship" },
      { code: "ENCT_461", title: "Project II" },
    ],
  },
];
