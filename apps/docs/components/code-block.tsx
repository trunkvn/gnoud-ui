import { highlight } from "@/lib/highlight";
import { CopyButton } from "./copy-button";

/** Highlighted at build time on the server: no highlighter ships to the browser. */
export async function CodeBlock({
  code,
  lang = "tsx",
  filename,
}: {
  code: string;
  lang?: "tsx" | "bash" | "css" | "json" | "ts";
  filename?: string;
}) {
  const html = await highlight(code.trim(), lang);

  return (
    <div className="code-block">
      <div className="code-block__bar">
        <span>{filename ?? lang}</span>
        <CopyButton text={code.trim()} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
