"use client";

import {
  Menu as BaseMenu,
  type MenuCheckboxItemProps as BaseMenuCheckboxItemProps,
  type MenuGroupLabelProps as BaseMenuGroupLabelProps,
  type MenuItemProps as BaseMenuItemProps,
  type MenuLinkItemProps as BaseMenuLinkItemProps,
  type MenuPopupProps as BaseMenuPopupProps,
  type MenuPositionerProps as BaseMenuPositionerProps,
  type MenuRadioItemProps as BaseMenuRadioItemProps,
} from "@base-ui/react/menu";
import { cx } from "../../lib/cx";
import "./menu.styles.css";

type WithStringClass<P> = Omit<P, "className"> & { className?: string };

/** State and behaviour. Renders no element. `open` / `onOpenChange` to control it. */
export const Menu = BaseMenu.Root;

/** The button that opens the menu: `<MenuTrigger render={<Button />}>Actions</MenuTrigger>`. */
export const MenuTrigger = BaseMenu.Trigger;

export const MenuGroup = BaseMenu.Group;
export const MenuRadioGroup = BaseMenu.RadioGroup;

export interface MenuContentProps extends WithStringClass<BaseMenuPopupProps> {
  side?: BaseMenuPositionerProps["side"];
  align?: BaseMenuPositionerProps["align"];
  sideOffset?: number;
}

/** The list of actions. Arrow keys move, typing jumps, Enter chooses, Escape closes. */
export function MenuContent({ className, side = "bottom", align = "start", sideOffset = 4, ...props }: MenuContentProps) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner side={side} align={align} sideOffset={sideOffset} className="gu-menu__positioner">
        <BaseMenu.Popup {...props} className={cx("gu-menu", className)} />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

/** An action. Use `onClick`. Pass `label` if the children are not plain text, so typeahead works. */
export function MenuItem({ className, ...props }: WithStringClass<BaseMenuItemProps>) {
  return <BaseMenu.Item {...props} className={cx("gu-menu__item", className)} />;
}

/** An item that navigates: renders an `<a>`. */
export function MenuLinkItem({ className, ...props }: WithStringClass<BaseMenuLinkItemProps>) {
  return <BaseMenu.LinkItem {...props} className={cx("gu-menu__item", className)} />;
}

const Check = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" />
  </svg>
);

/** A toggle item. `checked` / `defaultChecked` / `onCheckedChange`. */
export function MenuCheckboxItem({ className, children, ...props }: WithStringClass<BaseMenuCheckboxItemProps>) {
  return (
    <BaseMenu.CheckboxItem {...props} className={cx("gu-menu__item", className)}>
      <BaseMenu.CheckboxItemIndicator className="gu-menu__indicator">
        <Check />
      </BaseMenu.CheckboxItemIndicator>
      <span className="gu-menu__text">{children}</span>
    </BaseMenu.CheckboxItem>
  );
}

/** One choice from a `MenuRadioGroup`. */
export function MenuRadioItem({ className, children, ...props }: WithStringClass<BaseMenuRadioItemProps>) {
  return (
    <BaseMenu.RadioItem {...props} className={cx("gu-menu__item", className)}>
      <BaseMenu.RadioItemIndicator className="gu-menu__indicator">
        <span className="gu-menu__dot" />
      </BaseMenu.RadioItemIndicator>
      <span className="gu-menu__text">{children}</span>
    </BaseMenu.RadioItem>
  );
}

export function MenuGroupLabel({ className, ...props }: WithStringClass<BaseMenuGroupLabelProps>) {
  return <BaseMenu.GroupLabel {...props} className={cx("gu-menu__group-label", className)} />;
}

export function MenuSeparator({ className, ...props }: WithStringClass<React.ComponentProps<typeof BaseMenu.Separator>>) {
  return <BaseMenu.Separator {...props} className={cx("gu-menu__separator", className)} />;
}
