"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname?.split("/").filter(Boolean) ?? [];
  const crumbs = segments.map((segment, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label = segment === "admin" ? "Dashboard" : segment.charAt(0).toUpperCase() + segment.slice(1);
    return { href, label };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-2">
          {i > 0 && (
            <span className="text-muted-foreground" aria-hidden>
              /
            </span>
          )}
          {i === crumbs.length - 1 ? (
            <span className="font-medium text-primary">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-muted-foreground hover:text-primary focus-visible:outline focus-visible:ring-accent"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
