"use client";

import {
  Accordion as BaseAccordion,
  type AccordionItemProps as BaseAccordionItemProps,
  type AccordionPanelProps as BaseAccordionPanelProps,
  type AccordionRootProps as BaseAccordionRootProps,
  type AccordionTriggerProps as BaseAccordionTriggerProps,
} from "@base-ui/react/accordion";
import { cx } from "../../lib/cx";
import "./accordion.styles.css";

type WithStringClass<P> = Omit<P, "className"> & { className?: string };

export type AccordionProps = WithStringClass<BaseAccordionRootProps>;
export type AccordionItemProps = WithStringClass<BaseAccordionItemProps>;
export type AccordionTriggerProps = WithStringClass<BaseAccordionTriggerProps>;
export type AccordionPanelProps = WithStringClass<BaseAccordionPanelProps>;

/** A stack of sections that open and close. One at a time by default; `multiple` allows several. */
export function Accordion({ className, ...props }: AccordionProps) {
  return <BaseAccordion.Root {...props} className={cx("gu-accordion", className)} />;
}

export function AccordionItem({ className, ...props }: AccordionItemProps) {
  return <BaseAccordion.Item {...props} className={cx("gu-accordion__item", className)} />;
}

/** The heading button. It sits inside an `<h3>` so the section titles show up in the page outline. */
export function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
  return (
    <BaseAccordion.Header className="gu-accordion__header">
      <BaseAccordion.Trigger {...props} className={cx("gu-accordion__trigger", className)}>
        <span>{children}</span>
        <svg className="gu-accordion__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 6l4 4 4-4" />
        </svg>
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  );
}

export function AccordionPanel({ className, children, ...props }: AccordionPanelProps) {
  return (
    <BaseAccordion.Panel {...props} className={cx("gu-accordion__panel", className)}>
      <div className="gu-accordion__content">{children}</div>
    </BaseAccordion.Panel>
  );
}
