"use client";

import {
  cloneElement,
  isValidElement,
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactElement,
} from "react";
import { cx } from "../../lib/cx";
import "./button.styles.css";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ComponentPropsWithRef<"button"> {
  /** Visual weight. `primary` is the single main action on a screen. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * Show a spinner and ignore clicks. The button stays focusable (it is `aria-disabled`,
   * not `disabled`) so keyboard users do not lose their place.
   */
  loading?: boolean;
  /**
   * Render a different element instead of `<button>`, for example a link:
   * `<Button render={<a href="/docs" />}>Docs</Button>`.
   * The element's own props are kept; ours are merged on top.
   */
  render?: ReactElement<Record<string, unknown>>;
}

export function Button({
  variant = "secondary",
  size = "md",
  loading = false,
  disabled = false,
  render,
  className,
  children,
  onClick,
  type,
  ref,
  ...props
}: ButtonProps) {
  const inactive = disabled || loading;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (inactive) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }

  const content = (
    <>
      {loading && <span className="gu-button__spinner" aria-hidden="true" />}
      {children}
    </>
  );

  const shared = {
    ...props,
    className: cx("gu-button", className),
    onClick: handleClick,
    "data-variant": variant,
    "data-size": size,
    "data-disabled": disabled ? "" : undefined,
    "data-loading": loading ? "" : undefined,
    "data-inactive": inactive ? "" : undefined,
    "aria-busy": loading || undefined,
    ...(ref ? { ref } : {}),
  };

  if (render) {
    if (!isValidElement(render)) {
      throw new Error("Button: `render` must be a single React element, e.g. <a href=\"/\" />.");
    }
    // A non-button element has no native `disabled`, so express it through ARIA.
    return cloneElement(
      render,
      {
        ...shared,
        className: cx(shared.className, render.props.className as string | undefined),
        "aria-disabled": inactive || undefined,
      },
      content,
    );
  }

  return (
    <button
      {...shared}
      type={type ?? "button"}
      disabled={disabled}
      // Loading is announced and blocked without removing the button from the tab order.
      aria-disabled={loading && !disabled ? true : undefined}
    >
      {content}
    </button>
  );
}
