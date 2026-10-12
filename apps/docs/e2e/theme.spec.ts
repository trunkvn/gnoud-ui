import { expect, test } from "@playwright/test";

const PAPER = "rgb(243, 238, 227)";
const DARK = "rgb(20, 17, 12)";

test.describe("theme", () => {
  test.use({ colorScheme: "light" });

  test("follows the OS by default", async ({ page }) => {
    await page.goto("/docs/getting-started");
    await expect(page.locator("body")).toHaveCSS("background-color", PAPER);
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.*/);
  });

  test("Dark applies, is remembered, and is in place before first paint", async ({ page }) => {
    await page.goto("/docs/getting-started");
    const group = page.getByRole("group", { name: "Colour theme" });
    await group.getByRole("button", { name: "Dark" }).click();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("body")).toHaveCSS("background-color", DARK);
    await expect(group.getByRole("button", { name: "Dark" })).toHaveAttribute("aria-pressed", "true");

    // On reload the attribute must already be set when the DOM is parsed, i.e. no flash.
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        (window as unknown as { __theme: string | undefined }).__theme = document.documentElement.dataset.theme;
      });
    });
    await page.reload();
    expect(await page.evaluate(() => (window as unknown as { __theme?: string }).__theme)).toBe("dark");
  });

  test("Auto returns to following the OS", async ({ page }) => {
    await page.goto("/docs/getting-started");
    const group = page.getByRole("group", { name: "Colour theme" });
    await group.getByRole("button", { name: "Dark" }).click();
    await group.getByRole("button", { name: "Auto" }).click();
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.*/);
    await expect(page.locator("body")).toHaveCSS("background-color", PAPER);
  });

  test("a dark OS gets the dark theme without any choice", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("body")).toHaveCSS("background-color", DARK);
    await context.close();
  });
});
