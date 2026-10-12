import { nav } from "@/lib/nav";
import { AUTHOR, NPM_URL, REPO_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * A plain-text map of the docs for language models and other tools (https://llmstxt.org),
 * built from the same list as the sidebar and the sitemap.
 */
export function GET() {
  const sections = nav.map(
    (section) =>
      `## ${section.title}\n\n` +
      section.items.map((item) => `- [${item.title}](${SITE_URL}${item.href}): ${item.description}`).join("\n"),
  );

  const body = [
    `# ${SITE_NAME}`,
    `> ${SITE_DESCRIPTION}`,
    `\`@gnoud-ui/react\` is a React 19 component library by ${AUTHOR.name}. It ships one stylesheet (design tokens and every component, inside the cascade layer \`gnoud-ui\`) and ESM with types. Install it with \`npm install @gnoud-ui/react\`.`,
    ...sections,
    `## Links\n\n- [npm package](${NPM_URL})\n- [Source on GitHub](${REPO_URL})`,
  ].join("\n\n");

  return new Response(`${body}\n`, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
