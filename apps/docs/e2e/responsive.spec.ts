import { expect, test } from "@playwright/test";
import { allPages } from "./pages";

test.describe("phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: "light" });

  for (const path of allPages) {
    test(`${path} does not scroll sideways`, async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test("the menu opens, navigates, and closes itself", async ({ page }) => {
    await page.goto("/docs/getting-started");
    const menu = page.locator("details.mobile-nav");
    const summary = menu.locator("summary");

    // fully on screen: this is what broke when the theme buttons were in the header
    const box = await summary.boundingBox();
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);

    await summary.click();
    await expect(menu).toHaveAttribute("open", "");
    await menu.getByRole("link", { name: "Theming" }).click();
    await expect(page).toHaveURL(/\/docs\/theming$/);
    await expect(menu).not.toHaveAttribute("open", "");
  });

  test("the theme toggle is reachable inside the menu", async ({ page }) => {
    await page.goto("/docs/getting-started");
    await page.locator("details.mobile-nav summary").click();
    await page.locator(".mobile-nav__panel").getByRole("button", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("a dialog fits the screen", async ({ page }) => {
    await page.goto("/docs/components/dialog");
    await page.getByRole("button", { name: "Invite" }).click();
    const box = await page.getByRole("dialog").boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  });
});
