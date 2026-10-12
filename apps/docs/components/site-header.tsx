import Link from "next/link";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

export const REPO_URL = "https://github.com/trunkvn/gnoud-ui";

export function Logo() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <rect x="5" y="5" width="16" height="16" fill="var(--gu-ink)" />
      <rect x="2.75" y="2.75" width="16" height="16" fill="var(--gu-accent)" stroke="var(--gu-ink)" strokeWidth="1.5" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-bg" style={{ borderBottom: "1px solid var(--gu-line)" }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 whitespace-nowrap font-display text-lg font-bold tracking-tight">
            <Logo />
            gnoud-ui
          </Link>
          <nav aria-label="Primary" className="hidden gap-5 text-sm sm:flex">
            <Link href="/docs/getting-started" className="hover:underline">
              Docs
            </Link>
            <Link href="/docs/components/button" className="hover:underline">
              Components
            </Link>
            <a href={REPO_URL} className="hover:underline" rel="noopener noreferrer">
              GitHub ↗
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
