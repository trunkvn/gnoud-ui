import { expect, test } from "@playwright/test";
import { flatNav } from "../lib/nav";
import { allPages } from "./pages";

const pick = (html: string, re: RegExp) => html.match(re)?.[1];
const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'");

/** Fetch the raw HTML of every page once, so the checks below are fast. */
async function loadAll(request: import("@playwright/test").APIRequestContext) {
  const out: Record<string, string> = {};
  for (const path of allPages) out[path] = await (await request.get(path)).text();
  return out;
}

test.describe("page metadata", () => {
  test("every page has its own title and description, and a canonical URL for itself", async ({ request }) => {
    const pages = await loadAll(request);
    const titles = new Map<string, string>();
    const descriptions = new Map<string, string>();

    for (const [path, html] of Object.entries(pages)) {
      const title = decode(pick(html, /<title>([^<]*)<\/title>/)!);
      const description = decode(pick(html, /<meta name="description" content="([^"]*)"/)!);
      const canonical = pick(html, /<link rel="canonical" href="([^"]*)"/)!;

      expect(titles.get(title), `${path} repeats the title of ${titles.get(title)}`).toBeUndefined();
      titles.set(title, path);
      expect(descriptions.get(description), `${path} repeats the description of ${descriptions.get(description)}`).toBeUndefined();
      descriptions.set(description, path);

      // search engines cut descriptions at about 160 characters
      expect(description.length, `${path} description length`).toBeGreaterThanOrEqual(60);
      expect(description.length, `${path} description length`).toBeLessThanOrEqual(165);

      expect(new URL(canonical).pathname.replace(/\/$/, "") || "/", `${path} canonical`).toBe(path);
    }
  });

  test("the description in <head> is the one written in lib/nav.ts", async ({ request }) => {
    for (const item of flatNav) {
      const html = await (await request.get(item.href)).text();
      expect(decode(pick(html, /<meta name="description" content="([^"]*)"/)!), item.href).toBe(item.description);
      expect(decode(pick(html, /<meta property="og:description" content="([^"]*)"/)!), `${item.href} og`).toBe(item.description);
    }
  });

  test("every page has a share image of its own, 1200x630, for Open Graph and Twitter", async ({ request }) => {
    const pages = await loadAll(request);
    for (const [path, html] of Object.entries(pages)) {
      const og = pick(html, /<meta property="og:image" content="([^"]*)"/)!;
      const twitter = pick(html, /<meta name="twitter:image" content="([^"]*)"/)!;
      const expected = path === "/" ? "/og" : `/og${path}`;
      expect(new URL(og).pathname, `${path} og:image`).toBe(expected);
      expect(new URL(twitter).pathname, `${path} twitter:image`).toBe(expected);

      const image = await request.get(expected);
      expect(image.status(), `${expected} status`).toBe(200);
      expect(image.headers()["content-type"]).toBe("image/png");
      const png = await image.body();
      expect([png.readUInt32BE(16), png.readUInt32BE(20)], `${expected} size`).toEqual([1200, 630]);
    }
  });

  test("an unknown share-image path is a 404, not a blank image", async ({ request }) => {
    expect((await request.get("/og/docs/not-a-page")).status()).toBe(404);
  });
});

test.describe("site-wide metadata", () => {
  test("theme colour for both light and dark, and the colour scheme", async ({ request }) => {
    const html = await (await request.get("/")).text();
    expect(html).toMatch(/<meta name="theme-color" content="#f3eee3" media="\(prefers-color-scheme: light\)"/);
    expect(html).toMatch(/<meta name="theme-color" content="#14110c" media="\(prefers-color-scheme: dark\)"/);
    expect(html).toMatch(/<meta name="color-scheme" content="light dark"/);
  });

  test("author, keywords and robots directives", async ({ request }) => {
    const html = await (await request.get("/")).text();
    expect(html).toMatch(/<meta name="author" content="gnoud"/);
    expect(html).toMatch(/<meta name="keywords" content="[^"]*react[^"]*component library/);
    expect(html).toMatch(/<meta name="robots" content="index, follow"/);
    expect(html).toMatch(/<meta name="googlebot" content="[^"]*max-image-preview:large/);
  });

  test("the web manifest is valid and its icons resolve", async ({ request }) => {
    const html = await (await request.get("/")).text();
    const href = pick(html, /<link rel="manifest" href="([^"]*)"/)!;
    const manifest = await (await request.get(href)).json();
    expect(manifest).toMatchObject({ name: expect.stringContaining("gnoud-ui"), short_name: "gnoud-ui", start_url: "/" });
    expect(manifest.icons.length).toBeGreaterThan(0);
    for (const icon of manifest.icons) expect((await request.get(icon.src)).status(), icon.src).toBe(200);
  });

  test("the Apple touch icon is a 180x180 PNG", async ({ request }) => {
    const html = await (await request.get("/")).text();
    const href = pick(html, /<link rel="apple-touch-icon" href="([^"]*)"/)!;
    const res = await request.get(href);
    expect(res.headers()["content-type"]).toBe("image/png");
    const png = await res.body();
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([180, 180]);
  });
});

test.describe("structured data (JSON-LD)", () => {
  const graph = (html: string) =>
    [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => JSON.parse(m[1])["@graph"]);

  test("the home page describes the site and the library", async ({ request }) => {
    const nodes = graph(await (await request.get("/")).text());
    const types = nodes.map((n) => n["@type"]);
    expect(types).toEqual(expect.arrayContaining(["WebSite", "SoftwareSourceCode"]));
    const code = nodes.find((n) => n["@type"] === "SoftwareSourceCode");
    expect(code).toMatchObject({ name: "@gnoud-ui/react", license: expect.stringContaining("MIT"), codeRepository: expect.stringContaining("github.com") });
  });

  test("every docs page has valid breadcrumbs and an article whose URL matches its canonical", async ({ request }) => {
    for (const item of flatNav) {
      const html = await (await request.get(item.href)).text();
      const nodes = graph(html);
      const crumbs = nodes.find((n) => n["@type"] === "BreadcrumbList");
      const article = nodes.find((n) => n["@type"] === "TechArticle");
      expect(crumbs.itemListElement.map((c: { position: number }) => c.position), item.href).toEqual([1, 2]);
      expect(article.headline, item.href).toBe(item.title);
      expect(article.description, item.href).toBe(item.description);
      expect(article.url, item.href).toBe(pick(html, /<link rel="canonical" href="([^"]*)"/));
    }
  });
});

test.describe("llms.txt", () => {
  test("lists every page with its URL and description", async ({ request }) => {
    const res = await request.get("/llms.txt");
    expect(res.headers()["content-type"]).toContain("text/plain");
    const body = await res.text();
    expect(body).toMatch(/^# gnoud-ui/);
    for (const item of flatNav) {
      expect(body, item.href).toContain(`(${new URL(item.href, "https://gnoud-ui.vercel.app").href}): ${item.description}`);
    }
    expect(body).toContain("npmjs.com/package/@gnoud-ui/react");
    expect(body).toContain("github.com/trunkvn/gnoud-ui");
  });
});
