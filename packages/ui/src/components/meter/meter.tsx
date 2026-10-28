"use client";

import { Meter as BaseMeter, type MeterRootProps } from "@base-ui/react/meter";
import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import "./meter.styles.css";

export interface MeterProps extends Omit<MeterRootProps, "className" | "children"> {
  className?: string;
  /** Visible name for the gauge. Without it, give the meter `aria-label`. */
  label?: ReactNode;
  /** Show the value (as a number by default) beside the label. */
  showValue?: boolean;
}

/**
 * A gauge for a value within a known range, like disk space used. Unlike Progress it is not
 * about work that finishes: the value can sit anywhere in the range and go up or down.
 */
export function Meter({ label, showValue = false, className, ...props }: MeterProps) {
  return (
    <BaseMeter.Root {...props} className={cx("gu-meter", className)}>
      {(label || showValue) && (
        <div className="gu-meter__meta">
          {label && <BaseMeter.Label className="gu-meter__label">{label}</BaseMeter.Label>}
          {showValue && <BaseMeter.Value className="gu-meter__value" />}
        </div>
      )}
      <BaseMeter.Track className="gu-meter__track">
        <BaseMeter.Indicator className="gu-meter__indicator" />
      </BaseMeter.Track>
    </BaseMeter.Root>
  );
}
