"use client";

import {
  AlertDialog as BaseAlertDialog,
  type AlertDialogDescriptionProps,
  type AlertDialogPopupProps,
  type AlertDialogTitleProps,
} from "@base-ui/react/alert-dialog";
import { cx } from "../../lib/cx";
import "../dialog/dialog.styles.css";

type WithStringClass<P> = Omit<P, "className"> & { className?: string };

/**
 * A dialog that interrupts to ask for a decision, such as a destructive confirmation. Unlike
 * Dialog it is announced as an alert dialog, has no corner "×", and a click on the veil does
 * not dismiss it: the person must choose an action (or press Escape).
 */
export const AlertDialog = BaseAlertDialog.Root;

/** Opens the dialog. Render your own button: `<AlertDialogTrigger render={<Button />}>`. */
export const AlertDialogTrigger = BaseAlertDialog.Trigger;

/** Closes the dialog. Use it for every choice, via `render={<Button />}`. */
export const AlertDialogClose = BaseAlertDialog.Close;

export type AlertDialogContentProps = WithStringClass<AlertDialogPopupProps>;

/** The veil and the panel. Put Header, Title, Description and Footer inside. */
export function AlertDialogContent({ className, children, ...props }: AlertDialogContentProps) {
  return (
    <BaseAlertDialog.Portal>
      <BaseAlertDialog.Backdrop className="gu-dialog__backdrop" />
      <BaseAlertDialog.Viewport className="gu-dialog__viewport">
        <BaseAlertDialog.Popup {...props} className={cx("gu-dialog", className)}>
          {children}
        </BaseAlertDialog.Popup>
      </BaseAlertDialog.Viewport>
    </BaseAlertDialog.Portal>
  );
}

/** Required: it is the dialog's accessible name. */
export function AlertDialogTitle({ className, ...props }: WithStringClass<AlertDialogTitleProps>) {
  return <BaseAlertDialog.Title {...props} className={cx("gu-dialog__title", className)} />;
}

/** Required in practice: say what will happen. It is the dialog's accessible description. */
export function AlertDialogDescription({ className, ...props }: WithStringClass<AlertDialogDescriptionProps>) {
  return <BaseAlertDialog.Description {...props} className={cx("gu-dialog__description", className)} />;
}

export { DialogFooter as AlertDialogFooter, DialogHeader as AlertDialogHeader } from "../dialog/dialog";
