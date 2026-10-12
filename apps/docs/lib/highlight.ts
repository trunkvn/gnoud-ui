import { cacheLife } from "next/cache";
import { codeToHtml } from "shiki";
import { codeDark, codeLight } from "./code-theme";

/**
 * Highlighting is a pure function of its inputs, so it is cached forever. That also keeps
 * shiki's internal timing calls out of prerendering, which Cache Components would reject.
 */
export async function highlight(code: string, lang: string): Promise<string> {
  "use cache";
  cacheLife("max");

  return codeToHtml(code, {
    lang,
    themes: { light: codeLight, dark: codeDark },
    defaultColor: false,
  });
}
