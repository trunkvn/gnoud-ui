"use client";

import { Switch as BaseSwitch, type SwitchRootProps } from "@base-ui/react/switch";
import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import "./switch.styles.css";

export interface SwitchProps extends Omit<SwitchRootProps, "className" | "children"> {
  className?: string;
  /**
   * Visible label. When set, the switch is wrapped in a `<label>` so clicking the text
   * toggles it and names it. Without it, give the switch `aria-label`.
   */
  label?: ReactNode;
}

export function Switch({ label, className, ...props }: SwitchProps) {
  const control = (
    <BaseSwitch.Root {...props} className={cx("gu-switch", !label && className)}>
      <BaseSwitch.Thumb className="gu-switch__thumb" />
    </BaseSwitch.Root>
  );

  if (!label) return control;

  return (
    <label className={cx("gu-switch-field", className)}>
      {control}
      <span>{label}</span>
    </label>
  );
}
