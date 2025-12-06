"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const shouldRedirect = pathname.startsWith("/admin") && pathname !== "/admin";

  useEffect(() => {
    if (shouldRedirect) {
      router.replace("/admin");
    }
  }, [router, shouldRedirect]);

  if (shouldRedirect) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
