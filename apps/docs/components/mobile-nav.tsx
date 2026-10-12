"use client";

import { usePathname } from "next/navigation";
import { DocsNav } from "./docs-nav";
import { REPO_URL } from "./site-header";
import { ThemeToggle } from "./theme-toggle";

/**
 * A plain <details> so it works without extra state. Keying it by pathname remounts it
 * on navigation, which closes it again.
 */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <details key={pathname} className="mobile-nav lg:hidden">
      <summary className="mobile-nav__summary">Menu</summary>
      <div className="mobile-nav__panel">
        <DocsNav />
        {/* the header has no room for this on a phone */}
        <a href={REPO_URL} className="nav-link mt-6 sm:hidden" rel="noopener noreferrer">
          GitHub ↗
        </a>
        <div className="mt-8 sm:hidden">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Theme</p>
          <ThemeToggle />
        </div>
      </div>
    </details>
  );
}
