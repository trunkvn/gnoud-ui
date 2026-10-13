"use client";

import { Progress as BaseProgress, type ProgressRootProps } from "@base-ui/react/progress";
import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import "./progress.styles.css";

export interface ProgressProps extends Omit<ProgressRootProps, "className" | "children"> {
  className?: string;
  /** Visible name for the bar. Without it, give the bar `aria-label`. */
  label?: ReactNode;
  /** Show the value (as a percentage by default) beside the label. */
  showValue?: boolean;
}

/**
 * A bar for work that has a measurable end. `value={null}` means "working, but unknown how
 * long": it shows a moving block instead of a fill.
 */
export function Progress({ label, showValue = false, className, ...props }: ProgressProps) {
  return (
    <BaseProgress.Root {...props} className={cx("gu-progress", className)}>
      {(label || showValue) && (
        <div className="gu-progress__meta">
          {label && <BaseProgress.Label className="gu-progress__label">{label}</BaseProgress.Label>}
          {showValue && <BaseProgress.Value className="gu-progress__value" />}
        </div>
      )}
      <BaseProgress.Track className="gu-progress__track">
        <BaseProgress.Indicator className="gu-progress__indicator" />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}
