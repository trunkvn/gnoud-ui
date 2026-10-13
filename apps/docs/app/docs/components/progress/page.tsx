import { Progress } from "@gnoud-ui/react";
import { Example, PageHeader, PropsTable } from "@/components/example";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/docs/components/progress");

const rows = [
  ["value", "number | null", "required", "The current value. null means working, but the length is unknown."],
  ["min / max", "number", "0 / 100", "The range. The fill is the value's position within it."],
  ["label", "ReactNode", "-", "Visible name. Without it, pass aria-label."],
  ["showValue", "boolean", "false", "Show the value (a percentage by default) beside the label."],
  ["format", "Intl.NumberFormatOptions", "percent", "How the value is written, e.g. a unit instead of a percentage."],
  ["getAriaValueText", "(formatted, value) => string", "-", "A friendlier spoken value than the bare number."],
] as const;

export default function ProgressPage() {
  return (
    <>
      <PageHeader href="/docs/components/progress" eyebrow="Component · 17" title="Progress">
        A ruled trough filled with colour, for work that has a measurable end. With no known length it
        shows a block sweeping across instead. Announced as a progress bar. Built on Base UI.
      </PageHeader>

      <Example
        title="Determinate"
        code={`<Progress label="Uploading" value={64} showValue />`}
      >
        <div className="w-full max-w-md">
          <Progress label="Uploading" value={64} showValue />
        </div>
      </Example>

      <Example
        title="Indeterminate"
        description="Pass null when you cannot say how long it will take. With reduced motion it sweeps more slowly instead of stopping."
        code={`<Progress label="Preparing" value={null} />`}
      >
        <div className="w-full max-w-md">
          <Progress label="Preparing" value={null} />
        </div>
      </Example>

      <Example
        title="Another range and a name only for screen readers"
        code={`<Progress aria-label="Step 3 of 5" value={3} min={0} max={5} />`}
      >
        <div className="w-full max-w-md">
          <Progress aria-label="Step 3 of 5" value={3} min={0} max={5} />
        </div>
      </Example>

      <Example
        title="Complete"
        code={`<Progress label="Done" value={100} showValue />`}
      >
        <div className="w-full max-w-md">
          <Progress label="Done" value={100} showValue />
        </div>
      </Example>

      <PropsTable rows={rows} />
      <p className="mt-3 text-sm text-muted">
        Update <span className="font-mono">value</span> from state as the work advances. The bar does
        not announce every change; for long jobs also give a status message when it finishes.
      </p>
    </>
  );
}
