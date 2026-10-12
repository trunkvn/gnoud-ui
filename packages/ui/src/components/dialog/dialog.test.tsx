import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { violationsIn } from "../../../test/axe";
import { Button } from "../button/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

function Demo(props: { showClose?: boolean; onOpenChange?: (open: boolean) => void } = {}) {
  return (
    <Dialog onOpenChange={props.onOpenChange}>
      <DialogTrigger render={<Button />}>Open</DialogTrigger>
      <DialogContent showClose={props.showClose}>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>This cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
          <Button variant="primary">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("is closed until the trigger is pressed", async () => {
    render(<Demo />);
    expect(screen.queryByRole("dialog")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("is named by its title and described by its description", async () => {
    render(<Demo />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    const dialog = await screen.findByRole("dialog", { name: "Delete project" });
    expect(dialog).toHaveAccessibleDescription("This cannot be undone.");
    expect(dialog).toHaveClass("gu-dialog");
  });

  it("moves focus into the dialog and returns it to the trigger on close", async () => {
    render(<Demo />);
    const trigger = screen.getByRole("button", { name: "Open" });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole("dialog");
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(trigger).toHaveFocus();
  });

  it("closes with Escape and reports it", async () => {
    const onOpenChange = vi.fn();
    render(<Demo onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    await screen.findByRole("dialog");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it("closes from a DialogClose button", async () => {
    render(<Demo />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    const dialog = await screen.findByRole("dialog");
    await userEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("has a labelled corner close button by default, and it can be removed", async () => {
    const { unmount } = render(<Demo />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    const dialog = await screen.findByRole("dialog");
    await userEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    unmount();

    render(<Demo showClose={false} />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    const again = await screen.findByRole("dialog");
    expect(within(again).queryByRole("button", { name: "Close" })).toBeNull();
  });

  it("works controlled", async () => {
    function Controlled() {
      const [open, setOpen] = useState(true);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogTitle>Controlled</DialogTitle>
            <DialogDescription>Open from state.</DialogDescription>
          </DialogContent>
        </Dialog>
      );
    }
    render(<Controlled />);
    expect(await screen.findByRole("dialog", { name: "Controlled" })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("renders through a portal, outside the app tree", async () => {
    const { container } = render(<Demo />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    const dialog = await screen.findByRole("dialog");
    expect(container.contains(dialog)).toBe(false);
  });

  it("has no axe violations while open", async () => {
    const { baseElement } = render(<Demo />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    await screen.findByRole("dialog");
    expect(await violationsIn(baseElement)).toEqual([]);
  });
});
