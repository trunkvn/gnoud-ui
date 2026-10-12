import { Label } from "./example";

const colors = [
  ["bg", "--gu-bg"],
  ["surface", "--gu-surface"],
  ["tint", "--gu-tint"],
  ["ink", "--gu-ink"],
  ["ink-muted", "--gu-ink-muted"],
  ["line", "--gu-line"],
  ["accent", "--gu-accent"],
  ["accent-2", "--gu-accent-2"],
  ["danger", "--gu-danger"],
  ["success", "--gu-success"],
] as const;

const sizes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"] as const;
const shadows = ["sm", "md", "lg", "pressed"] as const;
const radii = ["sm", "md", "lg", "full"] as const;

export function ThemePanel({ theme }: { theme: "light" | "dark" }) {
  return (
    <section
      data-theme={theme}
      className="bg-bg p-8 text-ink"
      style={{ border: "1px solid var(--gu-line)" }}
    >
      <Label>{theme === "light" ? "01 · Light" : "02 · Dark"}</Label>
      <h2
        className="mb-8 font-display text-5xl font-bold"
        style={{ letterSpacing: "var(--gu-tracking-display)", lineHeight: "var(--gu-leading-tight)" }}
      >
        Giấy &amp; Mực
      </h2>

      <Label>Colour</Label>
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {colors.map(([name, token]) => (
          <div key={token}>
            <div
              className="h-14"
              style={{ background: `var(${token})`, border: "1px solid var(--gu-line)", borderRadius: "var(--gu-radius-sm)" }}
            />
            <p className="mt-1 font-mono text-[11px] text-muted">{name}</p>
          </div>
        ))}
      </div>

      <Label>Type scale</Label>
      <div className="mb-8 space-y-1">
        {sizes.map((s) => (
          <p
            key={s}
            className="font-display font-bold"
            style={{ fontSize: `var(--gu-text-${s})`, letterSpacing: "var(--gu-tracking-display)", lineHeight: "var(--gu-leading-snug)" }}
          >
            {s} · Làm tay, phơi nắng
          </p>
        ))}
      </div>

      <Label>Print shadows</Label>
      <div className="mb-8 flex flex-wrap gap-5">
        {shadows.map((s) => (
          <div
            key={s}
            className="flex h-16 w-24 items-center justify-center bg-surface font-mono text-[11px]"
            style={{ border: "var(--gu-border-width) solid var(--gu-border)", borderRadius: "var(--gu-radius-sm)", boxShadow: `var(--gu-shadow-${s})` }}
          >
            {s}
          </div>
        ))}
      </div>

      <Label>Radius</Label>
      <div className="flex flex-wrap gap-5">
        {radii.map((r) => (
          <div
            key={r}
            className="flex h-16 w-24 items-center justify-center bg-tint font-mono text-[11px]"
            style={{ border: "var(--gu-border-width) solid var(--gu-border)", borderRadius: `var(--gu-radius-${r})` }}
          >
            {r}
          </div>
        ))}
      </div>
    </section>
  );
}
