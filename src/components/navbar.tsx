import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3">
      <Link
        href="/"
        className="flex justify-center items-center select-none gap-2"
      >
        <Image
          src={"/logo.png"}
          alt="BCT Overflow"
          width={32}
          height={32}
          className="rounded-md"
        />
        <p className="font-bold text-lg">
          <span className="text-primary">BCT </span>Overflow
        </p>
      </Link>
    </nav>
  );
}
