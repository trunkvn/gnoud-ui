import type { ComponentPropsWithRef } from "react";
import { cx } from "../../lib/cx";
import "./alert.styles.css";

export type AlertVariant = "info" | "success" | "warning" | "danger";

export interface AlertProps extends ComponentPropsWithRef<"div"> {
  variant?: AlertVariant;
}

/**
 * An inline message. `danger` is announced assertively (`role="alert"`), the others politely
 * (`role="status"`). Live-region roles only announce when the alert is inserted or changed
 * after the page loads; override `role` (or pass `role={undefined}`) for static notices.
 */
export function Alert({ variant = "info", className, role, ...props }: AlertProps) {
  return (
    <div
      role={role ?? (variant === "danger" ? "alert" : "status")}
      {...props}
      className={cx("gu-alert", className)}
      data-variant={variant}
    />
  );
}

export function AlertTitle({ className, ...props }: ComponentPropsWithRef<"p">) {
  return <p {...props} className={cx("gu-alert__title", className)} />;
}

export function AlertDescription({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div {...props} className={cx("gu-alert__description", className)} />;
}
