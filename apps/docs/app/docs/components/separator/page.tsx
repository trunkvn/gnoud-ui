import { Separator } from "@gnoud-ui/react";
import { Example, PageHeader, PropsTable } from "@/components/example";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/docs/components/separator");

const rows = [
  ["orientation", '"horizontal" | "vertical"', '"horizontal"', "Which way the line runs. A vertical one stretches to the height of its flex row."],
  ["role", "string", '"separator"', 'Pass "presentation" for a line that is purely decorative and should be skipped by screen readers.'],
  ["className", "string", "-", "Merged with the component's own class."],
] as const;

export default function SeparatorPage() {
  return (
    <>
      <PageHeader href="/docs/components/separator" eyebrow="Component · 21" title="Separator">
        A thin ruled line between groups of content. It is a real separator for assistive
        technology, horizontal or vertical. Built on Base UI.
      </PageHeader>

      <Example
        title="Horizontal"
        code={`<div>
  <h3>Account</h3>
  <p>Manage your profile.</p>
  <Separator />
  <h3>Billing</h3>
  <p>Invoices and payment methods.</p>
</div>`}
      >
        <div className="w-full max-w-sm">
          <h3 className="font-display text-lg font-bold">Account</h3>
          <p className="text-sm text-muted">Manage your profile.</p>
          <Separator className="my-4" />
          <h3 className="font-display text-lg font-bold">Billing</h3>
          <p className="text-sm text-muted">Invoices and payment methods.</p>
        </div>
      </Example>

      <Example
        title="Vertical"
        description="Inside a flex row it stretches to the row's height."
        code={`<div className="flex items-center gap-4">
  <span>Docs</span>
  <Separator orientation="vertical" />
  <span>Blog</span>
  <Separator orientation="vertical" />
  <span>Changelog</span>
</div>`}
      >
        <div className="flex h-6 items-center gap-4 text-sm">
          <span>Docs</span>
          <Separator orientation="vertical" />
          <span>Blog</span>
          <Separator orientation="vertical" />
          <span>Changelog</span>
        </div>
      </Example>

      <PropsTable rows={rows} />
      <p className="mt-3 text-sm text-muted">
        Between two sections of a page, prefer a heading: it gives screen reader users something to
        navigate by. A separator only marks that two things are different.
      </p>
    </>
  );
}
