"use client";

import { Tooltip as BaseTooltip, type TooltipRootProps } from "@base-ui/react/tooltip";
import type { ReactElement, ReactNode } from "react";
import "./tooltip.styles.css";

/** Share open/close delay between tooltips, so moving along a toolbar feels instant. */
export const TooltipProvider = BaseTooltip.Provider;

export interface TooltipProps extends Pick<TooltipRootProps, "open" | "defaultOpen" | "onOpenChange" | "disabled"> {
  /** The text shown in the tooltip. Keep it short; it is not announced as the trigger's name. */
  content: ReactNode;
  /** The single element that triggers it, for example a `<Button>`. It must accept a ref and props. */
  children: ReactElement<Record<string, unknown>>;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  /** Milliseconds of hover before it opens. */
  delay?: number;
  closeDelay?: number;
}

/**
 * Tooltips are visual only. For an icon-only trigger, also give it an `aria-label` that
 * matches the tooltip text.
 */
export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  sideOffset = 6,
  delay,
  closeDelay,
  ...root
}: TooltipProps) {
  return (
    <BaseTooltip.Root {...root}>
      <BaseTooltip.Trigger render={children} delay={delay} closeDelay={closeDelay} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} align={align} sideOffset={sideOffset} className="gu-tooltip__positioner">
          <BaseTooltip.Popup className="gu-tooltip">{content}</BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
