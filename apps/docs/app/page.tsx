import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardLabel,
  CardTitle,
  Checkbox,
  Input,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@gnoud-ui/react";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { ExternalLink } from "@/components/external-link";
import { Label } from "@/components/example";
import { JsonLd } from "@/components/json-ld";
import { AUTHOR, NPM_URL, REPO_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const principles = [
  {
    label: "01",
    title: "Stamped, not floated",
    body: "Things you can press are raised with a hard offset shadow and sink into the page when you click. No blur, no glow.",
  },
  {
    label: "02",
    title: "Flat where you write",
    body: "Fields and text sit in the page. Raised is a signal: if it lifts, it does something.",
  },
  {
    label: "03",
    title: "Accessible by default",
    body: "Native elements first, Base UI where behaviour is hard. Every colour pair is checked against WCAG AA in light and dark.",
  },
];

export default function Home() {
  return (
    <main id="main" className="mx-auto max-w-6xl px-5">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebSite", name: SITE_NAME, url: SITE_URL, description: SITE_DESCRIPTION, inLanguage: "en" },
            {
              "@type": "SoftwareSourceCode",
              name: "@gnoud-ui/react",
              description: SITE_DESCRIPTION,
              url: SITE_URL,
              codeRepository: REPO_URL,
              programmingLanguage: "TypeScript",
              runtimePlatform: "React 19",
              license: "https://opensource.org/licenses/MIT",
              author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
              sameAs: [NPM_URL, REPO_URL],
            },
          ],
        }}
      />
      <section className="grid items-center gap-14 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
        <div>
          <Label>React · Paper &amp; ink</Label>
          <h1
            className="font-display text-[clamp(2.75rem,7vw,4.75rem)] font-bold"
            style={{ letterSpacing: "var(--gu-tracking-display)", lineHeight: "var(--gu-leading-tight)" }}
          >
            Interfaces that feel printed.
          </h1>
          <p className="mt-5 max-w-[46ch] text-lg text-muted">
            A small React component library with warm paper, ruled borders and hard shadows.
            Accessible by default, themeable with CSS variables, no runtime styling.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button variant="primary" size="lg" render={<Link href="/docs/getting-started" />}>
              Get started
            </Button>
            <Button size="lg" render={<Link href="/docs/components/button" />}>
              Browse components
            </Button>
          </div>
          <div className="mt-10 max-w-md">
            <CodeBlock lang="bash" code="npm install @gnoud-ui/react" filename="terminal" />
            <p className="mt-3 text-sm text-muted">
              Or see the package as published on{" "}
              <ExternalLink href={NPM_URL} className="underline underline-offset-4">
                npm
              </ExternalLink>
              .
            </p>
          </div>
        </div>

        <div className="grid gap-6" aria-label="Component specimen">
          <Card>
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

          <Tabs defaultValue="light">
            <TabsList aria-label="Specimen sections">
              <TabsTab value="light">Light</TabsTab>
              <TabsTab value="dark">Dark</TabsTab>
              <TabsTab value="print">Print</TabsTab>
            </TabsList>
            <TabsPanel value="light">Warm paper and near-black ink.</TabsPanel>
            <TabsPanel value="dark">The same system, inverted, still AA.</TabsPanel>
            <TabsPanel value="print">Hard shadows, no blur.</TabsPanel>
          </Tabs>
        </div>
      </section>

      <section aria-labelledby="principles" className="pb-8 pt-4" style={{ borderTop: "1px solid var(--gu-line)" }}>
        <h2 id="principles" className="sr-only">
          Principles
        </h2>
        <div className="grid gap-10 pt-12 md:grid-cols-3">
          {principles.map((p) => (
            <div key={p.label}>
              <Label>{p.label}</Label>
              <h3 className="font-display text-2xl font-bold tracking-tight">{p.title}</h3>
              <p className="mt-2 text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
