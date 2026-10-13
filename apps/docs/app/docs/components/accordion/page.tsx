import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "@gnoud-ui/react";
import { Example, PageHeader, PropsTable } from "@/components/example";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/docs/components/accordion");

const rows = [
  ["Accordion multiple", "boolean", "false", "Allow several sections open at once. By default opening one closes the others."],
  ["Accordion value / defaultValue", "string[]", "[]", "Which items are open, by their value. Controlled with value + onValueChange."],
  ["Accordion onValueChange", "(value, details) => void", "-", "Fires when a section opens or closes."],
  ["Accordion hiddenUntilFound", "boolean", "false", "Lets the browser's find-in-page open a closed section."],
  ["AccordionItem value", "string", "auto", "This section's id in the open list."],
  ["AccordionItem disabled", "boolean", "false", "Visible but cannot be toggled."],
] as const;

const faq = [
  ["What is gnoud-ui?", "A small React component library with a paper-and-ink look: hard shadows, ruled borders, warm paper."],
  ["Does it need Tailwind?", "No. It ships one stylesheet. Tailwind works well with it if you declare the layer order."],
  ["Is dark mode built in?", "Yes. It follows the operating system, or you can force it with data-theme on any ancestor."],
] as const;

export default function AccordionPage() {
  return (
    <>
      <PageHeader href="/docs/components/accordion" eyebrow="Component · 14" title="Accordion">
        Sections that open and close, set as a ruled list. Each header is a real button inside a
        heading, so the titles show up in the page outline and screen readers announce expanded or
        collapsed. Built on Base UI.
      </PageHeader>

      <Example
        title="One at a time"
        description="Opening a section closes the others. Enter or Space toggles; each header is its own tab stop."
        code={`<Accordion defaultValue={["what"]}>
  <AccordionItem value="what">
    <AccordionTrigger>What is gnoud-ui?</AccordionTrigger>
    <AccordionPanel>A small React component library…</AccordionPanel>
  </AccordionItem>
  <AccordionItem value="tailwind">
    <AccordionTrigger>Does it need Tailwind?</AccordionTrigger>
    <AccordionPanel>No. It ships one stylesheet…</AccordionPanel>
  </AccordionItem>
</Accordion>`}
      >
        <Accordion defaultValue={["what"]} className="w-full">
          {faq.map(([q, a], i) => (
            <AccordionItem key={q} value={["what", "tailwind", "dark"][i]}>
              <AccordionTrigger>{q}</AccordionTrigger>
              <AccordionPanel>{a}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Example>

      <Example
        title="Several open"
        code={`<Accordion multiple defaultValue={["what", "dark"]}>…</Accordion>`}
      >
        <Accordion multiple defaultValue={["what", "dark"]} className="w-full">
          {faq.map(([q, a], i) => (
            <AccordionItem key={q} value={["what", "tailwind", "dark"][i]}>
              <AccordionTrigger>{q}</AccordionTrigger>
              <AccordionPanel>{a}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Example>

      <Example
        title="A disabled section"
        code={`<AccordionItem value="soon" disabled>
  <AccordionTrigger>Coming soon</AccordionTrigger>
  <AccordionPanel>…</AccordionPanel>
</AccordionItem>`}
      >
        <Accordion className="w-full">
          <AccordionItem value="now">
            <AccordionTrigger>Available now</AccordionTrigger>
            <AccordionPanel>This section opens.</AccordionPanel>
          </AccordionItem>
          <AccordionItem value="soon" disabled>
            <AccordionTrigger>Coming soon</AccordionTrigger>
            <AccordionPanel>This one does not.</AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Example>

      <PropsTable rows={rows} />
      <p className="mt-3 text-sm text-muted">
        Arrow keys do not move between headers: they are ordinary buttons in the tab order, which the
        WAI-ARIA accordion pattern allows. Use Tabs when you want arrow-key navigation.
      </p>
    </>
  );
}
