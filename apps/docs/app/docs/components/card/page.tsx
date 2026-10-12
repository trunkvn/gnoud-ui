import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLabel,
  CardTitle,
  Checkbox,
  Input,
} from "@gnoud-ui/react";
import { Example, PageHeader, PropsTable } from "@/components/example";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/docs/components/card");

const rows = [
  ["variant", '"raised" | "flat"', '"raised"', "Raised has the print shadow; flat is a quiet hairline box for dense layouts."],
  ["CardTitle as", '"h1" … "h6"', '"h3"', "Pick the heading level that keeps the page outline correct."],
] as const;

export default function CardPage() {
  return (
    <>
      <PageHeader href="/docs/components/card" eyebrow="Component · 04" title="Card">
        A printed panel. Built from small parts (header, label, title, description, content,
        footer) so you only use what you need.
      </PageHeader>

      <Example
        title="Raised and flat"
        code={`<Card>
  <CardHeader>
    <CardLabel>02 · Button</CardLabel>
    <CardTitle>Stamped, not floated</CardTitle>
    <CardDescription>Hard shadows instead of blur.</CardDescription>
  </CardHeader>
  <CardFooter><Button variant="primary">Try it</Button></CardFooter>
</Card>

<Card variant="flat">…</Card>`}
      >
        <Card className="w-72">
          <CardHeader>
            <CardLabel>02 · Button</CardLabel>
            <CardTitle>Stamped, not floated</CardTitle>
            <CardDescription>Hard shadows instead of blur.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="primary">Try it</Button>
          </CardFooter>
        </Card>
        <Card variant="flat" className="w-72">
          <CardHeader>
            <CardLabel>Flat</CardLabel>
            <CardTitle>Quiet by default</CardTitle>
            <CardDescription>For dense lists and settings.</CardDescription>
          </CardHeader>
        </Card>
      </Example>

      <Example
        title="Composition"
        description="Every component built so far in one place: same radius, border, type and shadow language."
        code={`<Card>
  <CardHeader>
    <CardLabel>Account · 01</CardLabel>
    <CardTitle as="h2">Sign in <Badge variant="accent">New</Badge></CardTitle>
  </CardHeader>
  <CardContent>
    <label>Email <Input type="email" /></label>
    <Checkbox label="Remember me" defaultChecked />
  </CardContent>
  <CardFooter>
    <Button variant="primary">Continue</Button>
    <Button variant="ghost">Cancel</Button>
  </CardFooter>
</Card>`}
      >
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardLabel>Account · 01</CardLabel>
            <CardTitle as="h2">
              Sign in <Badge variant="accent">New</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">Email</span>
              <Input type="email" placeholder="you@example.com" />
            </label>
            <Checkbox label="Remember me" defaultChecked />
          </CardContent>
          <CardFooter>
            <Button variant="primary">Continue</Button>
            <Button variant="ghost">Cancel</Button>
          </CardFooter>
        </Card>
      </Example>

      <PropsTable rows={rows} />
    </>
  );
}
