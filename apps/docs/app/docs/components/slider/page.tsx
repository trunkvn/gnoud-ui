import { Slider } from "@gnoud-ui/react";
import { Example, PageHeader, PropsTable } from "@/components/example";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/docs/components/slider");

const rows = [
  ["value / defaultValue", "number | number[]", "-", "One number for one thumb, an array for a range."],
  ["onValueChange", "(value) => void", "-", "Called continuously while dragging."],
  ["onValueCommitted", "(value) => void", "-", "Called once when the person lets go. Use it to save or fetch."],
  ["min / max / step", "number", "0 / 100 / 1", "The range and the size of one step."],
  ["largeStep", "number", "10", "How far Page Up, Page Down and Shift + arrow move."],
  ["label", "ReactNode", "-", "Visible name. Without it, pass aria-label."],
  ["showValue", "boolean", "false", "Show the current value beside the label."],
  ["thumbLabels", "string[]", "-", "One accessible name per thumb. Needed for a range."],
  ["format", "Intl.NumberFormatOptions", "-", "How the value is written, e.g. a currency."],
  ["orientation", '"horizontal" | "vertical"', '"horizontal"', "Vertical needs a height on the slider's parent."],
  ["disabled / name / form", "-", "-", "Disable it, or submit its value with a form."],
] as const;

export default function SliderPage() {
  return (
    <>
      <PageHeader href="/docs/components/slider" eyebrow="Component · 24" title="Slider">
        Pick a number, or a range, by dragging a block along a ruled line or with the arrow keys.
        A real slider for assistive technology, and it submits with forms. Built on Base UI.
      </PageHeader>

      <Example
        title="Basic"
        code={`<Slider label="Volume" defaultValue={40} showValue />`}
      >
        <div className="w-full max-w-md">
          <Slider label="Volume" defaultValue={40} showValue />
        </div>
      </Example>

      <Example
        title="Steps"
        description="Arrow keys move one step; Home and End jump to the ends; Page Up and Page Down move by largeStep."
        code={`<Slider label="Rating" defaultValue={3} min={1} max={5} step={1} showValue />`}
      >
        <div className="w-full max-w-md">
          <Slider label="Rating" defaultValue={3} min={1} max={5} step={1} showValue />
        </div>
      </Example>

      <Example
        title="Range"
        description="Pass an array. Give each thumb its own name, or screen reader users cannot tell them apart."
        code={`<Slider
  label="Price"
  defaultValue={[20, 80]}
  thumbLabels={["Minimum price", "Maximum price"]}
  format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
  showValue
/>`}
      >
        <div className="w-full max-w-md">
          <Slider
            label="Price"
            defaultValue={[20, 80]}
            thumbLabels={["Minimum price", "Maximum price"]}
            format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
            showValue
          />
        </div>
      </Example>

      <Example
        title="Disabled"
        code={`<Slider label="Brightness" defaultValue={60} disabled />`}
      >
        <div className="w-full max-w-md">
          <Slider label="Brightness" defaultValue={60} disabled />
        </div>
      </Example>

      <PropsTable rows={rows} />
    </>
  );
}
