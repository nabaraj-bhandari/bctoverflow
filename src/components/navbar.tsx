
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3">
      <Link href="/" className="flex justify-center items-center select-none gap-2">
        <Image src={'/logo2.png'} alt="BCT Overflow" width={32} height={32} className="rounded-md" />
        <span className="font-bold text-lg">BCT Overflow</span>
      </Link>
    </nav>
  );
}
