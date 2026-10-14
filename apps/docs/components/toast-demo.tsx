"use client";

import { Button, useToast } from "@gnoud-ui/react";

/** Buttons that raise toasts, for the docs. Needs a ToastProvider above it (the docs layout has one). */
export function ToastDemo({ kind }: { kind: "basics" | "variants" | "action" | "persistent" | "quick" | "promise" }) {
  const toast = useToast();

  if (kind === "basics")
    return (
      <Button onClick={() => toast.add({ title: "Saved", description: "Your changes are live." })}>Show a toast</Button>
    );

  if (kind === "variants")
    return (
      <>
        <Button onClick={() => toast.add({ variant: "info", title: "Heads up", description: "Your trial ends in 3 days." })}>Info</Button>
        <Button onClick={() => toast.add({ variant: "success", title: "Uploaded", description: "report.pdf is ready." })}>Success</Button>
        <Button onClick={() => toast.add({ variant: "warning", title: "Almost full", description: "92% of storage used." })}>Warning</Button>
        <Button variant="primary" onClick={() => toast.add({ variant: "danger", title: "Payment failed", description: "Your card was declined." })}>
          Danger
        </Button>
      </>
    );

  if (kind === "action")
    return (
      <Button
        onClick={() =>
          toast.add({
            title: "Message deleted",
            description: "It is gone from your inbox.",
            timeout: 8000,
            action: { label: "Undo", onClick: () => toast.add({ variant: "success", title: "Restored" }) },
          })
        }
      >
        Delete a message
      </Button>
    );

  if (kind === "persistent")
    return (
      <Button onClick={() => toast.add({ variant: "warning", title: "Connection lost", description: "Reconnecting…", timeout: 0 })}>
        Stay until dismissed
      </Button>
    );

  if (kind === "promise") {
    const save = (succeed: boolean) =>
      toast
        .promise(
          new Promise<string>((resolve, reject) => setTimeout(() => (succeed ? resolve("draft.md") : reject(new Error("The server said no."))), 1800)),
          {
            loading: "Saving draft…",
            success: (name) => ({ title: `Saved ${name}`, description: "Your draft is safe." }),
            error: (error) => ({ title: "Could not save", description: (error as Error).message }),
          },
        )
        .catch(() => {}); // the toast already told the person; do not also leave an unhandled rejection
    return (
      <>
        <Button onClick={() => save(true)}>Save (succeeds)</Button>
        <Button onClick={() => save(false)}>Save (fails)</Button>
      </>
    );
  }

  return <Button onClick={() => toast.add({ title: "Quick one", description: "Gone in a moment.", timeout: 1500 })}>Short timeout (1.5s)</Button>;
}
