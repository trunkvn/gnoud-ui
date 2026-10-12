import { Badge } from "@gnoud-ui/react";
import { Example, PageHeader, PropsTable } from "@/components/example";

export const metadata = { title: "Badge" };

const rows = [
  ["variant", '"neutral" | "accent" | "highlight" | "success" | "danger"', '"neutral"', "Meaning, not decoration. Neutral for plain tags, success and danger for status."],
] as const;

export default function BadgePage() {
  return (
    <>
      <PageHeader eyebrow="Component · 03" title="Badge">
        A small stamped label in the same tracked uppercase as every eyebrow in the system. Static
        text, not interactive.
      </PageHeader>

      <Example
        title="Variants"
        code={`<Badge>Beta</Badge>
<Badge variant="accent">New</Badge>
<Badge variant="highlight">Pro</Badge>
<Badge variant="success">Live</Badge>
<Badge variant="danger">Failed</Badge>`}
      >
        <Badge>Beta</Badge>
        <Badge variant="accent">New</Badge>
        <Badge variant="highlight">Pro</Badge>
        <Badge variant="success">Live</Badge>
        <Badge variant="danger">Failed</Badge>
      </Example>

      <PropsTable rows={rows} />
      <p className="mt-3 text-sm text-muted">
        Status is also in the text, never colour alone, so it reads for colour-blind users. All props
        of <span className="font-mono">&lt;span&gt;</span> are passed through.
      </p>
    </>
  );
}
