# @gnoud-ui/react

Accessible React components with a paper-and-ink design language: warm paper, ruled borders and
hard offset shadows, in light and dark. Plain CSS, no runtime styling, themeable with CSS
variables. Native elements where they are enough, [Base UI](https://base-ui.com) where behaviour
is hard.

- **25 components:** Accordion, Alert, Alert dialog, Avatar, Badge, Button, Card, Checkbox, Dialog, Input, Menu, Meter, Popover, Progress, Radio, Select, Separator, Skeleton, Slider, Switch, Tabs, Textarea, Toast, Toggle, Tooltip
- **Accessible by default:** keyboard support, focus management, ARIA, and every colour pair checked against WCAG AA in both themes
- **Light and dark:** follows the OS, or force it with `data-theme`
- **Server Components ready:** interactive components are marked `"use client"`
- **No Tailwind required**, but it works well with it
- **Vietnamese-friendly** type tokens: the default fonts cover Vietnamese

**Documentation, live examples and a token reference: [gnoud-ui.vercel.app](https://gnoud-ui.vercel.app)**

Requires React 19.

## Install

```bash
npm install @gnoud-ui/react
```

## Set up

Import the stylesheet once, at the root of your app. It holds the design tokens and every
component's styles.

```tsx
// app/layout.tsx (Next.js) or your entry file
import "@gnoud-ui/react/styles.css";
```

Then use components:

```tsx
import { Button, Card, CardHeader, CardTitle, Input } from "@gnoud-ui/react";

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <label>
        Email
        <Input type="email" />
      </label>
      <Button variant="primary">Continue</Button>
    </Card>
  );
}
```

### Tailwind CSS v4

All styles live in one cascade layer, `gnoud-ui`. That is what lets your utilities override a
component (`<Button className="w-full" />`) without `!important`. Tell Tailwind where the layer
sits: above its `base` reset, below `utilities`. Declare the order **before** the imports:

```css
@layer theme, base, gnoud-ui, components, utilities;

@import "tailwindcss";
@import "@gnoud-ui/react/styles.css";
```

Without this, Tailwind's reset can flatten the components, or the components can win over your
utilities. Plain CSS of your own (outside any layer) always overrides the library.

### Fonts

The library does not load fonts. The tokens name three families and fall back to system fonts:
Familjen Grotesk (headings), Hanken Grotesk (text) and Geist Mono (labels). All three cover
Vietnamese. With `next/font`:

```tsx
import { Familjen_Grotesk, Hanken_Grotesk, Geist_Mono } from "next/font/google";

const display = Familjen_Grotesk({ variable: "--font-display", subsets: ["latin", "vietnamese"] });
const body = Hanken_Grotesk({ variable: "--font-body", subsets: ["latin", "vietnamese"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin", "vietnamese"] });
```

```css
:root {
  --gu-font-display: var(--font-display), ui-sans-serif, system-ui, sans-serif;
  --gu-font-body: var(--font-body), ui-sans-serif, system-ui, sans-serif;
  --gu-font-mono: var(--font-mono), ui-monospace, monospace;
}
```

## Theming

Everything visual is a CSS custom property prefixed `--gu-`.

```css
:root {
  --gu-accent: #7a2e8f;     /* brand colour */
  --gu-accent-ink: #ffffff; /* text on top of it: keep it at 4.5:1 or better */
  --gu-radius-sm: 0;        /* square corners */
}
```

Dark mode follows `prefers-color-scheme`. To control it yourself, set `data-theme` on any
ancestor: `<html data-theme="dark">` or `data-theme="light"`. It also works on a subtree.

Components expose their state as data attributes (`data-variant`, `data-size`, `data-loading`,
`data-disabled`, …) and stable `gu-` class names to hook into from your own CSS.

## Notes

- **Dialogs and popups render in a portal.** If your app root creates its own stacking context,
  add `isolation: isolate` to it. Layers use `--gu-z-overlay` and `--gu-z-popup`.
- **Tooltips are visual only.** They are not announced to screen readers and do not exist on
  touch. Give icon-only triggers an `aria-label`.
- **Browsers:** current evergreen browsers (needs cascade layers and `:has()`).

## License

MIT © gnoud
