import { Breadcrumbs } from "@/components/breadcrumbs";
import { LaptopMinimal } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3">
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-center items-center border-b">
          <LaptopMinimal className="mr-2 text-accent" />
          <span className="font-bold text-lg ">BCT Overflow</span>
        </div>
        <div className="flex items-center justify-start mt-1">
          <Breadcrumbs />
        </div>
      </div>
    </nav>
  );
}
