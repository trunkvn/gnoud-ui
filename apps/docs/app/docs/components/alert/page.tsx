import { Alert, AlertDescription, AlertTitle } from "@gnoud-ui/react";
import { Example, PageHeader, PropsTable } from "@/components/example";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/docs/components/alert");

const rows = [
  ["variant", '"info" | "success" | "warning" | "danger"', '"info"', "The coloured rule. The title and text must carry the meaning, not the colour."],
  ["role", "string", '"status" | "alert"', "Danger defaults to alert (assertive), the rest to status (polite). Override for static notices."],
] as const;

export default function AlertPage() {
  return (
    <>
      <PageHeader href="/docs/components/alert" eyebrow="Component · 08" title="Alert">
        An inline message set like a margin note: a thick coloured rule on the left, and words
        that say what happened.
      </PageHeader>

      <Example
        title="Variants"
        code={`<Alert>
  <AlertTitle>Heads up</AlertTitle>
  <AlertDescription>Your trial ends in 3 days.</AlertDescription>
</Alert>

<Alert variant="success">…</Alert>
<Alert variant="warning">…</Alert>
<Alert variant="danger">…</Alert>`}
      >
        <div className="grid w-full gap-3">
          <Alert>
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>Your trial ends in 3 days.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertTitle>Saved</AlertTitle>
            <AlertDescription>Your changes are live.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <AlertTitle>Almost full</AlertTitle>
            <AlertDescription>You have used 92% of your storage.</AlertDescription>
          </Alert>
          <Alert variant="danger">
            <AlertTitle>Payment failed</AlertTitle>
            <AlertDescription>Your card was declined. Update it to keep your plan.</AlertDescription>
          </Alert>
        </div>
      </Example>

      <Example
        title="Title only"
        code={`<Alert variant="success">
  <AlertTitle>Copied to clipboard</AlertTitle>
</Alert>`}
      >
        <Alert variant="success" className="w-full">
          <AlertTitle>Copied to clipboard</AlertTitle>
        </Alert>
      </Example>

      <PropsTable rows={rows} />
      <p className="mt-3 text-sm text-muted">
        Live-region roles announce only when the alert is inserted or changed after the page has
        loaded. An alert that is already on the page at load is read in order like any text.
      </p>
    </>
  );
}
