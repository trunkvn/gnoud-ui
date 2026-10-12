import type { ComponentPropsWithRef } from "react";
import { cx } from "../../lib/cx";
import "./badge.styles.css";

export type BadgeVariant = "neutral" | "accent" | "highlight" | "success" | "danger";

export interface BadgeProps extends ComponentPropsWithRef<"span"> {
  variant?: BadgeVariant;
}

export function Badge({ variant = "neutral", className, ...props }: BadgeProps) {
  return <span {...props} className={cx("gu-badge", className)} data-variant={variant} />;
}
