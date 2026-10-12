import { Button, Tooltip, TooltipProvider } from "@gnoud-ui/react";
import { Example, PageHeader, PropsTable } from "@/components/example";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/docs/components/tooltip");

const rows = [
  ["content", "ReactNode", "required", "The text shown. Keep it short."],
  ["children", "ReactElement", "required", "The one element that triggers it, e.g. a Button. It must accept a ref and props."],
  ["side", '"top" | "right" | "bottom" | "left"', '"top"', "Preferred side. It flips if there is no room."],
  ["align", '"start" | "center" | "end"', '"center"', "Alignment along that side."],
  ["sideOffset", "number", "6", "Gap in pixels between trigger and tooltip."],
  ["delay / closeDelay", "number", "600 / 0", "Milliseconds of hover before it opens / after it leaves."],
  ["open / defaultOpen / onOpenChange", "-", "-", "Control it yourself."],
  ["disabled", "boolean", "false", "Never opens."],
] as const;

export default function TooltipPage() {
  return (
    <>
      <PageHeader href="/docs/components/tooltip" eyebrow="Component · 10" title="Tooltip">
        A short hint, inked in: the inverse of the page. Opens on hover and on keyboard focus,
        closes with Escape. Built on Base UI.
      </PageHeader>

      <Example
        title="Default"
        description="Hover the button, or Tab to it."
        code={`<Tooltip content="Save changes">
  <Button>Save</Button>
</Tooltip>`}
      >
        <Tooltip content="Save changes">
          <Button>Save</Button>
        </Tooltip>
      </Example>

      <Example
        title="Sides"
        code={`<Tooltip content="Top" side="top"><Button>Top</Button></Tooltip>
<Tooltip content="Right" side="right"><Button>Right</Button></Tooltip>
<Tooltip content="Bottom" side="bottom"><Button>Bottom</Button></Tooltip>
<Tooltip content="Left" side="left"><Button>Left</Button></Tooltip>`}
      >
        <div className="flex flex-wrap gap-4 px-16 py-6">
          <Tooltip content="Top" side="top">
            <Button>Top</Button>
          </Tooltip>
          <Tooltip content="Right" side="right">
            <Button>Right</Button>
          </Tooltip>
          <Tooltip content="Bottom" side="bottom">
            <Button>Bottom</Button>
          </Tooltip>
          <Tooltip content="Left" side="left">
            <Button>Left</Button>
          </Tooltip>
        </div>
      </Example>

      <Example
        title="Shared delay"
        description="Wrap a group in TooltipProvider so that moving from one to the next opens instantly."
        code={`<TooltipProvider>
  <Tooltip content="Bold"><Button aria-label="Bold">B</Button></Tooltip>
  <Tooltip content="Italic"><Button aria-label="Italic">I</Button></Tooltip>
  <Tooltip content="Underline"><Button aria-label="Underline">U</Button></Tooltip>
</TooltipProvider>`}
      >
        <TooltipProvider>
          <div className="flex gap-2">
            <Tooltip content="Bold">
              <Button aria-label="Bold" size="sm">
                B
              </Button>
            </Tooltip>
            <Tooltip content="Italic">
              <Button aria-label="Italic" size="sm">
                I
              </Button>
            </Tooltip>
            <Tooltip content="Underline">
              <Button aria-label="Underline" size="sm">
                U
              </Button>
            </Tooltip>
          </div>
        </TooltipProvider>
      </Example>

      <PropsTable rows={rows} />
      <div className="prose-gu mt-6">
        <div className="note">
          <p>
            <strong>Tooltips are visual only.</strong> The text is not announced to screen readers,
            and touch devices have no hover. Never put essential information in one. For an
            icon-only trigger, give it an <code>aria-label</code> with the same text, as above.
          </p>
        </div>
      </div>
    </>
  );
}
