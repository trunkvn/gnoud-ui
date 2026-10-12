import type { ComponentPropsWithRef } from "react";
import { cx } from "../../lib/cx";
import "./card.styles.css";

export type CardVariant = "raised" | "flat";

export interface CardProps extends ComponentPropsWithRef<"div"> {
  /** `raised` has the print shadow; `flat` is a quiet hairline box. */
  variant?: CardVariant;
}

export function Card({ variant = "raised", className, ...props }: CardProps) {
  return <div {...props} className={cx("gu-card", className)} data-variant={variant} />;
}

export function CardHeader({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div {...props} className={cx("gu-card__header", className)} />;
}

/** Small uppercase eyebrow above the title, e.g. "02 · Button". */
export function CardLabel({ className, ...props }: ComponentPropsWithRef<"p">) {
  return <p {...props} className={cx("gu-card__label", className)} />;
}

export interface CardTitleProps extends ComponentPropsWithRef<"h3"> {
  /** Pick the level that fits the page outline. */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function CardTitle({ as: Tag = "h3", className, ...props }: CardTitleProps) {
  return <Tag {...props} className={cx("gu-card__title", className)} />;
}

export function CardDescription({ className, ...props }: ComponentPropsWithRef<"p">) {
  return <p {...props} className={cx("gu-card__description", className)} />;
}

export function CardContent({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div {...props} className={cx("gu-card__content", className)} />;
}

export function CardFooter({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div {...props} className={cx("gu-card__footer", className)} />;
}
