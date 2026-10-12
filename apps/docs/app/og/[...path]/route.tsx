import { findPage, sectionOf } from "@/lib/nav";
import { renderOg } from "@/lib/og";
import { flatNav } from "@/lib/nav";

/** One share image per docs page, e.g. /og/docs/components/dialog. Built statically. */
export function generateStaticParams() {
  return flatNav.map((item) => ({ path: item.href.split("/").filter(Boolean) }));
}

export async function GET(_request: Request, ctx: RouteContext<"/og/[...path]">) {
  const { path } = await ctx.params;
  const href = `/${path.join("/")}`;
  const page = findPage(href);
  if (!page) return new Response("Not found", { status: 404 });

  const section = sectionOf(href);
  return renderOg({
    eyebrow: section === "Components" ? "Component" : section,
    title: page.title,
    description: page.description,
  });
}
