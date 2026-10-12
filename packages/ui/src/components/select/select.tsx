"use client";

import {
  Select as BaseSelect,
  type SelectGroupLabelProps,
  type SelectItemProps,
  type SelectLabelProps,
  type SelectTriggerProps,
  type SelectValueProps,
} from "@base-ui/react/select";
import { cx } from "../../lib/cx";
import "./select.styles.css";

type WithStringClass<P> = Omit<P, "className"> & { className?: string };

/**
 * State and behaviour. Renders no element. Pass `items` (`[{ label, value }]`) so the trigger
 * can show the selected label, and `name` to submit it with a form.
 */
export const Select = BaseSelect.Root;

/** Visible name of the field, announced for the trigger. Not a `<label>`; Base UI wires it up. */
export function SelectLabel({ className, ...props }: WithStringClass<SelectLabelProps>) {
  return <BaseSelect.Label {...props} className={cx("gu-select__label", className)} />;
}

/** The button that opens the list. Put a `<SelectValue />` inside. */
export function SelectTrigger({ className, children, ...props }: WithStringClass<SelectTriggerProps>) {
  return (
    <BaseSelect.Trigger {...props} className={cx("gu-select__trigger", className)}>
      {children}
      <BaseSelect.Icon className="gu-select__icon">
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 6l4 4 4-4" />
        </svg>
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
}

/** The selected label, or `placeholder` while nothing is chosen. */
export function SelectValue({ className, ...props }: WithStringClass<SelectValueProps>) {
  return <BaseSelect.Value {...props} className={cx("gu-select__value", className)} />;
}

/** The dropdown. Put `SelectItem`s (optionally in `SelectGroup`s) inside. */
export function SelectContent({ className, children, ...props }: WithStringClass<React.ComponentProps<typeof BaseSelect.Popup>>) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner sideOffset={4} alignItemWithTrigger={false} className="gu-select__positioner">
        <BaseSelect.Popup {...props} className={cx("gu-select__popup", className)}>
          <BaseSelect.List className="gu-select__list">{children}</BaseSelect.List>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

export function SelectItem({ className, children, ...props }: WithStringClass<SelectItemProps>) {
  return (
    <BaseSelect.Item {...props} className={cx("gu-select__item", className)}>
      <BaseSelect.ItemIndicator className="gu-select__item-indicator">
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3.5 8.5l3 3 6-7" />
        </svg>
      </BaseSelect.ItemIndicator>
      <BaseSelect.ItemText className="gu-select__item-text">{children}</BaseSelect.ItemText>
    </BaseSelect.Item>
  );
}

export const SelectGroup = BaseSelect.Group;

export function SelectGroupLabel({ className, ...props }: WithStringClass<SelectGroupLabelProps>) {
  return <BaseSelect.GroupLabel {...props} className={cx("gu-select__group-label", className)} />;
}

export function SelectSeparator({ className, ...props }: WithStringClass<React.ComponentProps<typeof BaseSelect.Separator>>) {
  return <BaseSelect.Separator {...props} className={cx("gu-select__separator", className)} />;
}
