import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface TokenRow {
  name: string;
  light: string;
  /** Only set for tokens that change in dark mode. */
  dark?: string;
}

export interface TokenGroup {
  title: string;
  rows: TokenRow[];
}

/** Returns the body of the first `{ ... }` block whose selector matches, honouring nesting. */
function block(css: string, selector: RegExp): string {
  const match = selector.exec(css);
  if (!match) throw new Error(`tokens.css: no block matches ${selector}`);
  const open = css.indexOf("{", match.index);
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}" && --depth === 0) return css.slice(open + 1, i);
  }
  throw new Error(`tokens.css: unbalanced braces after ${selector}`);
}

function declarations(body: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const m of body.matchAll(/(--gu-[\w-]+)\s*:\s*([^;]+);/g)) map.set(m[1], m[2].trim().replace(/\s+/g, " "));
  return map;
}

const groups: [string, RegExp][] = [
  ["Colour", /^--gu-(bg|surface|tint|ink|ink-muted|line|border|accent|accent-ink|accent-2|accent-2-ink|danger|success|scrim|focus-ring)$/],
  ["Typography", /^--gu-(font|text|leading|weight|tracking)-/],
  ["Space", /^--gu-space-/],
  ["Shape", /^--gu-(radius|border-width|line-width)/],
  ["Shadow", /^--gu-shadow-/],
  ["Layers", /^--gu-z-/],
  ["Motion", /^--gu-(duration|ease|focus-width|focus-offset)/],
];

/**
 * Reads the real tokens.css at build time so the reference can never drift from the library.
 * Colour tokens carry both their light and dark values.
 */
export function readTokens(): TokenGroup[] {
  const css = readFileSync(join(process.cwd(), "../../packages/ui/src/styles/tokens.css"), "utf8");

  const light = declarations(block(css, /:root,\s*\[data-theme="light"\]\s*{/));
  const dark = declarations(block(css, /\[data-theme="dark"\]\s*{/));
  const derived = declarations(block(css, /:root,\s*\[data-theme\]\s*{/));
  const constant = declarations(block(css, /\n:root\s*{/));

  const all = new Map<string, TokenRow>();
  for (const [name, value] of light) all.set(name, { name, light: value, dark: dark.get(name) });
  for (const [name, value] of [...derived, ...constant]) all.set(name, { name, light: value });

  return groups.map(([title, pattern]) => ({
    title,
    rows: [...all.values()].filter((row) => pattern.test(row.name)),
  }));
}
