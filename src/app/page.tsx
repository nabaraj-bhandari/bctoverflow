import Link from "next/link";

export default function Home() {
  const semesters = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <header className="text-center mb-4">
        <h1 className="text-xl font-bold text-primary">Choose Your Semester</h1>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {semesters.map((num) => (
          <Link
            key={num}
            href={`/${num}`}
            className="
              group flex items-center justify-center
              h-28 rounded-xl
              bg-card/60 backdrop-blur-md border border-border
              shadow-md transition-transform
              hover:scale-105 hover:shadow-lg
              text-center font-semibold text-primary
            "
          >
            Semester {num}
          </Link>
        ))}
      </div>
    </div>
  );
}
