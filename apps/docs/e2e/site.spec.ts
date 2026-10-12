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
