import type { MetadataRoute } from "next";
import { flatNav } from "@/lib/nav";
import { SITE_URL } from "@/lib/site";

// Built from the same list as the sidebar, so a new page is listed the moment it is in the nav.
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", ...flatNav.map((item) => item.href)].map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
