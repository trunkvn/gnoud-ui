import type { Metadata } from "next";
import { findPage } from "./nav";
import { SITE_NAME } from "./site";

export const OG_SIZE = { width: 1200, height: 630 } as const;

/** The share image for a page: generated at build time by app/og. */
export function ogImagePath(href: string): string {
  return href === "/" ? "/og" : `/og${href}`;
}

/**
 * Everything a docs page needs in <head>, from the one list that also drives the sidebar,
 * the sitemap and llms.txt: its own title, description, canonical URL and share image.
 */
export function pageMetadata(href: string): Metadata {
  const page = findPage(href);
  if (!page) throw new Error(`pageMetadata: "${href}" is not in lib/nav.ts`);

  const images = [{ url: ogImagePath(href), ...OG_SIZE, alt: `${page.title}: ${SITE_NAME}` }];
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: href },
    openGraph: { type: "article", siteName: SITE_NAME, title: `${page.title} · ${SITE_NAME}`, description: page.description, url: href, images },
    twitter: { card: "summary_large_image", title: `${page.title} · ${SITE_NAME}`, description: page.description, images },
  };
}
