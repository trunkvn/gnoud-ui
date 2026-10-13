import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { violationsIn } from "../../../test/axe";
import { Button } from "../button/button";
import { Popover, PopoverClose, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "./popover";

function Demo(props: React.ComponentProps<typeof Popover> = {}) {
  return (
    <Popover {...props}>
      <PopoverTrigger render={<Button />}>Settings</PopoverTrigger>
      <PopoverContent>
        <PopoverTitle>Display</PopoverTitle>
        <PopoverDescription>Choose how it looks.</PopoverDescription>
        <PopoverClose render={<Button variant="ghost" />}>Done</PopoverClose>
      </PopoverContent>
    </Popover>
  );
}

describe("Popover", () => {
  it("is closed until the trigger is pressed", async () => {
    render(<Demo />);
    expect(screen.queryByText("Choose how it looks.")).toBeNull();
    const trigger = screen.getByRole("button", { name: "Settings" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    expect(await screen.findByText("Choose how it looks.")).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("is a dialog named by its title", async () => {
    render(<Demo />);
    await userEvent.click(screen.getByRole("button", { name: "Settings" }));
    const popup = await screen.findByRole("dialog", { name: "Display" });
    expect(popup).toHaveAccessibleDescription("Choose how it looks.");
    expect(popup).toHaveClass("gu-popover");
  });

  it("closes with Escape and reports it", async () => {
    const onOpenChange = vi.fn();
    render(<Demo onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Settings" }));
    await screen.findByRole("dialog");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
  });

  it("closes from a PopoverClose button and returns focus to the trigger", async () => {
    render(<Demo />);
    const trigger = screen.getByRole("button", { name: "Settings" });
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("button", { name: "Done" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(trigger).toHaveFocus();
  });

  it("closes when you click outside", async () => {
    render(
      <>
        <Demo />
        <button>outside</button>
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Settings" }));
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: "outside" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("works controlled", async () => {
    function Controlled() {
      const [open, setOpen] = React.useState(true);
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger render={<Button />}>Settings</PopoverTrigger>
          <PopoverContent>
            <PopoverTitle>Open from state</PopoverTitle>
          </PopoverContent>
        </Popover>
      );
    }
    render(<Controlled />);
    expect(await screen.findByRole("dialog", { name: "Open from state" })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("renders through a portal and merges className", async () => {
    const { container } = render(
      <Popover defaultOpen>
        <PopoverTrigger render={<Button />}>Settings</PopoverTrigger>
        <PopoverContent className="mine">
          <PopoverTitle>T</PopoverTitle>
        </PopoverContent>
      </Popover>,
    );
    const popup = await screen.findByRole("dialog");
    expect(container.contains(popup)).toBe(false);
    expect(popup).toHaveClass("gu-popover", "mine");
  });

  it("has no axe violations while open", async () => {
    const { baseElement } = render(<Demo />);
    await userEvent.click(screen.getByRole("button", { name: "Settings" }));
    await screen.findByRole("dialog");
    expect(await violationsIn(baseElement)).toEqual([]);
  });
});
