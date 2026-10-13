import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { allPages } from "./pages";

// A real browser can compute colour contrast, which the jsdom unit tests cannot.
for (const scheme of ["light", "dark"] as const) {
  test.describe(`axe, ${scheme} theme`, () => {
    test.use({ colorScheme: scheme });

    for (const path of allPages) {
      test(`${path} has no WCAG A/AA violations`, async ({ page }) => {
        await page.goto(path);
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();
        const summary = results.violations.map((v) => ({
          rule: v.id,
          impact: v.impact,
          nodes: v.nodes.slice(0, 3).map((n) => n.target.join(" ") + " :: " + (n.failureSummary ?? "").split("\n")[1]),
        }));
        expect(summary).toEqual([]);
      });
    }
  });
}
