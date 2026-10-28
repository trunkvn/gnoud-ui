"use client";

import { Slider as BaseSlider, type SliderRootProps } from "@base-ui/react/slider";
import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import "./slider.styles.css";

export interface SliderProps<Value extends number | readonly number[] = number> extends Omit<SliderRootProps<Value>, "className" | "children"> {
  className?: string;
  /** Visible name. Without it, give the slider `aria-label` (or `thumbLabels` for a range). */
  label?: ReactNode;
  /** Show the current value beside the label. */
  showValue?: boolean;
  /** One accessible name per thumb. Needed for a range, where each thumb must be told apart. */
  thumbLabels?: readonly string[];
}

/**
 * Pick a number, or a range, by dragging a thumb or with the arrow keys. Pass a number for one
 * thumb, or an array such as `[20, 80]` for two (or more).
 */
export function Slider<Value extends number | readonly number[] = number>({
  label,
  showValue = false,
  thumbLabels,
  className,
  ...props
}: SliderProps<Value>) {
  const current = props.value ?? props.defaultValue;
  const thumbs = Array.isArray(current) ? current.length : 1;

  return (
    <BaseSlider.Root {...props} className={cx("gu-slider", className)}>
      {(label || showValue) && (
        <div className="gu-slider__meta">
          {label && <BaseSlider.Label className="gu-slider__label">{label}</BaseSlider.Label>}
          {showValue && <BaseSlider.Value className="gu-slider__value" />}
        </div>
      )}
      <BaseSlider.Control className="gu-slider__control">
        <BaseSlider.Track className="gu-slider__track">
          <BaseSlider.Indicator className="gu-slider__indicator" />
          {Array.from({ length: thumbs }, (_, index) => (
            <BaseSlider.Thumb
              key={index}
              index={thumbs > 1 ? index : undefined}
              aria-label={thumbLabels?.[index]}
              className="gu-slider__thumb"
            />
          ))}
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
