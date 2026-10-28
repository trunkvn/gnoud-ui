import { Toggle, ToggleGroup } from "@gnoud-ui/react";
import { Example, PageHeader, PropsTable } from "@/components/example";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/docs/components/toggle");

const rows = [
  ["Toggle pressed / defaultPressed / onPressedChange", "boolean", "false", "Press it uncontrolled, or control it from state."],
  ["Toggle size", '"sm" | "md" | "lg"', '"md"', "2rem, 2.5rem or 3rem tall."],
  ["Toggle value", "string", "-", "Required inside a ToggleGroup: it is what the group reports."],
  ["Toggle disabled", "boolean", "false", "Cannot be pressed or focused with the mouse."],
  ["ToggleGroup value / defaultValue", "string[]", "[]", "The pressed toggles' values."],
  ["ToggleGroup onValueChange", "(value: string[]) => void", "-", "Called with the new list of pressed values."],
  ["ToggleGroup multiple", "boolean", "false", "Allow several to be pressed at once."],
  ["ToggleGroup orientation", '"horizontal" | "vertical"', '"horizontal"', "Which arrow keys move between toggles."],
  ["ToggleGroup disabled", "boolean", "false", "Disable every toggle in the group."],
] as const;

const bold = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" aria-hidden="true">
    <path d="M4.5 2.5h4a2.5 2.5 0 0 1 0 5h-4zM4.5 7.5h5a2.5 2.5 0 0 1 0 5h-5z" />
  </svg>
);

export default function TogglePage() {
  return (
    <>
      <PageHeader href="/docs/components/toggle" eyebrow="Component · 23" title="Toggle">
        A button that stays pressed, like bold in an editor. Group several into one strip to pick
        one option or many. Exposed with aria-pressed; arrow keys move through a group. Built on Base UI.
      </PageHeader>

      <Example
        title="Toggle"
        description="An icon-only toggle needs an aria-label."
        code={`<Toggle>Italic</Toggle>
<Toggle aria-label="Bold" defaultPressed>
  <BoldIcon />
</Toggle>
<Toggle disabled>Disabled</Toggle>`}
      >
        <Toggle>Italic</Toggle>
        <Toggle aria-label="Bold" defaultPressed>
          {bold}
        </Toggle>
        <Toggle disabled>Disabled</Toggle>
      </Example>

      <Example
        title="Sizes"
        code={`<Toggle size="sm">Small</Toggle>
<Toggle size="md">Medium</Toggle>
<Toggle size="lg">Large</Toggle>`}
      >
        <Toggle size="sm">Small</Toggle>
        <Toggle size="md">Medium</Toggle>
        <Toggle size="lg">Large</Toggle>
      </Example>

      <Example
        title="Group: pick one"
        description="One toggle is pressed at a time. Name the group with aria-label."
        code={`<ToggleGroup aria-label="Text alignment" defaultValue={["left"]}>
  <Toggle value="left">Left</Toggle>
  <Toggle value="center">Center</Toggle>
  <Toggle value="right">Right</Toggle>
</ToggleGroup>`}
      >
        <ToggleGroup aria-label="Text alignment" defaultValue={["left"]}>
          <Toggle value="left">Left</Toggle>
          <Toggle value="center">Center</Toggle>
          <Toggle value="right">Right</Toggle>
        </ToggleGroup>
      </Example>

      <Example
        title="Group: pick several"
        code={`<ToggleGroup multiple aria-label="Text style" defaultValue={["bold"]}>
  <Toggle value="bold">Bold</Toggle>
  <Toggle value="italic">Italic</Toggle>
  <Toggle value="underline">Underline</Toggle>
</ToggleGroup>`}
      >
        <ToggleGroup multiple aria-label="Text style" defaultValue={["bold"]}>
          <Toggle value="bold">Bold</Toggle>
          <Toggle value="italic">Italic</Toggle>
          <Toggle value="underline">Underline</Toggle>
        </ToggleGroup>
      </Example>

      <PropsTable rows={rows} />
      <p className="mt-3 text-sm text-muted">
        Use a Switch for a setting that applies immediately, and Tabs when the choice swaps a panel
        of content. A Toggle is for a tool or a view option that is either on or off.
      </p>
    </>
  );
}
