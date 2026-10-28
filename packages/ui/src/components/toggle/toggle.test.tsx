import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { violationsIn } from "../../../test/axe";
import { Toggle, ToggleGroup } from "./toggle";

describe("Toggle", () => {
  it("is a button that reports whether it is pressed", async () => {
    const onPressedChange = vi.fn();
    render(<Toggle onPressedChange={onPressedChange}>Bold</Toggle>);
    const toggle = screen.getByRole("button", { name: "Bold" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(toggle).toHaveClass("gu-toggle");
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle).toHaveAttribute("data-pressed");
    expect(onPressedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("toggles with the keyboard", async () => {
    render(<Toggle>Bold</Toggle>);
    await userEvent.tab();
    await userEvent.keyboard(" ");
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "true");
  });

  it("can start pressed and be controlled", () => {
    const { rerender } = render(<Toggle pressed={false}>Bold</Toggle>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
    rerender(<Toggle pressed>Bold</Toggle>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("does nothing when disabled", async () => {
    const onPressedChange = vi.fn();
    render(
      <Toggle disabled onPressedChange={onPressedChange}>
        Bold
      </Toggle>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it("has sizes and merges className", () => {
    render(
      <Toggle size="sm" className="mine">
        Bold
      </Toggle>,
    );
    const toggle = screen.getByRole("button");
    expect(toggle).toHaveAttribute("data-size", "sm");
    expect(toggle).toHaveClass("gu-toggle", "mine");
  });
});

function Group(props: Partial<React.ComponentProps<typeof ToggleGroup>> = {}) {
  return (
    <ToggleGroup aria-label="Text alignment" defaultValue={["left"]} {...props}>
      <Toggle value="left">Left</Toggle>
      <Toggle value="center">Center</Toggle>
      <Toggle value="right">Right</Toggle>
    </ToggleGroup>
  );
}

describe("ToggleGroup", () => {
  it("is a named group and presses the default value", () => {
    render(<Group />);
    expect(screen.getByRole("group", { name: "Text alignment" })).toHaveClass("gu-toggle-group");
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Center" })).toHaveAttribute("aria-pressed", "false");
  });

  it("presses one at a time by default and reports the value", async () => {
    const onValueChange = vi.fn();
    render(<Group onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Right" }));
    expect(onValueChange).toHaveBeenCalledWith(["right"], expect.anything());
    expect(screen.getByRole("button", { name: "Right" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute("aria-pressed", "false");
  });

  it("presses several with `multiple`", async () => {
    render(<Group multiple />);
    await userEvent.click(screen.getByRole("button", { name: "Center" }));
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Center" })).toHaveAttribute("aria-pressed", "true");
  });

  it("moves focus between toggles with the arrow keys", async () => {
    render(<Group />);
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Left" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Center" })).toHaveFocus();
  });

  it("disables every toggle with the group", () => {
    render(<Group disabled />);
    for (const toggle of screen.getAllByRole("button")) expect(toggle).toHaveAttribute("data-disabled");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <Toggle>Bold</Toggle>
        <Group />
      </div>,
    );
    expect(await violationsIn(container)).toEqual([]);
  });
});
