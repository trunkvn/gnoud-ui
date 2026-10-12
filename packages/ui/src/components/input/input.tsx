import type { ComponentPropsWithRef } from "react";
import { cx } from "../../lib/cx";
import "./input.styles.css";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<ComponentPropsWithRef<"input">, "size"> {
  size?: InputSize;
  /** Marks the value as wrong: red border and `aria-invalid`. Pair it with a visible message. */
  invalid?: boolean;
}

export function Input({ size = "md", invalid = false, className, type = "text", ...props }: InputProps) {
  return (
    <input
      {...props}
      type={type}
      className={cx("gu-input", className)}
      data-size={size}
      data-invalid={invalid ? "" : undefined}
      aria-invalid={invalid || undefined}
    />
  );
}
