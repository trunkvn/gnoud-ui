import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { violationsIn } from "../../../test/axe";
import { Switch } from "./switch";

describe("Switch", () => {
  it("is a labelled switch that starts off", () => {
    render(<Switch label="Notifications" />);
    const control = screen.getByRole("switch", { name: "Notifications" });
    expect(control).toHaveAttribute("aria-checked", "false");
    expect(control).toHaveClass("gu-switch");
  });

  it("toggles on click and reports the new value", async () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="Notifications" onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole("switch"));
    expect(onCheckedChange).toHaveBeenLastCalledWith(true, expect.anything());
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("switch")).toHaveAttribute("data-checked");
  });

  it("toggles when the label text is clicked", async () => {
    render(<Switch label="Notifications" />);
    await userEvent.click(screen.getByText("Notifications"));
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("toggles with the Space key", async () => {
    render(<Switch label="Notifications" />);
    await userEvent.tab();
    expect(screen.getByRole("switch")).toHaveFocus();
    await userEvent.keyboard(" ");
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("works controlled", async () => {
    function Controlled() {
      const [on, setOn] = useState(true);
      return <Switch label="On" checked={on} onCheckedChange={setOn} />;
    }
    render(<Controlled />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
    await userEvent.click(screen.getByRole("switch"));
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("disabled ignores clicks", async () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="Nope" disabled onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole("switch"));
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole("switch")).toHaveAttribute("data-disabled");
  });

  it("submits its value with a form when on", async () => {
    let submitted: FormData | undefined;
    render(
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitted = new FormData(e.currentTarget);
        }}
      >
        <Switch label="News" name="news" />
        <button type="submit">Go</button>
      </form>,
    );
    await userEvent.click(screen.getByRole("switch"));
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(submitted?.get("news")).toBe("on");
  });

  it("without a label, className lands on the switch; with one, on the wrapper", () => {
    const { rerender } = render(<Switch aria-label="x" className="mine" />);
    expect(screen.getByRole("switch")).toHaveClass("gu-switch", "mine");
    rerender(<Switch label="x" className="mine" />);
    expect(screen.getByRole("switch")).not.toHaveClass("mine");
    expect(screen.getByText("x").closest("label")).toHaveClass("mine");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <Switch label="A" />
        <Switch aria-label="B" defaultChecked />
        <Switch label="C" disabled />
      </div>,
    );
    expect(await violationsIn(container)).toEqual([]);
  });
});
