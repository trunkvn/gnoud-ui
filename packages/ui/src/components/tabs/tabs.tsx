"use client";

import {
  Tabs as BaseTabs,
  type TabsListProps as BaseTabsListProps,
  type TabsPanelProps as BaseTabsPanelProps,
  type TabsRootProps as BaseTabsRootProps,
  type TabsTabProps as BaseTabsTabProps,
} from "@base-ui/react/tabs";
import { cx } from "../../lib/cx";
import "./tabs.styles.css";

type WithStringClass<P> = Omit<P, "className"> & { className?: string };

export type TabsProps = WithStringClass<BaseTabsRootProps>;
export type TabsListProps = WithStringClass<BaseTabsListProps>;
export type TabsTabProps = WithStringClass<BaseTabsTabProps>;
export type TabsPanelProps = WithStringClass<BaseTabsPanelProps>;

/** Groups the tabs and their panels. Arrow keys move between tabs; Enter or Space selects. */
export function Tabs({ className, ...props }: TabsProps) {
  return <BaseTabs.Root {...props} className={cx("gu-tabs", className)} />;
}

export function TabsList({ className, ...props }: TabsListProps) {
  return <BaseTabs.List {...props} className={cx("gu-tabs__list", className)} />;
}

export function TabsTab({ className, ...props }: TabsTabProps) {
  return <BaseTabs.Tab {...props} className={cx("gu-tabs__tab", className)} />;
}

export function TabsPanel({ className, ...props }: TabsPanelProps) {
  return <BaseTabs.Panel {...props} className={cx("gu-tabs__panel", className)} />;
}
