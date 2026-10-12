import { Button } from "@gnoud-ui/react";
import { Example, PageHeader, PropsTable } from "@/components/example";

export const metadata = { title: "Button" };

const props = [
  ["variant", '"primary" | "secondary" | "ghost"', '"secondary"', "Visual weight. Use one primary per screen."],
  ["size", '"sm" | "md" | "lg"', '"md"', "Height and padding."],
  ["loading", "boolean", "false", "Shows a spinner and ignores clicks. Stays focusable (aria-disabled), sets aria-busy."],
  ["disabled", "boolean", "false", "Native disabled on a <button>; aria-disabled on a custom element."],
  ["render", "ReactElement", "-", "Render another element, e.g. a link, keeping its own props."],
  ["type", "string", '"button"', "Defaults to button so it never submits a form by accident."],
] as const;

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export default function ButtonPage() {
  return (
    <>
      <PageHeader eyebrow="Component · 01" title="Button">
        Lifts off the page on hover and presses into it on click, like a stamp. Built on a native
        button, so keyboard and screen reader behaviour comes for free.
      </PageHeader>

      <Example
        title="Variants"
        code={`<Button variant="primary">Primary</Button>
<Button>Secondary</Button>
<Button variant="ghost">Ghost</Button>`}
      >
        <Button variant="primary">Primary</Button>
        <Button>Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </Example>

      <Example
        title="Sizes"
        code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}
      >
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </Example>

      <Example
        title="With an icon"
        description="SVGs inside a button are sized to the text and never shrink."
        code={`<Button variant="primary">
  Continue <ArrowIcon />
</Button>`}
      >
        <Button variant="primary">
          Continue <Arrow />
        </Button>
      </Example>

      <Example
        title="States"
        description="Loading keeps focus on the button, so a keyboard user does not lose their place; disabled removes it from the tab order."
        code={`<Button loading variant="primary">Saving</Button>
<Button disabled>Disabled</Button>
<Button disabled variant="ghost">Disabled</Button>`}
      >
        <Button loading variant="primary">
          Saving
        </Button>
        <Button disabled>Disabled</Button>
        <Button disabled variant="ghost">
          Disabled
        </Button>
      </Example>

      <Example
        title="As a link"
        description="render swaps the element and keeps its props. Style stays identical."
        code={`<Button render={<a href="https://github.com" />}>
  GitHub
</Button>`}
      >
        <Button render={<a href="https://github.com" />}>GitHub</Button>
      </Example>

      <Example
        title="Override with Tailwind"
        description="All gnoud-ui styles live in a cascade layer, so your utilities win without !important."
        code={`<Button className="w-full rounded-full">Full width, pill</Button>`}
      >
        <Button className="w-full rounded-full">Full width, pill</Button>
      </Example>

      <PropsTable rows={props} />
      <p className="mt-3 text-sm text-muted">
        All other props of <span className="font-mono">&lt;button&gt;</span> (including{" "}
        <span className="font-mono">ref</span>) are passed through.
      </p>
    </>
  );
}
