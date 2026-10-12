import { expect, test } from "@playwright/test";

test.use({ colorScheme: "light" });

test.describe("Button", () => {
  test("lifts on hover and sinks when pressed, like a stamp", async ({ page }) => {
    await page.goto("/docs/components/button");
    const primary = page.locator('.gu-button[data-variant="primary"]').first();

    await expect(primary).toHaveCSS("box-shadow", /3px 3px 0px 0px/);
    await primary.hover();
    await expect(primary).toHaveCSS("transform", "matrix(1, 0, 0, 1, -2, -2)");
    await expect(primary).toHaveCSS("box-shadow", /5px 5px 0px 0px/);

    await page.mouse.down();
    await expect(primary).toHaveCSS("transform", "matrix(1, 0, 0, 1, 2, 2)");
    await expect(primary).toHaveCSS("box-shadow", /1px 1px 0px 0px/);
    await page.mouse.up();
  });

  test("Tailwind utilities override the gnoud-ui layer", async ({ page }) => {
    await page.goto("/docs/components/button");
    const pill = page.getByRole("button", { name: "Full width, pill" });
    const radius = await pill.evaluate((el) => parseFloat(getComputedStyle(el).borderTopLeftRadius));
    expect(radius).toBeGreaterThan(1000);
    expect((await pill.boundingBox())!.width).toBeGreaterThan(300);
  });
});

test.describe("Tabs", () => {
  test("arrow keys move focus, Enter selects", async ({ page }) => {
    await page.goto("/docs/components/tabs");
    const list = page.getByRole("tablist", { name: "Project sections" });
    await list.getByRole("tab", { name: "Overview" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(list.getByRole("tab", { name: "Activity" })).toBeFocused();
    await expect(list.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Enter");
    await expect(list.getByRole("tab", { name: "Activity" })).toHaveAttribute("aria-selected", "true");
  });
});

test.describe("Switch", () => {
  test("slides its thumb and takes the accent colour when turned on", async ({ page }) => {
    await page.goto("/docs/components/switch");
    const sw = page.getByRole("switch", { name: "Email notifications" });
    await expect(sw).toHaveAttribute("aria-checked", "false");
    await sw.click();
    await expect(sw).toHaveAttribute("aria-checked", "true");
    await expect(sw).toHaveCSS("background-color", "rgb(43, 63, 143)");
    await expect(sw.locator(".gu-switch__thumb")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 20, 0)");
  });
});

test.describe("Tooltip", () => {
  test("opens above the trigger on hover, inked in, and closes on leave", async ({ page }) => {
    await page.goto("/docs/components/tooltip");
    const trigger = page.getByRole("button", { name: "Save", exact: true });
    await trigger.hover();

    const tip = page.locator(".gu-tooltip");
    await expect(tip).toHaveText("Save changes");
    await expect(tip).toBeVisible();
    await expect(tip).toHaveCSS("background-color", "rgb(24, 21, 15)");
    await expect(tip).toHaveCSS("color", "rgb(243, 238, 227)");
    const [tipBox, triggerBox] = [await tip.boundingBox(), await trigger.boundingBox()];
    expect(tipBox!.y + tipBox!.height).toBeLessThanOrEqual(triggerBox!.y + 1);

    await page.mouse.move(2, 2);
    await expect(tip).toBeHidden();
  });

  test("opens on keyboard focus and closes with Escape", async ({ page }) => {
    await page.goto("/docs/components/tooltip");
    await page.getByRole("button", { name: "Save", exact: true }).focus();
    const tip = page.locator(".gu-tooltip");
    await expect(tip).toHaveText("Save changes");
    await page.keyboard.press("Escape");
    await expect(tip).toBeHidden();
  });
});

test.describe("Dialog", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/dialog");
  });

  test("is centred, named by its title, and sits above the sticky header", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Delete project" });
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: "Delete project?" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleDescription(/cannot be undone/);

    const [box, viewport] = [await dialog.boundingBox(), page.viewportSize()!];
    expect(Math.abs(box!.x + box!.width / 2 - viewport.width / 2)).toBeLessThan(4);
    expect(Math.abs(box!.y + box!.height / 2 - viewport.height / 2)).toBeLessThan(4);

    // whatever is at the header's position must be the veil, not the header
    const covered = await page.evaluate(() => {
      const header = document.querySelector("header")!.getBoundingClientRect();
      const hit = document.elementFromPoint(100, header.top + header.height / 2);
      return !!hit?.closest(".gu-dialog__viewport, .gu-dialog__backdrop");
    });
    expect(covered).toBe(true);
  });

  test("traps focus, closes with Escape, and returns focus to the trigger", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Delete project" });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("button", { name: "Cancel" })).toBeFocused();

    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
      // poll: focus briefly passes through Base UI's internal guards before settling
      await expect
        .poll(() => page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]')))
        .toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("closes when the veil is clicked", async ({ page }) => {
    await page.getByRole("button", { name: "Delete project" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.mouse.click(6, 400);
    await expect(page.getByRole("dialog")).toBeHidden();
  });
});

test.describe("Select", () => {
  test("opens below the trigger, selects with the keyboard, and hides the list again", async ({ page }) => {
    await page.goto("/docs/components/select");
    const trigger = page.getByRole("combobox", { name: /Favourite fruit/ });
    await expect(trigger).toHaveText(/Pick a fruit/);

    await trigger.click();
    const list = page.getByRole("listbox");
    await expect(list).toBeVisible();
    await expect(list.getByRole("option")).toHaveCount(4);

    const [t, l] = [await trigger.boundingBox(), await list.boundingBox()];
    expect(l!.y).toBeGreaterThanOrEqual(t!.y + t!.height - 2);
    expect(l!.width).toBeGreaterThanOrEqual(t!.width - 2);

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveText("Apple");
    // Base UI keeps the closed list in the DOM but hidden; what matters is the a11y tree
    await expect(page.getByRole("listbox")).toHaveCount(0);
  });

  test("selecting with the pointer works", async ({ page }) => {
    await page.goto("/docs/components/select");
    const trigger = page.getByRole("combobox", { name: /Favourite fruit/ });
    await trigger.click();
    await page.getByRole("option", { name: "Cherry" }).click();
    await expect(trigger).toHaveText("Cherry");
  });
});
