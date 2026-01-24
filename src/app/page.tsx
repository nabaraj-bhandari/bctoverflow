import { semesters } from "@/data/subjects";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa";

export default function Home() {
  return (
    <div className="container mx-auto max-w-4xl p-4 space-y-4">
      <header className="text-center mb-4">
        <h1 className="text-xl font-bold text-primary">Choose Your Semester</h1>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {semesters.map((num: number) => (
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
            {`Semester ${num}`}
          </Link>
        ))}
      </div>

      <div>
        <Link
          href={"/course"}
          className="
              group flex items-center justify-center
              h-12 rounded-xl bg-card/60 border border-border
              shadow-md transition-transform
              hover:scale-102
              text-center font-semibold text-primary
            "
        >
          View Course Structure
        </Link>
      </div>
      <Link
        href={"https://discord.gg/ynzewN9w"}
        className="
              group flex items-center justify-center gap-2
              h-12 rounded-xl bg-card/60 border border-border
              shadow-md transition-transform
              hover:scale-102
              text-center font-semibold text-primary
            "
      >
        <FaDiscord className="text-2xl" />
        Join Discord Community
      </Link>
    </div>
  );
}
