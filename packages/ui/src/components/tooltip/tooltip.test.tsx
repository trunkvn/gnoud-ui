import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { violationsIn } from "../../../test/axe";
import { Button } from "../button/button";
import { Tooltip } from "./tooltip";

describe("Tooltip", () => {
  it("is hidden until the trigger is hovered, then shows its content", async () => {
    render(
      <Tooltip content="Save changes" delay={0}>
        <Button>Save</Button>
      </Tooltip>,
    );
    expect(screen.queryByText("Save changes")).toBeNull();
    await userEvent.hover(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText("Save changes")).toHaveClass("gu-tooltip");
  });

  it("hides again when the pointer leaves", async () => {
    render(
      <Tooltip content="Hint" delay={0}>
        <Button>Go</Button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Go" });
    await userEvent.hover(trigger);
    await screen.findByText("Hint");
    await userEvent.unhover(trigger);
    await waitFor(() => expect(screen.queryByText("Hint")).toBeNull());
  });

  it("opens on keyboard focus and closes on Escape", async () => {
    render(
      <Tooltip content="Keyboard hint" delay={0}>
        <Button>Go</Button>
      </Tooltip>,
    );
    await userEvent.tab();
    expect(await screen.findByText("Keyboard hint")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByText("Keyboard hint")).toBeNull());
  });

  it("keeps the trigger a real Button (the child is what renders)", () => {
    render(
      <Tooltip content="x">
        <Button variant="primary">Go</Button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Go" });
    expect(trigger).toHaveClass("gu-button");
    expect(trigger).toHaveAttribute("data-variant", "primary");
  });

  it("does not open when disabled", async () => {
    render(
      <Tooltip content="Nope" delay={0} disabled>
        <Button>Go</Button>
      </Tooltip>,
    );
    await userEvent.hover(screen.getByRole("button"));
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.queryByText("Nope")).toBeNull();
  });

  it("is visual only: it adds no role, so the trigger needs its own accessible name", async () => {
    render(
      <Tooltip content="Bold" delay={0}>
        <Button aria-label="Bold">B</Button>
      </Tooltip>,
    );
    await userEvent.hover(screen.getByRole("button"));
    await screen.findByText("Bold");
    expect(screen.queryByRole("tooltip")).toBeNull();
    expect(screen.getByRole("button")).toHaveAccessibleName("Bold");
  });

  it("has no axe violations while open", async () => {
    const { baseElement } = render(
      <Tooltip content="Bold" delay={0}>
        <Button aria-label="Bold">B</Button>
      </Tooltip>,
    );
    await userEvent.hover(screen.getByRole("button"));
    await screen.findByText("Bold");
    expect(await violationsIn(baseElement)).toEqual([]);
  });
});
