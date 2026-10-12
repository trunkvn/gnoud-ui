"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/nav";

export function DocsNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation" className="grid gap-7">
      {nav.map((section) => (
        <div key={section.title}>
          <p className="mb-2 pl-[calc(0.75rem+2px)] font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            {section.title}
          </p>
          <ul className="grid gap-0.5">
            {section.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="nav-link"
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
