"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    try {
      const isAdmin = sessionStorage.getItem("bct-overflow-admin") === "true";
      if (!isAdmin && pathname !== "/admin") {
        router.replace("/admin");
      } else {
        setIsVerified(true);
      }
    } catch (e) {
      // Handle server-side rendering or environments where sessionStorage is not available
      if (pathname !== "/admin") {
        // On server, we can't check sessionStorage, so we let it render. The client-side will then redirect.
        // Or, if not the login page, we can assume redirect is needed.
        // A loading state is better than a flash of content.
      }
      setIsVerified(pathname === "/admin");
    }
  }, [pathname, router]);

  if (!isVerified && pathname !== "/admin") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
