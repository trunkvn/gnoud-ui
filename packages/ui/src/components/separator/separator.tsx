"use client";

import { Separator as BaseSeparator, type SeparatorProps as BaseSeparatorProps } from "@base-ui/react/separator";
import { cx } from "../../lib/cx";
import "./separator.styles.css";

export interface SeparatorProps extends Omit<BaseSeparatorProps, "className"> {
  className?: string;
}

/**
 * A rule between groups of content. Exposed to assistive technology as a separator; for a
 * purely decorative line that screen readers should skip, pass `role="presentation"`.
 */
export function Separator({ className, ...props }: SeparatorProps) {
  return <BaseSeparator {...props} className={cx("gu-separator", className)} />;
}
