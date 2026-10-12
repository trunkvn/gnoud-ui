import { PageHeader } from "@/components/example";
import { ThemePanel } from "@/components/theme-panel";
import { readTokens } from "@/lib/tokens";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/docs/tokens");

export default function TokensPage() {
  const groups = readTokens();

  return (
    <>
      <PageHeader href="/docs/tokens" eyebrow="Guide" title="Design tokens">
        The raw material of the system, rendered from the same stylesheet you install. The
        reference below is generated from the library&apos;s <span className="font-mono">tokens.css</span>{" "}
        at build time, so it cannot drift.
      </PageHeader>

      <div className="space-y-6">
        <ThemePanel theme="light" />
        <ThemePanel theme="dark" />
      </div>

      <div className="mt-16 space-y-12">
        {groups.map((group) => (
          <section key={group.title}>
            <h2 className="mb-4 font-display text-2xl font-bold tracking-tight">{group.title}</h2>
            <div className="overflow-x-auto" style={{ border: "1px solid var(--gu-line)" }}>
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-tint font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                  <tr>
                    <th className="p-3">Token</th>
                    <th className="p-3">{group.rows.some((r) => r.dark) ? "Light" : "Value"}</th>
                    {group.rows.some((r) => r.dark) && <th className="p-3">Dark</th>}
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map((row) => (
                    <tr key={row.name} style={{ borderTop: "1px solid var(--gu-line)" }}>
                      <td className="p-3 font-mono text-[13px]">{row.name}</td>
                      <td className="p-3 font-mono text-[13px] text-muted">{row.light}</td>
                      {group.rows.some((r) => r.dark) && (
                        <td className="p-3 font-mono text-[13px] text-muted">{row.dark ?? "same"}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
