import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk, Geist_Mono, Hanken_Grotesk } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { ExternalLink } from "@/components/external-link";
import { OG_SIZE } from "@/lib/metadata";
import { AUTHOR, NPM_URL, REPO_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL, THEME_COLORS } from "@/lib/site";
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
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [AUTHOR],
  creator: AUTHOR.name,
  publisher: AUTHOR.name,
  category: "technology",
  keywords: [
    "react",
    "component library",
    "ui kit",
    "design system",
    "accessible components",
    "a11y",
    "base ui",
    "dark mode",
    "css variables",
    "tailwind",
    "typescript",
    "next.js",
  ],
  // Each page names itself as canonical; pages override this with their own path.
  alternates: { canonical: "./" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false, email: false, address: false },
  icons: { icon: "/icon.svg", apple: "/apple-icon" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    images: [{ url: "/og", ...OG_SIZE, alt: "gnoud-ui: interfaces that feel printed" }],
  },
  twitter: { card: "summary_large_image", images: ["/og"] },
};

export const viewport: Viewport = {
  // The address bar follows the OS theme. Pages can still be forced light or dark in-page.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLORS.dark },
  ],
  colorScheme: "light dark",
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
