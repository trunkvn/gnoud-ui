"use client";

import { Button } from "@gnoud-ui/react";
import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked (insecure context, permissions). Fail quietly: the text is selectable.
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={copy} aria-label={copied ? "Copied" : "Copy code"}>
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}
