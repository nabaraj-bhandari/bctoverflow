import { semesters } from "@/data/subjects";
import { Construction } from "lucide-react";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa";

const isDevelopment = false;

export default function Home() {
  return (
    <div className="container mx-auto max-w-4xl p-4 space-y-4">
      {isDevelopment ? (
        <div className="flex flex-col items-center">
          <Construction className="text-primary w-16 h-16" />
          <h1 className="text-xl font-bold text-white text-center">
            Currently Under Development
          </h1>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {semesters.map((num: number) => (
              <Link
                key={num}
                href={`/sem/${num}`}
                className="
              group flex items-center justify-center
              h-24 rounded-xl
              bg-card/60 backdrop-blur-md border border-border
              shadow-md transition-transform
              hover:scale-102 hover:shadow-lg
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
              hover:scale-101
              text-center font-semibold text-primary
            "
            >
              View Course Structure
            </Link>
          </div>
          <Link
            href={"https://discord.gg/xadXspQgks"}
            className="
              group flex items-center justify-center gap-2
              h-12 rounded-xl bg-card/60 border border-border
              shadow-md transition-transform
              hover:scale-101
              text-center font-semibold text-primary
            "
          >
            <FaDiscord className="text-2xl" />
            Join Discord Community
          </Link>
        </div>
      )}
    </div>
  );
}
