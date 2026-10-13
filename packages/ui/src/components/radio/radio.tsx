"use client";

import { Radio as BaseRadio, type RadioRootProps } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup, type RadioGroupProps as BaseRadioGroupProps } from "@base-ui/react/radio-group";
import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import "./radio.styles.css";

export type RadioGroupProps<Value = string> = Omit<BaseRadioGroupProps<Value>, "className"> & { className?: string };

/**
 * Holds the selected value for a set of radios. Name the group with `aria-labelledby` (pointing
 * at a visible heading) or `aria-label`: arrow keys move between the radios inside it.
 */
export function RadioGroup<Value = string>({ className, ...props }: RadioGroupProps<Value>) {
  return <BaseRadioGroup {...props} className={cx("gu-radio-group", className)} />;
}

export interface RadioProps<Value = string> extends Omit<RadioRootProps<Value>, "className" | "children"> {
  className?: string;
  /**
   * Visible label. When set, the radio is wrapped in a `<label>` so clicking the text selects
   * it and names it. Without it, give the radio `aria-label`.
   */
  label?: ReactNode;
}

export function Radio<Value = string>({ label, className, ...props }: RadioProps<Value>) {
  const control = (
    <BaseRadio.Root {...props} className={cx("gu-radio", !label && className)}>
      <BaseRadio.Indicator className="gu-radio__dot" />
    </BaseRadio.Root>
  );

  if (!label) return control;

  return (
    <label className={cx("gu-radio-field", className)}>
      {control}
      <span>{label}</span>
    </label>
  );
}
