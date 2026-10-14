"use client";

import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { Children, cloneElement, isValidElement, type ComponentPropsWithRef, type ReactElement } from "react";
import { cx } from "../../lib/cx";
import "./avatar.styles.css";

export type AvatarSize = "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "square";

export interface AvatarProps extends Omit<ComponentPropsWithRef<"span">, "children"> {
  /** The picture. If it is missing or fails to load, the initials are shown instead. */
  src?: string;
  /**
   * The person's (or thing's) name. It is the avatar's accessible name whether or not the picture
   * loads, and the initials come from it unless you pass `fallback`.
   */
  alt: string;
  /** Initials to show when there is no picture. Derived from `alt` when omitted. */
  fallback?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  /**
   * Hide the avatar from assistive tech, for when the name is already written next to it.
   * Without this, a list of people read as a list of anonymous images.
   */
  decorative?: boolean;
}

/**
 * First letter of the first and last word, upper-cased: "Nguyễn Đại Dương" → "ND",
 * "gnoud" → "G". Works with any script because it takes whole characters, not bytes.
 */
export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  const first = Array.from(words[0])[0] ?? "";
  const last = words.length > 1 ? (Array.from(words[words.length - 1])[0] ?? "") : "";
  return (first + last).toLocaleUpperCase();
}

export function Avatar({
  src,
  alt,
  fallback,
  size = "md",
  shape = "circle",
  decorative = false,
  className,
  ...props
}: AvatarProps) {
  return (
    <BaseAvatar.Root
      {...props}
      // The name lives on the wrapper so it is the same while loading, loaded or failed.
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : alt}
      aria-hidden={decorative ? true : undefined}
      className={cx("gu-avatar", className)}
      data-size={size}
      data-shape={shape}
    >
      {src && <BaseAvatar.Image src={src} alt="" className="gu-avatar__image" />}
      <BaseAvatar.Fallback className="gu-avatar__fallback" aria-hidden="true">
        {fallback ?? initialsOf(alt)}
      </BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}

export interface AvatarGroupProps extends ComponentPropsWithRef<"div"> {
  /** Show at most this many avatars, then one more that says how many are left ("+3"). */
  max?: number;
  /** Default size for every avatar in the group. An avatar's own `size` wins. */
  size?: AvatarSize;
  /** Default shape for every avatar in the group. An avatar's own `shape` wins. */
  shape?: AvatarShape;
}

/**
 * Avatars side by side, overlapping. Give the group an `aria-label` that says who they are.
 * With `max`, the rest are folded into a single "+N" avatar that is named "N more".
 */
export function AvatarGroup({ max, size, shape, className, children, ...props }: AvatarGroupProps) {
  const items = Children.toArray(children).filter((child): child is ReactElement<AvatarProps> => isValidElement(child));
  const limit = max !== undefined && max >= 0 ? Math.floor(max) : items.length;
  const shown = items.slice(0, limit);
  const hidden = items.length - shown.length;

  return (
    <div role="group" {...props} className={cx("gu-avatar-group", className)}>
      {shown.map((item) => cloneElement(item, { size: item.props.size ?? size, shape: item.props.shape ?? shape }))}
      {hidden > 0 && <Avatar alt={`${hidden} more`} fallback={`+${hidden}`} size={size} shape={shape} />}
    </div>
  );
}
