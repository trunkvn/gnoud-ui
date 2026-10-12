import { flatNav } from "../lib/nav";

/** Every page on the site: the home page plus everything in the sidebar. */
export const allPages = ["/", ...flatNav.map((item) => item.href)];
