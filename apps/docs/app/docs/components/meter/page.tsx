import { Meter } from "@gnoud-ui/react";
import { Example, PageHeader, PropsTable } from "@/components/example";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/docs/components/meter");

const rows = [
  ["value", "number", "required", "The current value, within min and max."],
  ["min / max", "number", "0 / 100", "The range. The fill is the value's position within it."],
  ["label", "ReactNode", "-", "Visible name. Without it, pass aria-label."],
  ["showValue", "boolean", "false", "Show the value beside the label."],
  ["format", "Intl.NumberFormatOptions", "-", "How the value is written, e.g. a percentage or a unit."],
  ["locale", "Intl.LocalesArgument", "-", "The locale used to format the value."],
  ["getAriaValueText", "(formatted, value) => string", "-", 'A friendlier spoken value, such as "72 of 100 GB used".'],
  ["--gu-meter-color", "CSS variable", "var(--gu-accent)", "Set it on the meter to colour the fill."],
] as const;

export default function MeterPage() {
  return (
    <>
      <PageHeader href="/docs/components/meter" eyebrow="Component · 22" title="Meter">
        A gauge for a value within a known range, such as disk space or a score. It is not about
        work that finishes: for that, use Progress. Announced as a meter. Built on Base UI.
      </PageHeader>

      <Example
        title="Basic"
        code={`<Meter label="Storage used" value={72} showValue />`}
      >
        <div className="w-full max-w-md">
          <Meter label="Storage used" value={72} showValue />
        </div>
      </Example>

      <Example
        title="Another range and a unit"
        description="The fill follows the value's position between min and max."
        code={`<Meter
  label="Battery"
  value={0.18}
  min={0}
  max={1}
  showValue
  format={{ style: "percent" }}
  aria-valuetext="18 percent charged"
/>`}
      >
        <div className="w-full max-w-md">
          <Meter
            label="Battery"
            value={0.18}
            min={0}
            max={1}
            showValue
            format={{ style: "percent" }}
            aria-valuetext="18 percent charged"
          />
        </div>
      </Example>

      <Example
        title="Colour the fill"
        description="Colour should never be the only signal: keep the label and value visible."
        code={`<Meter
  label="Memory"
  value={91}
  showValue
  style={{ "--gu-meter-color": "var(--gu-danger)" }}
/>`}
      >
        <div className="w-full max-w-md">
          <Meter
            label="Memory"
            value={91}
            showValue
            style={{ "--gu-meter-color": "var(--gu-danger)" } as React.CSSProperties}
          />
        </div>
      </Example>

      <PropsTable rows={rows} />
    </>
  );
}
