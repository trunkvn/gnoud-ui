"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { flatNav } from "@/lib/nav";

export function Pager() {
  const pathname = usePathname();
  const index = flatNav.findIndex((item) => item.href === pathname);
  if (index === -1) return null;

  const prev = flatNav[index - 1];
  const next = flatNav[index + 1];

  return (
    <nav aria-label="Pagination" className="mt-16 flex justify-between gap-4 pt-6" style={{ borderTop: "1px solid var(--gu-line)" }}>
      {prev ? (
        <Link href={prev.href} className="pager-link">
          <span className="pager-link__hint">← Previous</span>
          {prev.title}
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link href={next.href} className="pager-link text-right">
          <span className="pager-link__hint">Next →</span>
          {next.title}
        </Link>
      )}
    </nav>
  );
}
