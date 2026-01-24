import { LaptopMinimal } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3">
      <Link href="/" className="flex justify-center items-center select-none">
        <LaptopMinimal className="mr-2 text-accent" />
        <span className="font-bold text-lg ">BCT Overflow</span>
      </Link>
    </nav>
  );
}
