import type { ReactNode } from "react";
import { CodeBlock } from "./code-block";

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
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <header className="mb-12">
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
