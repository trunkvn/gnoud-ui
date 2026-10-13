import type { ComponentPropsWithRef } from "react";
import { cx } from "../../lib/cx";
import "./skeleton.styles.css";

export type SkeletonShape = "block" | "circle";

export interface SkeletonProps extends ComponentPropsWithRef<"div"> {
  /** `circle` is for avatars. Size it with `width` and `height` (or className). */
  shape?: SkeletonShape;
}

/**
 * A placeholder for content that is still loading. It is decorative, so it is hidden from
 * screen readers: mark the container that holds the skeletons with `aria-busy="true"` and
 * announce the load some other way (a status message).
 */
export function Skeleton({ shape = "block", className, ...props }: SkeletonProps) {
  return <div aria-hidden="true" {...props} className={cx("gu-skeleton", className)} data-shape={shape} />;
}
