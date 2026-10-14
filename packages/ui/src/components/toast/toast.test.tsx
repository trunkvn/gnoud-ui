import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { violationsIn } from "../../../test/axe";
import { type ToastOptions, ToastProvider, type ToastProviderProps, useToast } from "./toast";

/** A button that shows a toast, and exposes the id and close() to the test. */
function Demo({ options, onId }: { options?: ToastOptions; onId?: (id: string, close: ReturnType<typeof useToast>["close"]) => void }) {
  const toast = useToast();
  return (
    <button
      onClick={() => {
        const id = toast.add({ title: "Saved", description: "Your changes are live.", ...options });
        onId?.(id, toast.close);
      }}
    >
      Add
    </button>
  );
}

const setup = (options?: ToastOptions, provider: Omit<ToastProviderProps, "children"> = {}, onId?: Parameters<typeof Demo>[0]["onId"]) =>
  render(
    <ToastProvider {...provider}>
      <Demo options={options} onId={onId} />
    </ToastProvider>,
  );

const add = () => userEvent.click(screen.getByRole("button", { name: "Add" }));
const root = (title: string) => screen.getByText(title, { selector: ".gu-toast__title" }).closest(".gu-toast")!;

describe("Toast", () => {
  it("shows a toast with its title and description in a named, polite live region", async () => {
    setup();
    await add();
    expect(await screen.findByText("Saved", { selector: ".gu-toast__title" })).toBeInTheDocument();
    expect(screen.getByText("Your changes are live.")).toHaveClass("gu-toast__description");
    const region = screen.getByRole("region", { name: "Notifications" });
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveClass("gu-toast-viewport");
  });

  it("names the region as you ask, and places the stack", async () => {
    setup(undefined, { label: "Alerts", position: "top-left" });
    await add();
    await screen.findByText("Saved", { selector: ".gu-toast__title" });
    expect(screen.getByRole("region", { name: "Alerts" })).toHaveAttribute("data-position", "top-left");
  });

  it("bottom-right is the default position", async () => {
    setup();
    await add();
    await screen.findByText("Saved", { selector: ".gu-toast__title" });
    expect(screen.getByRole("region")).toHaveAttribute("data-position", "bottom-right");
  });

  it("is an info toast unless told otherwise, and reflects the variant", async () => {
    setup();
    await add();
    await screen.findByText("Saved", { selector: ".gu-toast__title" });
    expect(root("Saved")).toHaveAttribute("data-variant", "info");
  });

  it.each(["success", "warning", "danger"] as const)("reflects the %s variant", async (variant) => {
    setup({ variant });
    await add();
    await screen.findByText("Saved", { selector: ".gu-toast__title" });
    expect(root("Saved")).toHaveAttribute("data-variant", variant);
  });

  it("announces a danger toast assertively, through an alert, but an info toast politely", async () => {
    const danger = setup({ variant: "danger" });
    await add();
    await screen.findByText("Saved", { selector: ".gu-toast__title" });
    expect(screen.getByRole("alert")).toHaveTextContent("Saved");
    danger.unmount();

    setup({ variant: "info" });
    await add();
    await screen.findByText("Saved", { selector: ".gu-toast__title" });
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("dismisses from its close button", async () => {
    setup({ timeout: 0 });
    await add();
    await screen.findByText("Saved", { selector: ".gu-toast__title" });
    await userEvent.click(root("Saved").querySelector(".gu-toast__close")!);
    await waitFor(() => expect(screen.queryByText("Saved", { selector: ".gu-toast__title" })).toBeNull());
  });

  it("dismisses itself after its timeout", async () => {
    setup({ timeout: 80 });
    await add();
    await screen.findByText("Saved", { selector: ".gu-toast__title" });
    await waitFor(() => expect(screen.queryByText("Saved", { selector: ".gu-toast__title" })).toBeNull(), { timeout: 2000 });
  });

  it("stays until dismissed when the timeout is 0", async () => {
    setup({ timeout: 0 });
    await add();
    await screen.findByText("Saved", { selector: ".gu-toast__title" });
    await act(() => new Promise((r) => setTimeout(r, 300)));
    expect(screen.getByText("Saved", { selector: ".gu-toast__title" })).toBeInTheDocument();
  });

  it("shows an action button and runs it", async () => {
    const onClick = vi.fn();
    setup({ timeout: 0, action: { label: "Undo", onClick } });
    await add();
    await userEvent.click(await screen.findByText("Undo"));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByText("Undo")).toHaveClass("gu-toast__action");
  });

  it("has no action button when none is given", async () => {
    setup({ timeout: 0 });
    await add();
    await screen.findByText("Saved", { selector: ".gu-toast__title" });
    expect(document.querySelector(".gu-toast__action")).toBeNull();
  });

  it("can be closed from code by id, or all at once", async () => {
    let close!: ReturnType<typeof useToast>["close"];
    let first = "";
    setup({ timeout: 0 }, {}, (id, c) => {
      first ||= id;
      close = c;
    });
    await add();
    await add();
    await waitFor(() => expect(document.querySelectorAll(".gu-toast")).toHaveLength(2));

    act(() => close(first));
    await waitFor(() => expect(document.querySelectorAll(".gu-toast")).toHaveLength(1));

    act(() => close());
    await waitFor(() => expect(document.querySelectorAll(".gu-toast")).toHaveLength(0));
  });

  it("marks older toasts as limited once the limit is exceeded", async () => {
    setup({ timeout: 0 }, { limit: 1 });
    await add();
    await add();
    await waitFor(() => expect(document.querySelectorAll(".gu-toast")).toHaveLength(2));
    expect(document.querySelectorAll(".gu-toast[data-limited]")).toHaveLength(1);
  });

  it("reports onClose", async () => {
    const onClose = vi.fn();
    setup({ timeout: 0, onClose });
    await add();
    await screen.findByText("Saved", { selector: ".gu-toast__title" });
    await userEvent.click(root("Saved").querySelector(".gu-toast__close")!);
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("has no axe violations with a toast showing", async () => {
    const { baseElement } = setup({ timeout: 0, action: { label: "Undo", onClick: () => {} } });
    await add();
    await screen.findByText("Saved", { selector: ".gu-toast__title" });
    expect(await violationsIn(baseElement)).toEqual([]);
  });

  describe("promise", () => {
    function Track({ run }: { run: (promise: ReturnType<typeof useToast>["promise"]) => void }) {
      const toast = useToast();
      return <button onClick={() => run(toast.promise)}>Go</button>;
    }
    const mount = (run: (p: ReturnType<typeof useToast>["promise"]) => void) =>
      render(
        <ToastProvider>
          <Track run={run} />
        </ToastProvider>,
      );
    const title = (text: string) => screen.findByText(text, { selector: ".gu-toast__title" });

    it("shows loading, then turns into the success message when the promise resolves", async () => {
      let resolve!: (v: string) => void;
      const result = vi.fn();
      mount((promise) => {
        promise(new Promise<string>((r) => (resolve = r)), {
          loading: "Saving…",
          success: (value) => ({ title: `Saved ${value}`, description: "All done." }),
          error: "Could not save",
        }).then(result);
      });
      await userEvent.click(screen.getByRole("button", { name: "Go" }));

      expect(await title("Saving…")).toBeInTheDocument();
      expect(root("Saving…")).toHaveAttribute("data-variant", "loading");

      await act(async () => resolve("draft"));
      expect(await title("Saved draft")).toBeInTheDocument();
      expect(root("Saved draft")).toHaveAttribute("data-variant", "success");
      expect(screen.getByText("All done.")).toBeInTheDocument();
      expect(document.querySelectorAll(".gu-toast")).toHaveLength(1); // the same toast, updated in place
      await waitFor(() => expect(result).toHaveBeenCalledWith("draft"));
    });

    it("turns into a danger toast, announced at once, when the promise rejects, and still rejects", async () => {
      let reject!: (e: Error) => void;
      const caught = vi.fn();
      mount((promise) => {
        promise(new Promise<string>((_, r) => (reject = r)), {
          loading: "Saving…",
          success: "Saved",
          error: (error) => ({ title: "Could not save", description: (error as Error).message }),
        }).catch(caught);
      });
      await userEvent.click(screen.getByRole("button", { name: "Go" }));
      await title("Saving…");

      await act(async () => reject(new Error("Disk full")));
      expect(await title("Could not save")).toBeInTheDocument();
      expect(root("Could not save")).toHaveAttribute("data-variant", "danger");
      expect(screen.getByText("Disk full", { selector: ".gu-toast__description" })).toBeInTheDocument();
      expect(screen.getByRole("alert")).toHaveTextContent("Could not save");
      await waitFor(() => expect(caught).toHaveBeenCalledOnce());
    });

    it("keeps the loading toast up for as long as the promise is pending", async () => {
      mount((promise) => void promise(new Promise(() => {}), { loading: "Working…", success: "Done", error: "Failed" }));
      await userEvent.click(screen.getByRole("button", { name: "Go" }));
      await title("Working…");
      await act(() => new Promise((r) => setTimeout(r, 400)));
      expect(screen.getByText("Working…", { selector: ".gu-toast__title" })).toBeInTheDocument();
    });

    it("starts the countdown only once the promise has settled", async () => {
      let resolve!: () => void;
      mount((promise) => void promise(new Promise<void>((r) => (resolve = r)), { loading: "Working…", success: { title: "Done", timeout: 120 }, error: "Failed" }));
      await userEvent.click(screen.getByRole("button", { name: "Go" }));
      await title("Working…");
      await act(() => new Promise((r) => setTimeout(r, 300)));
      expect(screen.getByText("Working…", { selector: ".gu-toast__title" })).toBeInTheDocument();

      await act(async () => resolve());
      await title("Done");
      await waitFor(() => expect(screen.queryByText("Done", { selector: ".gu-toast__title" })).toBeNull(), { timeout: 2000 });
    });

    it("accepts a variant in the options of a stage", async () => {
      mount((promise) => void promise(Promise.resolve(1), { loading: "…", success: { title: "Careful", variant: "warning", timeout: 0 }, error: "x" }));
      await userEvent.click(screen.getByRole("button", { name: "Go" }));
      await title("Careful");
      expect(root("Careful")).toHaveAttribute("data-variant", "warning");
    });
  });
});

