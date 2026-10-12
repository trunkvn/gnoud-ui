import type { ThemeRegistration } from "shiki";

/**
 * Syntax themes built from the gnoud-ui palette, so code blocks look like part of the
 * system instead of a pasted-in editor theme. Every colour clears 4.5:1 on the code
 * background (--gu-tint) in its own mode.
 */
function theme(
  name: string,
  type: "light" | "dark",
  c: {
    bg: string;
    fg: string;
    comment: string;
    keyword: string;
    string: string;
    number: string;
    fn: string;
    type: string;
    punct: string;
  },
): ThemeRegistration {
  return {
    name,
    type,
    colors: { "editor.background": c.bg, "editor.foreground": c.fg },
    tokenColors: [
      { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: c.comment, fontStyle: "italic" } },
      { scope: ["keyword", "storage", "storage.type", "entity.name.tag", "keyword.control"], settings: { foreground: c.keyword } },
      { scope: ["string", "punctuation.definition.string", "string.quoted"], settings: { foreground: c.string } },
      { scope: ["constant.numeric", "constant.language", "constant.other", "support.constant"], settings: { foreground: c.number } },
      { scope: ["entity.name.function", "support.function", "meta.function-call entity.name.function", "entity.name.command", "support.type.property-name"], settings: { foreground: c.fn } },
      { scope: ["entity.other.attribute-name", "variable.css", "support.type.custom-property"], settings: { foreground: c.fn } },
      { scope: ["entity.name.type", "support.type", "support.class", "support.class.component", "entity.name.tag.css", "entity.other.inherited-class"], settings: { foreground: c.type } },
      { scope: ["punctuation", "meta.brace", "keyword.operator", "punctuation.separator", "punctuation.terminator"], settings: { foreground: c.punct } },
    ],
  };
}

export const codeLight = theme("gnoud-light", "light", {
  bg: "#e9e1cf",
  fg: "#18150f",
  comment: "#625c4f",
  keyword: "#2b3f8f",
  string: "#7a4f00",
  number: "#a8321f",
  fn: "#1f5f78",
  type: "#2f6b3a",
  punct: "#4a4538",
});

export const codeDark = theme("gnoud-dark", "dark", {
  bg: "#2a251b",
  fg: "#f1ebdc",
  comment: "#a59d8a",
  keyword: "#8c9eea",
  string: "#e0a53a",
  number: "#f08a74",
  fn: "#7fcbe0",
  type: "#7fc08a",
  punct: "#c9c1ad",
});
