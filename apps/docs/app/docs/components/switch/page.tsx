import { Switch } from "@gnoud-ui/react";
import { Example, PageHeader, PropsTable } from "@/components/example";

export const metadata = { title: "Switch" };

const rows = [
  ["label", "ReactNode", "-", "Wraps the switch in a <label> so the text toggles it and names it. Without it, pass aria-label."],
  ["checked / defaultChecked", "boolean", "false", "Controlled / uncontrolled state."],
  ["onCheckedChange", "(checked, details) => void", "-", "Fires when the user toggles it."],
  ["disabled / readOnly / required", "boolean", "false", "As in a native checkbox."],
  ["name / value", "string", '"on"', "Submitted with the surrounding form when on."],
  ["className", "string", "-", "With a label: applied to the wrapper. Without: to the switch."],
] as const;

export default function SwitchPage() {
  return (
    <>
      <PageHeader eyebrow="Component · 09" title="Switch">
        For settings that take effect immediately. Built on Base UI; a square block of ink slides
        across the track. It sinks into the page when pressed, like the checkbox.
      </PageHeader>

      <Example
        title="With a label"
        description="Click the text or the switch. Space toggles it from the keyboard."
        code={`<Switch label="Email notifications" />
<Switch label="Dark mode" defaultChecked />`}
      >
        <div className="grid gap-4">
          <Switch label="Email notifications" />
          <Switch label="Dark mode" defaultChecked />
        </div>
      </Example>

      <Example
        title="Disabled"
        code={`<Switch label="Disabled" disabled />
<Switch label="Disabled, on" disabled defaultChecked />`}
      >
        <div className="grid gap-4">
          <Switch label="Disabled" disabled />
          <Switch label="Disabled, on" disabled defaultChecked />
        </div>
      </Example>

      <Example
        title="Without visible text"
        description="No label prop means you must name it yourself."
        code={`<Switch aria-label="Enable beta features" />`}
      >
        <Switch aria-label="Enable beta features" />
      </Example>

      <PropsTable rows={rows} />
      <p className="mt-3 text-sm text-muted">
        Use a Switch when the change applies at once. Use a Checkbox when the user confirms a
        choice later, for example with a Save button.
      </p>
    </>
  );
}
