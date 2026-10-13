import { Radio, RadioGroup } from "@gnoud-ui/react";
import { Example, PageHeader, PropsTable } from "@/components/example";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/docs/components/radio");

const rows = [
  ["RadioGroup value / defaultValue", "string", "-", "The selected value. Controlled with value + onValueChange."],
  ["RadioGroup onValueChange", "(value, details) => void", "-", "Fires when the selection changes."],
  ["RadioGroup name / required / disabled / readOnly", "-", "-", "Form integration. The selected value is submitted under name."],
  ["RadioGroup aria-labelledby / aria-label", "string", "required", "Names the group. Point it at a visible heading."],
  ["Radio value", "string", "required", "What this option stands for."],
  ["Radio label", "ReactNode", "-", "Wraps the radio in a <label> so the text selects it and names it. Without it, pass aria-label."],
  ["Radio disabled", "boolean", "false", "Visible but not choosable."],
  ["className", "string", "-", "On Radio: with a label it goes on the wrapper, without on the radio."],
] as const;

export default function RadioPage() {
  return (
    <>
      <PageHeader href="/docs/components/radio" eyebrow="Component · 13" title="Radio">
        One choice from a few. Built on Base UI: the group is one tab stop and the arrow keys move and
        select. Round, so it never reads as a checkbox, and it sinks into the page when pressed.
      </PageHeader>

      <Example
        title="A group"
        description="Tab into the group, then use the arrow keys. Name the group with a visible heading."
        code={`<p id="plan-label">Plan</p>
<RadioGroup aria-labelledby="plan-label" defaultValue="free">
  <Radio value="free" label="Free" />
  <Radio value="pro" label="Pro" />
  <Radio value="team" label="Team" />
</RadioGroup>`}
      >
        <div className="grid gap-3">
          <p id="plan-label" className="text-sm font-medium">
            Plan
          </p>
          <RadioGroup aria-labelledby="plan-label" defaultValue="free">
            <Radio value="free" label="Free" />
            <Radio value="pro" label="Pro" />
            <Radio value="team" label="Team" />
          </RadioGroup>
        </div>
      </Example>

      <Example
        title="Disabled"
        code={`<RadioGroup aria-label="Billing" defaultValue="monthly">
  <Radio value="monthly" label="Monthly" />
  <Radio value="yearly" label="Yearly" />
  <Radio value="lifetime" label="Lifetime (sold out)" disabled />
</RadioGroup>`}
      >
        <RadioGroup aria-label="Billing" defaultValue="monthly">
          <Radio value="monthly" label="Monthly" />
          <Radio value="yearly" label="Yearly" />
          <Radio value="lifetime" label="Lifetime (sold out)" disabled />
        </RadioGroup>
      </Example>

      <Example
        title="In a form"
        description="The chosen value is submitted under the group's name."
        code={`<form>
  <RadioGroup name="size" aria-label="Size" defaultValue="m">
    <Radio value="s" label="Small" />
    <Radio value="m" label="Medium" />
    <Radio value="l" label="Large" />
  </RadioGroup>
</form>`}
      >
        <form>
          <RadioGroup name="size" aria-label="Size" defaultValue="m">
            <Radio value="s" label="Small" />
            <Radio value="m" label="Medium" />
            <Radio value="l" label="Large" />
          </RadioGroup>
        </form>
      </Example>

      <PropsTable rows={rows} />
      <p className="mt-3 text-sm text-muted">
        Use radios when the options are few and all worth seeing. For many options use Select; for
        several choices at once use Checkbox.
      </p>
    </>
  );
}
