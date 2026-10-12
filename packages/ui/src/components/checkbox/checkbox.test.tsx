import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { violationsIn } from "../../../test/axe";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("is a labelled checkbox that starts unchecked", () => {
    render(<Checkbox label="Subscribe" />);
    const box = screen.getByRole("checkbox", { name: "Subscribe" });
    expect(box).toHaveAttribute("aria-checked", "false");
    expect(box).toHaveClass("gu-checkbox");
  });

  it("toggles on click and reports the new value", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Subscribe" onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).toHaveBeenLastCalledWith(true, expect.anything());
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-checked");
  });

  it("toggles when the label text is clicked", async () => {
    render(<Checkbox label="Subscribe" />);
    await userEvent.click(screen.getByText("Subscribe"));
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
  });

  it("toggles with the Space key", async () => {
    render(<Checkbox label="Subscribe" />);
    await userEvent.tab();
    expect(screen.getByRole("checkbox")).toHaveFocus();
    await userEvent.keyboard(" ");
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
  });

  it("works controlled", async () => {
    function Controlled() {
      const [checked, setChecked] = useState(true);
      return <Checkbox label="On" checked={checked} onCheckedChange={setChecked} />;
    }
    render(<Controlled />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
    await userEvent.click(screen.getByRole("checkbox"));
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "false");
  });

  it("exposes the mixed state to assistive tech", () => {
    render(<Checkbox label="All" indeterminate />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "mixed");
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-indeterminate");
  });

  it("disabled ignores clicks", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Nope" disabled onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-disabled");
  });

  it("submits its value with a form", async () => {
    let submitted: FormData | undefined;
    render(
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitted = new FormData(e.currentTarget);
        }}
      >
        <Checkbox label="News" name="news" value="yes" />
        <button type="submit">Go</button>
      </form>,
    );
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(submitted?.get("news")).toBe("yes");
  });

  it("without a label, className lands on the box; with one, on the wrapper", () => {
    const { rerender } = render(<Checkbox aria-label="x" className="mine" />);
    expect(screen.getByRole("checkbox")).toHaveClass("gu-checkbox", "mine");
    rerender(<Checkbox label="x" className="mine" />);
    expect(screen.getByRole("checkbox")).not.toHaveClass("mine");
    expect(screen.getByText("x").closest("label")).toHaveClass("mine");
  });

  it("has no axe violations (label, aria-label, checked, mixed, disabled)", async () => {
    const { container } = render(
      <div>
        <Checkbox label="A" />
        <Checkbox aria-label="B" defaultChecked />
        <Checkbox label="C" indeterminate />
        <Checkbox label="D" disabled />
      </div>,
    );
    expect(await violationsIn(container)).toEqual([]);
  });
});
