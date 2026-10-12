import { Checkbox } from "@gnoud-ui/react";
import { Example, PageHeader, PropsTable } from "@/components/example";

export const metadata = { title: "Checkbox" };

const rows = [
  ["label", "ReactNode", "-", "Wraps the box in a <label> so the text toggles it and names it. Without it, pass aria-label."],
  ["checked / defaultChecked", "boolean", "false", "Controlled / uncontrolled state."],
  ["onCheckedChange", "(checked, details) => void", "-", "Fires when the user toggles it."],
  ["indeterminate", "boolean", "false", "Mixed state, announced as aria-checked=mixed."],
  ["disabled / readOnly / required", "boolean", "false", "As in a native checkbox."],
  ["name / value", "string", "-", "Submitted with the surrounding form when checked."],
  ["className", "string", "-", "With a label: applied to the wrapper. Without: to the box."],
] as const;

export default function CheckboxPage() {
  return (
    <>
      <PageHeader eyebrow="Component · 05" title="Checkbox">
        Built on Base UI for correct keyboard, mixed-state and form behaviour, drawn in the same
        stamped style. It presses into the page when you click it.
      </PageHeader>

      <Example
        title="With a label"
        description="Click the text or the box. Space toggles it from the keyboard."
        code={`<Checkbox label="Email me product updates" />
<Checkbox label="Remember me" defaultChecked />`}
      >
        <div className="grid gap-3">
          <Checkbox label="Email me product updates" />
          <Checkbox label="Remember me" defaultChecked />
        </div>
      </Example>

      <Example
        title="States"
        code={`<Checkbox label="Select all" indeterminate />
<Checkbox label="Disabled" disabled />
<Checkbox label="Disabled, checked" disabled defaultChecked />`}
      >
        <div className="grid gap-3">
          <Checkbox label="Select all" indeterminate />
          <Checkbox label="Disabled" disabled />
          <Checkbox label="Disabled, checked" disabled defaultChecked />
        </div>
      </Example>

      <Example
        title="Without visible text"
        description="No label prop means you must name it yourself."
        code={`<Checkbox aria-label="Select row 3" />`}
      >
        <Checkbox aria-label="Select row 3" />
      </Example>

      <PropsTable rows={rows} />
    </>
  );
}
