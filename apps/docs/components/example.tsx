import type { ReactNode } from "react";
import { findPage } from "@/lib/nav";
import { ogImagePath } from "@/lib/metadata";
import { AUTHOR, REPO_URL, SITE_NAME, SITE_URL } from "@/lib/site";
import { CodeBlock } from "./code-block";
import { JsonLd } from "./json-ld";

export function Label({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
      {children}
    </p>
  );
}

/** A live preview with the code that produces it underneath. */
export async function Example({
  title,
  description,
  code,
  children,
}: {
  title: string;
  description?: string;
  code: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
      {description && <p className="mt-1 max-w-[60ch] text-muted">{description}</p>}
      <div
        className="mt-4 flex flex-wrap items-center gap-4 bg-surface p-8"
        style={{ border: "1px solid var(--gu-line)", borderBottom: 0 }}
      >
        {children}
      </div>
      <CodeBlock code={code} />
    </section>
  );
}

export function PageHeader({
  href,
  eyebrow,
  title,
  children,
}: {
  /** The page's path, as listed in lib/nav.ts. */
  href: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  const page = findPage(href);
  if (!page) throw new Error(`PageHeader: "${href}" is not in lib/nav.ts`);

  return (
    <header className="mb-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
                { "@type": "ListItem", position: 2, name: page.title, item: `${SITE_URL}${href}` },
              ],
            },
            {
              "@type": "TechArticle",
              headline: page.title,
              description: page.description,
              url: `${SITE_URL}${href}`,
              image: `${SITE_URL}${ogImagePath(href)}`,
              inLanguage: "en",
              author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
              isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
              about: { "@type": "SoftwareSourceCode", name: "@gnoud-ui/react", codeRepository: REPO_URL },
            },
          ],
        }}
      />
      <Label>{eyebrow}</Label>
      <h1
        className="font-display text-5xl font-bold"
        style={{ letterSpacing: "var(--gu-tracking-display)", lineHeight: "var(--gu-leading-tight)" }}
      >
        {title}
      </h1>
      <p className="mt-3 max-w-[56ch] text-muted">{children}</p>
    </header>
  );
}

export function PropsTable({ rows }: { rows: readonly (readonly [string, string, string, string])[] }) {
  return (
    <section>
      <h2 className="mb-4 font-display text-2xl font-bold tracking-tight">Props</h2>
      <div className="overflow-x-auto" style={{ border: "1px solid var(--gu-line)" }}>
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-tint font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            <tr>
              <th className="p-3">Prop</th>
              <th className="p-3">Type</th>
              <th className="p-3">Default</th>
              <th className="p-3">Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, type, def, desc]) => (
              <tr key={name} style={{ borderTop: "1px solid var(--gu-line)" }}>
                <td className="p-3 font-mono">{name}</td>
                <td className="p-3 font-mono text-[13px]">{type}</td>
                <td className="p-3 font-mono text-[13px] text-muted">{def}</td>
                <td className="p-3 text-muted">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
