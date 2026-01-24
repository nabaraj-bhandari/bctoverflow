import Link from "next/link";
import { type Semester } from "./data";

type Props = {
  semester: Semester;
};

export default function SubjectTable({ semester }: Props) {
  return (
    <section className="space-y-4">
      <h1 className="text-lg md:text-xl font-bold text-primary">
        Year {semester.year}: Semester {semester.semester}
      </h1>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full border-collapse text-xs md:text-base">
          <thead className="bg-muted">
            <tr>
              <th
                rowSpan={2}
                className="px-2 py-2 border text-left font-semibold"
              >
                Code
              </th>
              <th
                rowSpan={2}
                className="px-2 py-2 border text-left font-semibold"
              >
                Title
              </th>
              <th
                rowSpan={2}
                className="px-2 py-2 border text-center font-semibold"
              >
                Type
              </th>
              <th
                colSpan={2}
                className="px-2 py-2 border text-center font-semibold"
              >
                Theory
              </th>
              <th
                colSpan={2}
                className="px-2 py-2 border text-center font-semibold"
              >
                Practical
              </th>
              <th
                rowSpan={2}
                className="px-2 py-2 border text-center font-semibold"
              >
                Total
              </th>
            </tr>
            <tr>
              <th className="px-2 py-1 border text-center text-[10px] font-medium">
                A
              </th>
              <th className="px-2 py-1 border text-center text-[10px] font-medium">
                F
              </th>
              <th className="px-2 py-1 border text-center text-[10px] font-medium">
                A
              </th>
              <th className="px-2 py-1 border text-center text-[10px] font-medium">
                F
              </th>
            </tr>
          </thead>
          <tbody>
            {semester.subjects.map((s) => (
              <tr key={s.code} className="hover:bg-muted/50">
                <td className="px-2 py-2 border ">{s.code}</td>
                <td className="px-2 py-2 border">
                  <Link
                    href={`${semester.semNo}/${s.code}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {s.title}
                  </Link>
                </td>
                <td className="px-2 py-2 border text-center">{s.examType}</td>
                <td className="px-2 py-2 border text-center">
                  {s.theoryAss ?? "-"}
                </td>
                <td className="px-2 py-2 border text-center">
                  {s.theoryFinal ?? "-"}
                </td>
                <td className="px-2 py-2 border text-center">
                  {s.practicalAss ?? "-"}
                </td>
                <td className="px-2 py-2 border text-center">
                  {s.practicalFinal ?? "-"}
                </td>
                <td className="px-2 py-2 border text-center font-medium">
                  {s.total}
                </td>
              </tr>
            ))}
            <tr className="bg-muted font-semibold">
              <td colSpan={7} className="px-2 py-2 border text-right">
                Total Marks
              </td>
              <td className="px-2 py-2 border text-center">
                {semester.totalMarks}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
