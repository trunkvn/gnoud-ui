"use client";

import {
  Popover as BasePopover,
  type PopoverDescriptionProps as BasePopoverDescriptionProps,
  type PopoverPopupProps as BasePopoverPopupProps,
  type PopoverPositionerProps as BasePopoverPositionerProps,
  type PopoverTitleProps as BasePopoverTitleProps,
} from "@base-ui/react/popover";
import { cx } from "../../lib/cx";
import "./popover.styles.css";

type WithStringClass<P> = Omit<P, "className"> & { className?: string };

/** State and behaviour. Renders no element. `open` / `onOpenChange` to control it. */
export const Popover = BasePopover.Root;

/** Opens the popover. Render your own button: `<PopoverTrigger render={<Button />}>Open</PopoverTrigger>`. */
export const PopoverTrigger = BasePopover.Trigger;

/** Closes the popover. Same `render` pattern as the trigger. */
export const PopoverClose = BasePopover.Close;

export interface PopoverContentProps extends WithStringClass<BasePopoverPopupProps> {
  side?: BasePopoverPositionerProps["side"];
  align?: BasePopoverPositionerProps["align"];
  /** Gap in pixels between the trigger and the panel. */
  sideOffset?: number;
}

/** The floating panel, anchored to the trigger. Put a Title, Description and your content inside. */
export function PopoverContent({ className, side = "bottom", align = "center", sideOffset = 8, ...props }: PopoverContentProps) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner side={side} align={align} sideOffset={sideOffset} className="gu-popover__positioner">
        <BasePopover.Popup {...props} className={cx("gu-popover", className)} />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}

/** The panel's accessible name. */
export function PopoverTitle({ className, ...props }: WithStringClass<BasePopoverTitleProps>) {
  return <BasePopover.Title {...props} className={cx("gu-popover__title", className)} />;
}

export function PopoverDescription({ className, ...props }: WithStringClass<BasePopoverDescriptionProps>) {
  return <BasePopover.Description {...props} className={cx("gu-popover__description", className)} />;
}
