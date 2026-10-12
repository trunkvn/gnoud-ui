import { Input } from "@gnoud-ui/react";
import { Example, PageHeader, PropsTable } from "@/components/example";

export const metadata = { title: "Input" };

const rows = [
  ["size", '"sm" | "md" | "lg"', '"md"', "Height and padding. Named size, so it does not collide with the native size attribute."],
  ["invalid", "boolean", "false", "Red border and aria-invalid. Pair it with a visible message."],
  ["type", "string", '"text"', "Any native input type."],
] as const;

function Field({ label, hint, hintId, children }: { label: string; hint?: string; hintId?: string; children: React.ReactNode }) {
  return (
    <div className="grid w-full max-w-xs content-start gap-1.5 text-sm">
      <label className="grid gap-1.5">
        <span className="font-medium">{label}</span>
        {children}
      </label>
      {hint && (
        <span id={hintId} className="text-muted">
          {hint}
        </span>
      )}
    </div>
  );
}

export default function InputPage() {
  return (
    <>
      <PageHeader eyebrow="Component · 02" title="Input">
        A flat, ruled field. Only things you can press are raised; things you write into sit in the
        page. A plain input element underneath, so autofill, forms and mobile keyboards just work.
      </PageHeader>

      <Example
        title="Default"
        description="Always give it a label, either wrapping it or via htmlFor."
        code={`<label>
  Email
  <Input type="email" placeholder="you@example.com" />
</label>`}
      >
        <Field label="Email">
          <Input type="email" placeholder="you@example.com" />
        </Field>
      </Example>

      <Example
        title="Sizes"
        code={`<Input size="sm" aria-label="Small" placeholder="Small" />
<Input size="md" aria-label="Medium" placeholder="Medium" />
<Input size="lg" aria-label="Large" placeholder="Large" />`}
      >
        <div className="grid w-full max-w-xs gap-3">
          <Input size="sm" aria-label="Small" placeholder="Small" />
          <Input size="md" aria-label="Medium" placeholder="Medium" />
          <Input size="lg" aria-label="Large" placeholder="Large" />
        </div>
      </Example>

      <Example
        title="Invalid and disabled"
        description="Tie the message to the field with aria-describedby so screen readers announce it."
        code={`<Input invalid aria-describedby="email-error" defaultValue="not-an-email" />
<p id="email-error">Enter a valid email address.</p>

<Input disabled defaultValue="Read only for now" />`}
      >
        <Field label="Email" hint="Enter a valid email address." hintId="email-error">
          <Input invalid aria-describedby="email-error" defaultValue="not-an-email" />
        </Field>
        <Field label="Workspace" hint="Managed by your admin.">
          <Input disabled defaultValue="Read only for now" />
        </Field>
      </Example>

      <PropsTable rows={rows} />
      <p className="mt-3 text-sm text-muted">
        All other props of <span className="font-mono">&lt;input&gt;</span> (including{" "}
        <span className="font-mono">ref</span>) are passed through.
      </p>
    </>
  );
}
