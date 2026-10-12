import { CodeBlock } from "@/components/code-block";
import { PageHeader } from "@/components/example";
import { Prose } from "@/components/prose";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/docs/theming");

export default function ThemingPage() {
  return (
    <>
      <PageHeader href="/docs/theming" eyebrow="Guide" title="Theming">
        Everything visual is a CSS custom property prefixed <code>--gu-</code>. There is no
        JavaScript theme provider and no runtime styling.
      </PageHeader>

      <Prose>
        <h2 style={{ marginTop: 0 }}>Light and dark</h2>
        <p>
          The library follows the operating system by default. To control it yourself, set{" "}
          <code>data-theme</code> on any ancestor, usually <code>&lt;html&gt;</code>.
        </p>
        <CodeBlock
          lang="tsx"
          filename="html"
          code={`<html data-theme="dark">   {/* always dark */}
<html data-theme="light">  {/* always light */}
<html>                     {/* follow the OS */}`}
        />
        <p>
          It also works on a subtree, so one part of a page can be dark while the rest is light:
        </p>
        <CodeBlock lang="tsx" filename="tsx" code={`<section data-theme="dark">…</section>`} />

        <h2>Change the tokens</h2>
        <p>
          Override any token in your own CSS. Because the library lives in a cascade layer, plain
          unlayered CSS always wins, with no specificity tricks.
        </p>
        <CodeBlock
          lang="css"
          filename="globals.css"
          code={`:root {
  --gu-accent: #7a2e8f;      /* brand colour */
  --gu-accent-ink: #ffffff;  /* text on top of it */
  --gu-radius-sm: 0;         /* square corners everywhere */
}`}
        />
        <div className="note">
          <p>
            When you change a colour, keep its text colour readable. <code>--gu-accent-ink</code>{" "}
            must clear 4.5:1 against <code>--gu-accent</code>. The default palette is checked in
            both modes, yours is not, so test it.
          </p>
        </div>
        <p>
          Set a colour for each mode by overriding it under both selectors, since dark values live
          under <code>data-theme=&quot;dark&quot;</code> and the OS preference:
        </p>
        <CodeBlock
          lang="css"
          filename="globals.css"
          code={`:root,
[data-theme="light"] { --gu-accent: #7a2e8f; }

[data-theme="dark"]   { --gu-accent: #d9a3ec; }

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --gu-accent: #d9a3ec; }
}`}
        />

        <h2>Soften the shadows</h2>
        <p>
          The print shadow is hard and offset. Its colour comes from one token, and its offsets
          from four, so you can keep the idea and change the intensity.
        </p>
        <CodeBlock
          lang="css"
          filename="globals.css"
          code={`:root {
  --gu-shadow-color: var(--gu-ink-muted);
  --gu-shadow-md: 2px 2px 0 var(--gu-shadow-color);
}`}
        />

        <h2>Style one component</h2>
        <p>
          Pass <code>className</code>; it is merged with the component&apos;s own. Components also
          expose their state as data attributes, which is the supported way to hook into variants
          and states from your own CSS:
        </p>
        <CodeBlock
          lang="css"
          filename="globals.css"
          code={`.my-form .gu-button[data-variant="primary"] {
  text-transform: uppercase;
}
.gu-button[data-loading] {
  cursor: progress;
}`}
        />
        <p>
          Class names starting with <code>gu-</code> are stable and safe to target. Internal CSS
          variables that start with <code>--gu-button-</code> and similar are not, use the global
          tokens instead.
        </p>
      </Prose>
    </>
  );
}
