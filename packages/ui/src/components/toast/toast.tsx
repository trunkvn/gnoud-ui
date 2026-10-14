"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";
import { isValidElement, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import "./toast.styles.css";

export type ToastVariant = "info" | "success" | "warning" | "danger";
export type ToastPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface ToastOptions {
  title?: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  /** Milliseconds before it goes away by itself. `0` keeps it until dismissed. Default: the provider's. */
  timeout?: number;
  /**
   * `high` is announced to screen readers at once, `low` politely when they are idle.
   * Defaults to `high` for `danger` and `low` otherwise.
   */
  priority?: "low" | "high";
  /** One button on the toast, for example "Undo". */
  action?: { label: string; onClick: () => void };
  /** Passing the id of an existing toast updates it in place instead of adding another. */
  id?: string;
  onClose?: () => void;
}

/** What one stage of a `promise` toast says: plain text, or the usual options. */
export type ToastMessage = ReactNode | Omit<ToastOptions, "id" | "onClose" | "priority">;

export interface ToastPromiseMessages<Value> {
  /** Shown while the promise is pending. It stays until the promise settles. */
  loading: ToastMessage;
  success: ToastMessage | ((value: Value) => ToastMessage);
  error: ToastMessage | ((error: unknown) => ToastMessage);
}

export interface ToastProviderProps {
  children?: ReactNode;
  /** Where the stack sits. */
  position?: ToastPosition;
  /** Most toasts shown at once; older ones are hidden until room frees up. Default 3. */
  limit?: number;
  /** Default milliseconds before a toast dismisses itself. Default 5000. */
  timeout?: number;
  /** The name of the notifications region, for screen readers. */
  label?: string;
  className?: string;
}

/**
 * Put one of these near the root of your app, then call `useToast()` anywhere inside it. It
 * renders the stack of notifications in a landmark that keyboard users reach with F6.
 */
export function ToastProvider({
  children,
  position = "bottom-right",
  limit,
  timeout,
  label = "Notifications",
  className,
}: ToastProviderProps) {
  return (
    <BaseToast.Provider limit={limit} timeout={timeout}>
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport aria-label={label} className={cx("gu-toast-viewport", className)} data-position={position}>
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}

/** Base UI names the outcomes of a promise "success" and "error"; ours are "success" and "danger". */
function variantOf(type: string | undefined): ToastVariant | "loading" {
  if (type === "error") return "danger";
  if (type === "loading" || type === "success" || type === "warning" || type === "danger") return type;
  return "info";
}

function ToastList() {
  const { toasts } = BaseToast.useToastManager();

  return toasts.map((toast) => (
    <BaseToast.Root key={toast.id} toast={toast} className="gu-toast" data-variant={variantOf(toast.type)}>
      <BaseToast.Content className="gu-toast__content">
        <BaseToast.Title className="gu-toast__title" />
        <BaseToast.Description className="gu-toast__description" />
        {toast.actionProps && <BaseToast.Action className="gu-toast__action" />}
        <BaseToast.Close className="gu-toast__close" aria-label="Dismiss">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
          </svg>
        </BaseToast.Close>
      </BaseToast.Content>
    </BaseToast.Root>
  ));
}

function isOptions(message: ToastMessage): message is Exclude<ToastMessage, ReactNode> {
  return typeof message === "object" && message !== null && !isValidElement(message) && !Array.isArray(message);
}

/** Our options → what Base UI wants for one stage of a promise. */
function stage(message: ToastMessage, defaults: { variant?: ToastVariant; priority?: "low" | "high" }) {
  const { title, description, variant, timeout, action } = isOptions(message) ? message : { title: message, description: undefined, variant: undefined, timeout: undefined, action: undefined };
  return {
    title,
    description,
    type: variant ?? defaults.variant,
    timeout,
    priority: defaults.priority,
    actionProps: action ? { children: action.label, onClick: action.onClick } : undefined,
  };
}

/** Show and dismiss toasts. Must be used inside a `ToastProvider`. */
export function useToast() {
  const manager = BaseToast.useToastManager();

  return {
    /** Show a toast. Returns its id. */
    add({ variant = "info", action, priority, ...options }: ToastOptions): string {
      return manager.add({
        ...options,
        type: variant,
        priority: priority ?? (variant === "danger" ? "high" : "low"),
        actionProps: action ? { children: action.label, onClick: action.onClick } : undefined,
      });
    },
    /** Dismiss one toast by id, or all of them with no id. */
    close(id?: string) {
      manager.close(id);
    },
    /**
     * Follow a promise: one toast that says "loading" (and stays), then turns into "success" or
     * "error" (shown as `danger`, and announced at once) when it settles. Resolves or rejects as
     * the promise does. Each stage can carry its own `variant` and `timeout`.
     */
    promise<Value>(promise: Promise<Value>, messages: ToastPromiseMessages<Value>): Promise<Value> {
      // The loading stage has no countdown (Base UI starts none for the "loading" type).
      const id = manager.add({ ...stage(messages.loading, {}), type: "loading" });

      return promise.then(
        (value) => {
          manager.update(id, stage(typeof messages.success === "function" ? messages.success(value) : messages.success, { variant: "success" }));
          return value;
        },
        (error: unknown) => {
          manager.update(id, stage(typeof messages.error === "function" ? messages.error(error) : messages.error, { variant: "danger", priority: "high" }));
          throw error;
        },
      );
    },
    /** The toasts currently on screen. */
    toasts: manager.toasts,
  };
}
