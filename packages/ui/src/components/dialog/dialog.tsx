"use client";

import {
  Dialog as BaseDialog,
  type DialogDescriptionProps,
  type DialogPopupProps,
  type DialogTitleProps,
} from "@base-ui/react/dialog";
import type { ComponentPropsWithRef } from "react";
import { cx } from "../../lib/cx";
import "./dialog.styles.css";

type WithStringClass<P> = Omit<P, "className"> & { className?: string };

/** State and behaviour. Renders no element. `open` / `onOpenChange` to control it. */
export const Dialog = BaseDialog.Root;

/**
 * Opens the dialog. Render your own button: `<DialogTrigger render={<Button />}>Open</DialogTrigger>`.
 */
export const DialogTrigger = BaseDialog.Trigger;

/** Closes the dialog. Same `render` pattern as the trigger. */
export const DialogClose = BaseDialog.Close;

export interface DialogContentProps extends WithStringClass<DialogPopupProps> {
  /** A corner "×" button. Keep it: touch screen reader users rely on a visible close control. */
  showClose?: boolean;
}

/** The veil and the panel. Put Header, Title, Description and Footer inside. */
export function DialogContent({ className, children, showClose = true, ...props }: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="gu-dialog__backdrop" />
      <BaseDialog.Viewport className="gu-dialog__viewport">
        <BaseDialog.Popup {...props} className={cx("gu-dialog", className)}>
          {children}
          {showClose && (
            <BaseDialog.Close className="gu-dialog__close" aria-label="Close">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
              </svg>
            </BaseDialog.Close>
          )}
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </BaseDialog.Portal>
  );
}

export function DialogHeader({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div {...props} className={cx("gu-dialog__header", className)} />;
}

/** Required: it is the dialog's accessible name. */
export function DialogTitle({ className, ...props }: WithStringClass<DialogTitleProps>) {
  return <BaseDialog.Title {...props} className={cx("gu-dialog__title", className)} />;
}

/** Strongly recommended: it is the dialog's accessible description. */
export function DialogDescription({ className, ...props }: WithStringClass<DialogDescriptionProps>) {
  return <BaseDialog.Description {...props} className={cx("gu-dialog__description", className)} />;
}

export function DialogFooter({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div {...props} className={cx("gu-dialog__footer", className)} />;
}
