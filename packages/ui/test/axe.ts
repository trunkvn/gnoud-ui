import axe from "axe-core";

/** Run axe on a rendered container and return the violations (empty when accessible). */
export async function violationsIn(container: Element) {
  const results = await axe.run(container, {
    // jsdom has no layout engine, so colour contrast cannot be computed here.
    // Contrast is verified separately against the token palette.
    rules: {
      "color-contrast": { enabled: false },
      // A page-level rule: portalled content (dialogs, popups) lives outside any landmark in
      // an isolated render, which says nothing about the component itself.
      region: { enabled: false },
    },
  });
  return results.violations;
}
