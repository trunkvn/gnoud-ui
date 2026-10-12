import { expect, test } from "@playwright/test";
import { allPages } from "./pages";

test.use({ colorScheme: "light" });

test.describe("site basics", () => {
  test("unknown URLs get the designed 404 page with a real 404 status", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Nothing printed here." })).toBeVisible();
    await expect(page.getByRole("link", { name: "Read the docs" })).toBeVisible();
  });

  test("old and bare URLs redirect to the right place", async ({ request }) => {
    const bare = await request.get("/docs", { maxRedirects: 0 });
    expect(bare.status()).toBe(307);
    expect(bare.headers().location).toMatch(/\/docs\/getting-started$/);
    const moved = await request.get("/components/button", { maxRedirects: 0 });
    expect(moved.status()).toBe(308);
    expect(moved.headers().location).toMatch(/\/docs\/components\/button$/);
  });

  test("robots.txt points at the sitemap", async ({ request }) => {
    const body = await (await request.get("/robots.txt")).text();
    expect(body).toMatch(/Allow: \//);
    expect(body).toMatch(/Sitemap: https:\/\/.+\/sitemap\.xml/);
  });

  test("sitemap lists every page on the site", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/$/, "") || "/");
    for (const path of allPages) expect(locs, `sitemap is missing ${path}`).toContain(path);
  });
});

test.describe("sharing metadata", () => {
  for (const path of ["/", "/docs/components/dialog"]) {
    test(`${path} has a canonical URL and Open Graph tags`, async ({ page }) => {
      await page.goto(path);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(new URL(canonical!).pathname.replace(/\/$/, "") || "/").toBe(path);
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /gnoud-ui/);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    });
  }

  test("the share image is a 1200x630 PNG", async ({ page, request }) => {
    await page.goto("/");
    const src = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(src).toBeTruthy();
    const image = await request.get(new URL(src!).pathname + new URL(src!).search);
    expect(image.status()).toBe(200);
    expect(image.headers()["content-type"]).toBe("image/png");
    const png = await image.body();
    expect(png.readUInt32BE(16)).toBe(1200); // width in the PNG header
    expect(png.readUInt32BE(20)).toBe(630); // height
  });
});

test.describe("links to GitHub and npm", () => {
  const GITHUB = "https://github.com/trunkvn/gnoud-ui";
  const NPM = "https://www.npmjs.com/package/@gnoud-ui/react?activeTab=readme";

  test("the header (desktop), footer, home and Getting started link out safely", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header");
    await expect(header.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", GITHUB);
    await expect(header.getByRole("link", { name: "npm" })).toHaveAttribute("href", NPM);
    await expect(header.getByRole("link", { name: "npm" })).toHaveAttribute("rel", /noopener/);
    await expect(page.locator("footer").getByRole("link", { name: "npm" })).toHaveAttribute("href", NPM);
    await expect(page.getByRole("main").getByRole("link", { name: "npm" })).toHaveAttribute("href", NPM);

    await page.goto("/docs/getting-started");
    await expect(page.getByRole("main").getByRole("link", { name: "npm" })).toHaveAttribute("href", NPM);
  });

  test("the decorative arrow is not part of the link's accessible name", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header").getByRole("link", { name: "npm", exact: true })).toBeVisible();
  });

  test("below lg the links live in the menu", async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 900 });
    await page.goto("/");
    await expect(page.locator("header").getByRole("link", { name: "npm" })).toBeHidden();
    await page.locator("details.mobile-nav summary").click();
    const menu = page.locator(".mobile-nav__panel");
    await expect(menu.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", GITHUB);
    await expect(menu.getByRole("link", { name: "npm" })).toHaveAttribute("href", NPM);
  });
});

test.describe("header at in-between widths", () => {
  for (const width of [640, 768, 1000, 1024, 1280]) {
    test(`${width}px: nothing overflows and the menu button stays on screen`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/docs/getting-started");
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
      const header = await page.locator("header > div").boundingBox();
      const toggle = await page.getByRole("group", { name: "Colour theme" }).first().boundingBox();
      expect(toggle!.x + toggle!.width).toBeLessThanOrEqual(width);
      expect(header!.width).toBeLessThanOrEqual(width);
    });
  }
});
