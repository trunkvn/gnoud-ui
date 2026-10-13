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

const section = (page: import("@playwright/test").Page, title: string) =>
  page.locator("section", { has: page.getByRole("heading", { name: title, exact: true }) });

test.describe("Radio", () => {
  test("the group is one tab stop and the arrow keys move and select", async ({ page }) => {
    await page.goto("/docs/components/radio");
    const group = page.getByRole("radiogroup", { name: "Plan" });
    await expect(group.getByRole("radio", { name: "Free" })).toBeChecked();

    await group.getByRole("radio", { name: "Free" }).focus();
    await page.keyboard.press("ArrowDown");
    await expect(group.getByRole("radio", { name: "Pro" })).toBeFocused();
    await expect(group.getByRole("radio", { name: "Pro" })).toBeChecked();
    await expect(group.getByRole("radio", { name: "Free" })).not.toBeChecked();
  });

  test("a checked radio takes the accent colour, and a disabled one cannot be chosen", async ({ page }) => {
    await page.goto("/docs/components/radio");
    const plan = page.getByRole("radiogroup", { name: "Plan" });
    await plan.getByText("Team").click();
    await expect(plan.getByRole("radio", { name: "Team" })).toHaveCSS("background-color", "rgb(43, 63, 143)");

    const billing = page.getByRole("radiogroup", { name: "Billing" });
    await billing.getByText("Lifetime (sold out)").click({ force: true });
    await expect(billing.getByRole("radio", { name: "Monthly" })).toBeChecked();
  });
});

test.describe("Accordion", () => {
  test("opens a section with a measured height and closes the other one", async ({ page }) => {
    await page.goto("/docs/components/accordion");
    const accordion = section(page, "One at a time");
    const first = accordion.getByRole("button", { name: "What is gnoud-ui?" });
    const second = accordion.getByRole("button", { name: "Does it need Tailwind?" });

    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(second).toHaveAttribute("aria-expanded", "false");
    const content = (text: string) => accordion.locator(".gu-accordion__content", { hasText: text });
    await expect(content("It ships one stylesheet")).toBeHidden();

    await second.click();
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await expect(first).toHaveAttribute("aria-expanded", "false");
    const body = content("It ships one stylesheet");
    await expect(body).toBeVisible();
    expect((await body.boundingBox())!.height).toBeGreaterThan(10);
  });

  test("with `multiple`, several stay open; the chevron turns", async ({ page }) => {
    await page.goto("/docs/components/accordion");
    const accordion = section(page, "Several open");
    await expect(accordion.getByRole("button", { name: "What is gnoud-ui?" })).toHaveAttribute("aria-expanded", "true");
    await expect(accordion.getByRole("button", { name: "Is dark mode built in?" })).toHaveAttribute("aria-expanded", "true");
    await expect(accordion.locator(".gu-accordion__icon").first()).toHaveCSS("transform", "matrix(-1, 0, 0, -1, 0, 0)");
  });

  test("each header is its own tab stop and Enter toggles it", async ({ page }) => {
    await page.goto("/docs/components/accordion");
    const accordion = section(page, "One at a time");
    const second = accordion.getByRole("button", { name: "Does it need Tailwind?" });
    await accordion.getByRole("button", { name: "What is gnoud-ui?" }).focus();
    await page.keyboard.press("Tab");
    await expect(second).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(second).toHaveAttribute("aria-expanded", "true");
  });
});

test.describe("Popover", () => {
  test("opens below its trigger, names itself, and returns focus on Escape", async ({ page }) => {
    await page.goto("/docs/components/popover");
    const trigger = page.getByRole("button", { name: "Display", exact: true });
    await trigger.click();

    const popup = page.getByRole("dialog", { name: "Display" });
    await expect(popup).toBeVisible();
    const [t, p] = [await trigger.boundingBox(), await popup.boundingBox()];
    expect(p!.y).toBeGreaterThanOrEqual(t!.y + t!.height);

    await page.keyboard.press("Escape");
    await expect(popup).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("closes on an outside click, and Done closes it too", async ({ page }) => {
    await page.goto("/docs/components/popover");
    await page.getByRole("button", { name: "Display", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.mouse.click(4, 300);
    await expect(page.getByRole("dialog")).toBeHidden();

    await page.getByRole("button", { name: "Display", exact: true }).click();
    await page.getByRole("button", { name: "Done" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("placement: the right-hand popover opens to the right of its button", async ({ page }) => {
    await page.goto("/docs/components/popover");
    const trigger = section(page, "Placement").getByRole("button", { name: "right" });
    await trigger.click();
    const [t, p] = [await trigger.boundingBox(), await page.getByRole("dialog", { name: "right" }).boundingBox()];
    expect(p!.x).toBeGreaterThanOrEqual(t!.x + t!.width);
  });
});

test.describe("Menu", () => {
  test("opens below its trigger and inks in the highlighted item", async ({ page }) => {
    await page.goto("/docs/components/menu");
    const trigger = page.getByRole("button", { name: "Actions" });
    await trigger.click();
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    const [t, m] = [await trigger.boundingBox(), await menu.boundingBox()];
    expect(m!.y).toBeGreaterThanOrEqual(t!.y + t!.height);

    await page.keyboard.press("ArrowDown");
    const highlighted = menu.locator('[role="menuitem"][data-highlighted]');
    await expect(highlighted).toHaveCount(1);
    await expect(highlighted).toHaveCSS("background-color", "rgb(24, 21, 15)");
    await expect(highlighted).toHaveCSS("color", "rgb(243, 238, 227)");
  });

  test("Enter on an item closes the menu and returns focus to the trigger", async ({ page }) => {
    await page.goto("/docs/components/menu");
    const trigger = page.getByRole("button", { name: "Actions" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("menu")).toBeVisible();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("menu")).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("a disabled item is announced as disabled, and toggle items keep the menu open", async ({ page }) => {
    await page.goto("/docs/components/menu");
    await page.getByRole("button", { name: "Actions" }).click();
    await expect(page.getByRole("menuitem", { name: "Archive" })).toHaveAttribute("aria-disabled", "true");
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "View" }).click();
    const rulers = page.getByRole("menuitemcheckbox", { name: "Rulers" });
    await expect(rulers).toHaveAttribute("aria-checked", "false");
    await rulers.click();
    await expect(page.getByRole("menu")).toBeVisible();
    await expect(rulers).toHaveAttribute("aria-checked", "true");
    await page.getByRole("menuitemradio", { name: "Dark" }).click();
    await expect(page.getByRole("menuitemradio", { name: "Dark" })).toHaveAttribute("aria-checked", "true");
  });
});

test.describe("Progress", () => {
  test("is a progressbar whose fill matches the value", async ({ page }) => {
    await page.goto("/docs/components/progress");
    const bar = page.getByRole("progressbar", { name: "Uploading" });
    await expect(bar).toHaveAttribute("aria-valuenow", "64");
    const [track, fill] = [await bar.locator(".gu-progress__track").boundingBox(), await bar.locator(".gu-progress__indicator").boundingBox()];
    const ratio = fill!.width / track!.width;
    expect(ratio).toBeGreaterThan(0.58);
    expect(ratio).toBeLessThan(0.68);
  });

  test("indeterminate announces no value and its block actually moves", async ({ page }) => {
    await page.goto("/docs/components/progress");
    const bar = page.getByRole("progressbar", { name: "Preparing" });
    await expect(bar).not.toHaveAttribute("aria-valuenow", /.*/);
    const block = bar.locator(".gu-progress__indicator");
    const x1 = (await block.boundingBox())!.x;
    await page.waitForTimeout(350);
    const x2 = (await block.boundingBox())!.x;
    expect(x2).not.toBe(x1);
  });

  test("with reduced motion the sweep is slower, not stopped", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/docs/components/progress");
    const block = page.getByRole("progressbar", { name: "Preparing" }).locator(".gu-progress__indicator");
    await expect(block).toHaveCSS("animation-duration", "4.2s");
  });
});

test.describe("Skeleton", () => {
  test("is hidden from assistive tech, hatched, and breathing", async ({ page }) => {
    await page.goto("/docs/components/skeleton");
    const skeleton = page.locator(".gu-skeleton").first();
    await expect(skeleton).toHaveAttribute("aria-hidden", "true");
    await expect(skeleton).toHaveCSS("background-image", /repeating-linear-gradient/);
    await expect(skeleton).toHaveCSS("animation-name", "gu-skeleton-breathe");
  });

  test("stops breathing with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/docs/components/skeleton");
    await expect(page.locator(".gu-skeleton").first()).toHaveCSS("animation-name", "none");
  });
});
