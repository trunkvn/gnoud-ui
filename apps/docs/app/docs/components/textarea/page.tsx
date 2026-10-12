import { Textarea } from "@gnoud-ui/react";
import { Example, PageHeader, PropsTable } from "@/components/example";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/docs/components/textarea");

const rows = [
  ["invalid", "boolean", "false", "Red border and aria-invalid. Pair it with a visible message."],
  ["rows", "number", "4", "Visible lines before it scrolls. Users can still resize it vertically."],
] as const;

export default function TextareaPage() {
  return (
    <>
      <PageHeader href="/docs/components/textarea" eyebrow="Component · 07" title="Textarea">
        The multi-line sibling of Input: flat, ruled, and a plain textarea underneath.
      </PageHeader>

      <Example
        title="Default"
        description="Always give it a label."
        code={`<label>
  Message
  <Textarea placeholder="Tell us what happened" />
</label>`}
      >
        <label className="grid w-full max-w-md gap-1.5 text-sm">
          <span className="font-medium">Message</span>
          <Textarea placeholder="Tell us what happened" />
        </label>
      </Example>

      <Example
        title="Invalid and disabled"
        description="Tie the message to the field with aria-describedby so screen readers announce it."
        code={`<Textarea invalid aria-describedby="msg-error" defaultValue="Hi" />
<p id="msg-error">Write at least 20 characters.</p>

<Textarea disabled defaultValue="Locked while we review." />`}
      >
        <div className="grid w-full max-w-md gap-1.5 text-sm">
          <label className="grid gap-1.5">
            <span className="font-medium">Message</span>
            <Textarea invalid aria-describedby="msg-error" defaultValue="Hi" />
          </label>
          <span id="msg-error" className="text-muted">
            Write at least 20 characters.
          </span>
        </div>
        <label className="grid w-full max-w-md gap-1.5 text-sm">
          <span className="font-medium">Notes</span>
          <Textarea disabled defaultValue="Locked while we review." />
        </label>
      </Example>

      <PropsTable rows={rows} />
      <p className="mt-3 text-sm text-muted">
        All other props of <span className="font-mono">&lt;textarea&gt;</span> (including{" "}
        <span className="font-mono">ref</span>) are passed through.
      </p>
    </>
  );
}
