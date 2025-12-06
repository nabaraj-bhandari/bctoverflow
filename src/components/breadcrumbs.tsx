"use client";

import Link from "next/link";
import React from "react";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

const CATEGORY_LABELS: Record<string, string> = {
  notes: "Notes",
  pyqs: "PYQs",
  books: "Books",
  lab: "Lab Reports",
  exam: "Exam Mode",
};

const formatLabel = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = React.useMemo(
    () => pathname.split("/").filter(Boolean),
    [pathname]
  );

  const semesterId = segments[0] || null;
  const subjectSlug = segments[1] || null;
  const categorySlug = segments[2] || null;

  const items = React.useMemo(() => {
    const list: { label: string; href: string | null }[] = [
      { label: "Home", href: "/" },
    ];

    if (semesterId) {
      list.push({ label: semesterId, href: `/${semesterId}` });
    }

    if (subjectSlug) {
      list.push({
        label: formatLabel(subjectSlug),
        href: `/${semesterId}/${subjectSlug}`,
      });
    }

    if (categorySlug) {
      list.push({
        label: CATEGORY_LABELS[categorySlug] || formatLabel(categorySlug),
        href: null,
      });
    }

    return list;
  }, [semesterId, subjectSlug, categorySlug]);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground overflow-hidden">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <React.Fragment key={`${item.label}-${idx}`}>
            {idx > 0 && (
              <ChevronRight
                size={14}
                className="text-muted-foreground shrink-0"
              />
            )}
            {isLast ? (
              <span className="truncate text-foreground" aria-current="page">
                {item.label}
              </span>
            ) : item.href ? (
              <Link href={item.href} className="hover:text-foreground truncate">
                {item.label}
              </Link>
            ) : (
              <span className="truncate text-foreground">{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
