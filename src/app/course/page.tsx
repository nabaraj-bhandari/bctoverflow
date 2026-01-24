import SubjectTable from "./SubjectTable";
import { semesters } from "./data";

export default function SubjectsPage() {
  return (
    <>
      <main className="container mx-auto space-y-4 py-4 px-2">
        {semesters.map((semester, idx) => (
          <SubjectTable key={idx} semester={semester} />
        ))}
        <div className="text-sm py-4 px-2">
          <p>**8-weeks internship</p>
          <p>
            ** Project is conducted in year IV (A) and year IV (B) (3+6 = 9)
          </p>
          <p>*Industrial Attachment for 6 weeks.</p>
        </div>
      </main>
    </>
  );
}
