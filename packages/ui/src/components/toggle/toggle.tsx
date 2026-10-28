"use client";

import { Toggle as BaseToggle, type ToggleProps as BaseToggleProps } from "@base-ui/react/toggle";
import { ToggleGroup as BaseToggleGroup, type ToggleGroupProps as BaseToggleGroupProps } from "@base-ui/react/toggle-group";
import { cx } from "../../lib/cx";
import "./toggle.styles.css";

export type ToggleSize = "sm" | "md" | "lg";

export interface ToggleProps<Value extends string = string> extends Omit<BaseToggleProps<Value>, "className"> {
  className?: string;
  size?: ToggleSize;
}

/**
 * A button that stays pressed: bold, italic, "show grid". Exposed with `aria-pressed`. Give
 * an icon-only toggle an `aria-label`. Inside a `ToggleGroup`, give it a `value`.
 */
export function Toggle<Value extends string = string>({ size = "md", className, ...props }: ToggleProps<Value>) {
  return <BaseToggle {...props} data-size={size} className={cx("gu-toggle", className)} />;
}

export interface ToggleGroupProps<Value extends string = string> extends Omit<BaseToggleGroupProps<Value>, "className"> {
  className?: string;
}

/**
 * Toggles that belong together, drawn as one strip. One can be pressed at a time by default;
 * pass `multiple` for several. Arrow keys move between them. Name the group with `aria-label`.
 */
export function ToggleGroup<Value extends string = string>({ className, ...props }: ToggleGroupProps<Value>) {
  return <BaseToggleGroup {...props} className={cx("gu-toggle-group", className)} />;
}
