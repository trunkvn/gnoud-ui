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

test.describe("Avatar", () => {
  test("a loading picture shows; a missing one falls back to initials; each keeps its name", async ({ page }) => {
    await page.goto("/docs/components/avatar");
    const row = section(page, "Picture and initials");

    const ada = row.getByRole("img", { name: "Ada Lovelace" });
    await expect(ada.locator("img")).toBeVisible();
    expect(await ada.locator("img").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);

    await expect(row.getByRole("img", { name: "Nguyễn Đại Dương" })).toContainText("ND");

    const turing = row.getByRole("img", { name: "Alan Turing" });
    await expect(turing).toContainText("AT");
    await expect(turing.locator("img")).toHaveCount(0);
  });

  test("sizes are 2, 2.5, 3.5 and 5rem, and a group overlaps", async ({ page }) => {
    await page.goto("/docs/components/avatar");
    const sizes = section(page, "Sizes and shapes").locator(".gu-avatar");
    for (const [i, px] of [32, 40, 56, 80].entries()) {
      const box = (await sizes.nth(i).boundingBox())!;
      expect(Math.round(box.width), `size ${i}`).toBe(px);
      expect(Math.round(box.height), `size ${i}`).toBe(px);
    }
    await expect(sizes.nth(3)).toHaveCSS("border-top-left-radius", "2px");
    await expect(sizes.nth(0)).toHaveCSS("border-top-left-radius", /^\d{3,}|e\+/);

    const group = page.getByRole("group", { name: "Reviewers" }).locator(".gu-avatar");
    const [a, b] = [(await group.nth(0).boundingBox())!, (await group.nth(1).boundingBox())!];
    expect(b.x).toBeLessThan(a.x + a.width);
  });
});

test.describe("Toast", () => {
  const toasts = (page: import("@playwright/test").Page) => page.locator(".gu-toast");

  test("appears in the bottom-right corner with its title and description", async ({ page }) => {
    await page.goto("/docs/components/toast");
    await page.getByRole("button", { name: "Show a toast" }).click();
    const toast = toasts(page).first();
    await expect(toast.locator(".gu-toast__title")).toHaveText("Saved");
    await expect(toast.locator(".gu-toast__description")).toHaveText("Your changes are live.");

    const [box, view] = [(await toast.boundingBox())!, page.viewportSize()!];
    expect(view.width - (box.x + box.width)).toBeLessThan(40);
    expect(view.height - (box.y + box.height)).toBeLessThan(40);
    expect(box.x).toBeGreaterThan(view.width / 2);
  });

  test("dismisses itself after its timeout, and stays when the timeout is 0", async ({ page }) => {
    await page.goto("/docs/components/toast");
    await page.getByRole("button", { name: "Short timeout (1.5s)" }).click();
    await expect(toasts(page)).toHaveCount(1);
    await expect(toasts(page)).toHaveCount(0, { timeout: 6000 });

    await page.getByRole("button", { name: "Stay until dismissed" }).click();
    await expect(toasts(page)).toHaveCount(1);
    await page.waitForTimeout(2500);
    await expect(toasts(page)).toHaveCount(1);
    await toasts(page).first().locator(".gu-toast__close").click();
    await expect(toasts(page)).toHaveCount(0);
  });

  test("F6 moves keyboard focus into the notifications region", async ({ page }) => {
    await page.goto("/docs/components/toast");
    await page.getByRole("button", { name: "Stay until dismissed" }).click();
    await expect(toasts(page)).toHaveCount(1);
    await page.keyboard.press("F6");
    await expect(page.locator(".gu-toast-viewport")).toBeFocused();
    await expect(page.getByRole("region", { name: "Notifications" })).toHaveCount(1);
  });

  test("the variant colours the rule; danger is announced through an alert", async ({ page }) => {
    await page.goto("/docs/components/toast");
    await page.getByRole("button", { name: "Success", exact: true }).click();
    await expect(toasts(page).first()).toHaveCSS("border-left-color", "rgb(47, 107, 58)");
    await page.getByRole("button", { name: "Danger", exact: true }).click();
    await expect(page.locator('.gu-toast[data-variant="danger"]')).toHaveCSS("border-left-color", "rgb(168, 50, 31)");
    await expect(page.getByRole("alert").filter({ hasText: "Payment failed" })).toHaveCount(1);
  });

  test("an action button runs, and the newest toast sits nearest the corner", async ({ page }) => {
    await page.goto("/docs/components/toast");
    await page.getByRole("button", { name: "Delete a message" }).click();
    await expect(toasts(page)).toHaveCount(1);
    await page.locator(".gu-toast__action").click();
    await expect(page.locator(".gu-toast__title", { hasText: "Restored" })).toBeVisible();

    const rows = await toasts(page).evaluateAll((els) => els.filter((e) => !e.hasAttribute("data-ending-style")).map((e) => ({ title: e.querySelector(".gu-toast__title")!.textContent, bottom: e.getBoundingClientRect().bottom })));
    const restored = rows.find((r) => r.title === "Restored");
    if (rows.length > 1) expect(restored!.bottom).toBeGreaterThanOrEqual(Math.max(...rows.map((r) => r.bottom)) - 1);
  });

  test("has no WCAG 2.2 AA violations while a toast is showing", async ({ page }) => {
    const { default: AxeBuilder } = await import("@axe-core/playwright");
    await page.goto("/docs/components/toast");
    await page.getByRole("button", { name: "Stay until dismissed" }).click();
    await expect(toasts(page)).toHaveCount(1);
    await page.waitForTimeout(500);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.map((v) => ({ rule: v.id, nodes: v.nodes.slice(0, 2).map((n) => n.target.join(" ")) }))).toEqual([]);
  });
});

test.describe("Toast: what the docs promise", () => {
  const toasts = (page: import("@playwright/test").Page) => page.locator(".gu-toast");

  test("a promise toast loads, then becomes success, in place; and a rejection becomes danger", async ({ page }) => {
    await page.goto("/docs/components/toast");
    await page.getByRole("button", { name: "Save (succeeds)" }).click();
    await expect(toasts(page)).toHaveCount(1);
    await expect(toasts(page).first()).toHaveAttribute("data-variant", "loading");
    await expect(toasts(page).first().locator(".gu-toast__title")).toHaveText("Saving draft…");
    // it stays while pending (the demo takes 1.8 seconds), then turns into the same toast's success
    await expect(toasts(page).first().locator(".gu-toast__title")).toHaveText("Saved draft.md", { timeout: 5000 });
    await expect(toasts(page).first()).toHaveAttribute("data-variant", "success");
    await expect(toasts(page)).toHaveCount(1);

    await page.getByRole("button", { name: "Save (fails)" }).click();
    await expect(page.locator('.gu-toast[data-variant="danger"] .gu-toast__description')).toHaveText("The server said no.", { timeout: 5000 });
    await expect(page.getByRole("alert").filter({ hasText: "Could not save" })).toHaveCount(1);
  });

  test("hovering a toast pauses its countdown; leaving restarts it", async ({ page }) => {
    await page.goto("/docs/components/toast");
    await page.getByRole("button", { name: "Short timeout (1.5s)" }).click();
    const toast = toasts(page).first();
    await expect(toast).toBeVisible();
    await toast.hover();
    await page.waitForTimeout(3000); // twice its 1.5s timeout
    await expect(toasts(page)).toHaveCount(1);
    await page.mouse.move(5, 5);
    await expect(toasts(page)).toHaveCount(0, { timeout: 8000 });
  });

  test("swiping a toast to the right dismisses it", async ({ page }) => {
    await page.goto("/docs/components/toast");
    await page.getByRole("button", { name: "Stay until dismissed" }).click();
    const toast = toasts(page).first();
    await expect(toast).toBeVisible();
    const box = (await toast.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    for (let i = 1; i <= 12; i++) await page.mouse.move(box.x + box.width / 2 + i * 20, box.y + box.height / 2);
    await page.mouse.up();
    await expect(toasts(page)).toHaveCount(0, { timeout: 5000 });
  });
});

test.describe("AvatarGroup max", () => {
  test("folds the rest into a '+N' avatar that is named 'N more'", async ({ page }) => {
    await page.goto("/docs/components/avatar");
    const group = page.getByRole("group", { name: "Six reviewers" });
    await expect(group.getByRole("img")).toHaveCount(4);
    await expect(group.getByRole("img", { name: "3 more" })).toContainText("+3");
    await expect(group.getByRole("img", { name: "Linus Torvalds" })).toHaveCount(0);
    expect(Math.round((await group.getByRole("img").first().boundingBox())!.width)).toBe(56);
  });
});

test.describe("Separator", () => {
  test("vertical separators draw a line as tall as their row", async ({ page }) => {
    await page.goto("/docs/components/separator");
    const rule = page.locator('.gu-separator[data-orientation="vertical"]').first();
    const box = (await rule.boundingBox())!;
    expect(box.height).toBeGreaterThan(16);
    await expect(rule).toHaveCSS("border-left-width", "1px");
  });
});

test.describe("Meter", () => {
  test("a meter's fill matches its value", async ({ page }) => {
    await page.goto("/docs/components/meter");
    const meter = page.getByRole("meter", { name: "Storage used" });
    await expect(meter).toHaveAttribute("aria-valuenow", "72");
    const [track, fill] = [await meter.locator(".gu-meter__track").boundingBox(), await meter.locator(".gu-meter__indicator").boundingBox()];
    expect(fill!.width / (track!.width - 3)).toBeCloseTo(0.72, 1);
  });
});

test.describe("Toggle", () => {
  test("pressing a toggle inks it in with the accent colour", async ({ page }) => {
    await page.goto("/docs/components/toggle");
    const italic = page.getByRole("button", { name: "Italic", exact: true }).first();
    await expect(italic).toHaveAttribute("aria-pressed", "false");
    await italic.click();
    await expect(italic).toHaveAttribute("aria-pressed", "true");
    await expect(italic).toHaveCSS("background-color", "rgb(43, 63, 143)");
  });

  test("a single-choice group presses one at a time, and arrow keys move focus through it", async ({ page }) => {
    await page.goto("/docs/components/toggle");
    const group = page.getByRole("group", { name: "Text alignment" });
    await group.getByRole("button", { name: "Right" }).click();
    await expect(group.getByRole("button", { name: "Right" })).toHaveAttribute("aria-pressed", "true");
    await expect(group.getByRole("button", { name: "Left" })).toHaveAttribute("aria-pressed", "false");

    await group.getByRole("button", { name: "Right" }).focus();
    await page.keyboard.press("ArrowLeft");
    await expect(group.getByRole("button", { name: "Center" })).toBeFocused();
  });
});

test.describe("Slider", () => {
  test("the arrow keys move the thumb, and dragging the block moves the fill", async ({ page }) => {
    await page.goto("/docs/components/slider");
    const volume = page.getByRole("slider", { name: "Volume" });
    await volume.focus();
    await page.keyboard.press("ArrowRight");
    await expect(volume).toHaveAttribute("aria-valuenow", "41");

    const control = page.locator(".gu-slider__control").first();
    const [box, thumb] = [(await control.boundingBox())!, (await page.locator(".gu-slider__thumb").first().boundingBox())!];
    await page.mouse.move(thumb.x + thumb.width / 2, thumb.y + thumb.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.9, box.y + box.height / 2, { steps: 6 });
    await page.mouse.up();
    expect(Number(await volume.getAttribute("aria-valuenow"))).toBeGreaterThan(80);
  });

  test("a range has two thumbs with their own names", async ({ page }) => {
    await page.goto("/docs/components/slider");
    await expect(page.getByRole("slider", { name: "Minimum price" })).toHaveAttribute("aria-valuenow", "20");
    await expect(page.getByRole("slider", { name: "Maximum price" })).toHaveAttribute("aria-valuenow", "80");
  });
});

test.describe("Alert dialog", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/alert-dialog");
  });

  test("is an alert dialog that a click on the veil does not dismiss", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Delete account" });
    await trigger.click();
    const dialog = page.getByRole("alertdialog", { name: "Delete your account?" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleDescription(/cannot be undone/);
    await expect(dialog.getByRole("button", { name: "Close" })).toHaveCount(0);

    await page.mouse.click(6, 400);
    await expect(dialog).toBeVisible();
  });

  test("closes with Escape or a choice, and returns focus to the trigger", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Delete account" });
    await trigger.click();
    const dialog = page.getByRole("alertdialog");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();

    await trigger.click();
    await dialog.getByRole("button", { name: "Keep account" }).click();
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});
