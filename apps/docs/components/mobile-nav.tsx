"use client";

import { usePathname } from "next/navigation";
import { DocsNav } from "./docs-nav";
import { NPM_URL, REPO_URL } from "@/lib/site";
import { ExternalLink } from "./external-link";
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
        <div className="mt-6">
          <p className="mb-2 pl-[calc(0.75rem+2px)] font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Elsewhere
          </p>
          <ul className="grid gap-0.5">
            <li>
              <ExternalLink href={REPO_URL} className="nav-link">
                GitHub
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={NPM_URL} className="nav-link">
                npm
              </ExternalLink>
            </li>
          </ul>
        </div>
        <div className="mt-8 sm:hidden">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Theme</p>
          <ThemeToggle />
        </div>
      </div>
    </details>
  );
}
