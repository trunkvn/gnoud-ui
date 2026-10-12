"use client";

import { Checkbox as BaseCheckbox, type CheckboxRootProps } from "@base-ui/react/checkbox";
import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import "./checkbox.styles.css";

export interface CheckboxProps extends Omit<CheckboxRootProps, "className" | "children"> {
  className?: string;
  /**
   * Visible label. When set, the box is wrapped in a `<label>` so clicking the text toggles
   * it and the accessible name is wired up for you. Without it, give the box `aria-label`.
   */
  label?: ReactNode;
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  const box = (
    <BaseCheckbox.Root {...props} className={cx("gu-checkbox", !label && className)}>
      <BaseCheckbox.Indicator className="gu-checkbox__indicator">
        <svg className="gu-checkbox__check" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3.5 8.5l3 3 6-7" />
        </svg>
        <svg className="gu-checkbox__dash" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 8h8" />
        </svg>
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );

  if (!label) return box;

  return (
    <label className={cx("gu-checkbox-field", className)}>
      {box}
      <span>{label}</span>
    </label>
  );
}
