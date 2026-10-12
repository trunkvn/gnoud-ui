import type { Metadata } from "next";
import { Familjen_Grotesk, Geist_Mono, Hanken_Grotesk } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { ExternalLink } from "@/components/external-link";
import { NPM_URL, REPO_URL, SITE_URL } from "@/lib/site";
import "./globals.css";

const display = Familjen_Grotesk({
  variable: "--font-display",
  subsets: ["latin", "vietnamese"],
});

const body = Hanken_Grotesk({
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "gnoud-ui", template: "%s · gnoud-ui" },
  description:
    "A small React component library with a paper-and-ink identity: hard shadows, ruled borders, warm paper, accessible by default.",
  // Each page names itself as canonical; resolved against metadataBase.
  alternates: { canonical: "./" },
  openGraph: { type: "website", siteName: "gnoud-ui" },
  twitter: { card: "summary_large_image" },
};

// Runs before first paint so a saved light/dark choice never flashes the wrong theme.
const themeScript = `try{var t=localStorage.getItem("gu-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-surface focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <footer className="mx-auto mt-24 max-w-6xl px-5 pb-12">
          <p
            className="pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted"
            style={{ borderTop: "1px solid var(--gu-line)" }}
          >
            gnoud-ui · MIT · Built with Next.js and Base UI ·{" "}
            <ExternalLink href={REPO_URL} className="underline underline-offset-4">
              GitHub
            </ExternalLink>{" "}
            ·{" "}
            <ExternalLink href={NPM_URL} className="underline underline-offset-4">
              npm
            </ExternalLink>
          </p>
        </footer>
      </body>
    </html>
  );
}
