import { Tabs, TabsList, TabsPanel, TabsTab } from "@gnoud-ui/react";
import { CodeBlock } from "@/components/code-block";
import { PageHeader } from "@/components/example";
import { ExternalLink } from "@/components/external-link";
import { Prose } from "@/components/prose";
import { NPM_URL } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/docs/getting-started");

const managers = [
  ["npm", "npm install @gnoud-ui/react"],
  ["pnpm", "pnpm add @gnoud-ui/react"],
  ["yarn", "yarn add @gnoud-ui/react"],
  ["bun", "bun add @gnoud-ui/react"],
] as const;

export default function GettingStartedPage() {
  return (
    <>
      <PageHeader href="/docs/getting-started" eyebrow="Guide" title="Getting started">
        Install the package, import one stylesheet, and use components. It works with any bundler
        that handles CSS imports, and with Server Components.
      </PageHeader>

      <Prose>
        <h2 style={{ marginTop: 0 }}>Install</h2>
        <p>
          Requires React 19. Base UI is a dependency of the package, so there is nothing else to
          install.
        </p>
        <Tabs defaultValue="npm">
          <TabsList aria-label="Package manager">
            {managers.map(([name]) => (
              <TabsTab key={name} value={name}>
                {name}
              </TabsTab>
            ))}
          </TabsList>
          {managers.map(([name, command]) => (
            <TabsPanel key={name} value={name}>
              <CodeBlock lang="bash" code={command} filename="terminal" />
            </TabsPanel>
          ))}
        </Tabs>

        <p>
          The package page on <ExternalLink href={NPM_URL}>npm</ExternalLink> shows the README, versions and
          provenance exactly as users see them there.
        </p>

        <h2>Import the styles</h2>
        <p>
          Import the stylesheet once, at the root of your app. It carries the design tokens and the
          styles of every component.
        </p>
        <CodeBlock
          filename="app/layout.tsx"
          code={`import "@gnoud-ui/react/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`}
        />

        <h2>Use a component</h2>
        <CodeBlock
          filename="app/page.tsx"
          code={`import { Button, Card, CardHeader, CardTitle } from "@gnoud-ui/react";

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello</CardTitle>
      </CardHeader>
      <Button variant="primary">Continue</Button>
    </Card>
  );
}`}
        />
        <p>
          Components that need interactivity are already marked <code>&quot;use client&quot;</code>,
          so you can import and render them from a Server Component without wrapping them.
        </p>

        <h2>Tailwind CSS v4</h2>
        <p>
          All gnoud-ui styles live in one cascade layer named <code>gnoud-ui</code>. That is what
          lets your Tailwind utilities override a component with{" "}
          <code>className=&quot;w-full&quot;</code> and no <code>!important</code>. Tailwind needs
          to know where that layer sits: above its <code>base</code> reset, below{" "}
          <code>utilities</code>.
        </p>
        <CodeBlock
          lang="css"
          filename="app/globals.css"
          code={`@layer theme, base, gnoud-ui, components, utilities;

@import "tailwindcss";
@import "@gnoud-ui/react/styles.css";`}
        />
        <div className="note">
          <p>
            Declare the layer order <strong>before</strong> the imports. Without it, Tailwind&apos;s
            reset can flatten the components, or the components can win over your utilities.
          </p>
        </div>
        <p>You do not need Tailwind. Plain CSS of your own overrides the library the same way.</p>

        <h2>Fonts</h2>
        <p>
          The library does not load fonts for you. The tokens name three families and fall back to
          system fonts: <strong>Familjen Grotesk</strong> for headings, <strong>Hanken Grotesk</strong>{" "}
          for text and <strong>Geist Mono</strong> for labels. All three cover Vietnamese. With{" "}
          <code>next/font</code>:
        </p>
        <CodeBlock
          filename="app/layout.tsx"
          code={`import { Familjen_Grotesk, Hanken_Grotesk, Geist_Mono } from "next/font/google";

const display = Familjen_Grotesk({ variable: "--font-display", subsets: ["latin", "vietnamese"] });
const body = Hanken_Grotesk({ variable: "--font-body", subsets: ["latin", "vietnamese"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin", "vietnamese"] });

// <html className={\`\${display.variable} \${body.variable} \${mono.variable}\`}>`}
        />
        <p>Then point the tokens at them:</p>
        <CodeBlock
          lang="css"
          filename="app/globals.css"
          code={`:root {
  --gu-font-display: var(--font-display), ui-sans-serif, system-ui, sans-serif;
  --gu-font-body: var(--font-body), ui-sans-serif, system-ui, sans-serif;
  --gu-font-mono: var(--font-mono), ui-monospace, monospace;
}`}
        />
      </Prose>
    </>
  );
}
