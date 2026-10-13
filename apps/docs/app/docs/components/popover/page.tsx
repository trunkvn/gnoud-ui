import { Button, Input, Popover, PopoverClose, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "@gnoud-ui/react";
import { Example, PageHeader, PropsTable } from "@/components/example";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/docs/components/popover");

const rows = [
  ["Popover open / defaultOpen / onOpenChange", "-", "closed", "Open it uncontrolled, or control it from state."],
  ["Popover modal", 'boolean | "trap-focus"', "false", "Modal blocks the page behind it. Put a PopoverClose inside if you use it."],
  ["PopoverTrigger render", "ReactElement", "<button>", "Use your own button: render={<Button />}."],
  ["PopoverContent side", '"top" | "right" | "bottom" | "left"', '"bottom"', "Preferred side. It flips if there is no room."],
  ["PopoverContent align", '"start" | "center" | "end"', '"center"', "Alignment along that side."],
  ["PopoverContent sideOffset", "number", "8", "Gap in pixels between trigger and panel."],
  ["PopoverTitle", "-", "recommended", "The panel's accessible name."],
  ["PopoverDescription", "-", "optional", "The panel's accessible description."],
] as const;

export default function PopoverPage() {
  return (
    <>
      <PageHeader href="/docs/components/popover" eyebrow="Component · 15" title="Popover">
        A small panel anchored to a button, for extra content or a short form. Raised with a hard
        shadow, closes on Escape or an outside click, and gives focus back to the button. Built on Base UI.
      </PageHeader>

      <Example
        title="Default"
        code={`<Popover>
  <PopoverTrigger render={<Button />}>Display</PopoverTrigger>
  <PopoverContent>
    <PopoverTitle>Display</PopoverTitle>
    <PopoverDescription>Choose how the page looks to you.</PopoverDescription>
    <PopoverClose render={<Button variant="ghost" size="sm" />}>Done</PopoverClose>
  </PopoverContent>
</Popover>`}
      >
        <Popover>
          <PopoverTrigger render={<Button />}>Display</PopoverTrigger>
          <PopoverContent>
            <PopoverTitle>Display</PopoverTitle>
            <PopoverDescription>Choose how the page looks to you.</PopoverDescription>
            <PopoverClose render={<Button variant="ghost" size="sm" />}>Done</PopoverClose>
          </PopoverContent>
        </Popover>
      </Example>

      <Example
        title="With a field"
        description="Any content works inside. Focus moves into the panel when it opens."
        code={`<Popover>
  <PopoverTrigger render={<Button variant="primary" />}>Rename</PopoverTrigger>
  <PopoverContent align="start">
    <PopoverTitle>Rename file</PopoverTitle>
    <label>
      Name <Input defaultValue="notes.md" />
    </label>
  </PopoverContent>
</Popover>`}
      >
        <Popover>
          <PopoverTrigger render={<Button variant="primary" />}>Rename</PopoverTrigger>
          <PopoverContent align="start">
            <PopoverTitle>Rename file</PopoverTitle>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">Name</span>
              <Input defaultValue="notes.md" />
            </label>
          </PopoverContent>
        </Popover>
      </Example>

      <Example
        title="Placement"
        code={`<PopoverContent side="right" align="start">…</PopoverContent>`}
      >
        <div className="flex flex-wrap gap-4">
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <Popover key={side}>
              <PopoverTrigger render={<Button size="sm" />}>{side}</PopoverTrigger>
              <PopoverContent side={side}>
                <PopoverTitle>{side}</PopoverTitle>
                <PopoverDescription>Opens on the {side}.</PopoverDescription>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </Example>

      <PropsTable rows={rows} />
      <p className="mt-3 text-sm text-muted">
        A popover is for optional detail. If the person must answer before going on, use Dialog; for a
        list of actions, use Menu.
      </p>
    </>
  );
}
