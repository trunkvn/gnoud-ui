import type { ComponentPropsWithRef } from "react";
import { cx } from "../../lib/cx";
import "./textarea.styles.css";

export interface TextareaProps extends ComponentPropsWithRef<"textarea"> {
  /** Marks the value as wrong: red border and `aria-invalid`. Pair it with a visible message. */
  invalid?: boolean;
}

export function Textarea({ invalid = false, className, rows = 4, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      rows={rows}
      className={cx("gu-textarea", className)}
      data-invalid={invalid ? "" : undefined}
      aria-invalid={invalid || undefined}
    />
  );
}
