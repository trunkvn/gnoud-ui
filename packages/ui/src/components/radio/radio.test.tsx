import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { violationsIn } from "../../../test/axe";
import { Radio, RadioGroup } from "./radio";

function Demo(props: React.ComponentProps<typeof RadioGroup<string>> = {}) {
  return (
    <RadioGroup aria-label="Plan" defaultValue="free" {...props}>
      <Radio value="free" label="Free" />
      <Radio value="pro" label="Pro" />
      <Radio value="team" label="Team" disabled />
    </RadioGroup>
  );
}

describe("Radio", () => {
  it("is a named group of labelled radios with the default selected", () => {
    render(<Demo />);
    expect(screen.getByRole("radiogroup", { name: "Plan" })).toHaveClass("gu-radio-group");
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByRole("radio", { name: "Free" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Pro" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "Free" })).toHaveClass("gu-radio");
  });

  it("selects on click, deselects the other, and reports the value", async () => {
    const onValueChange = vi.fn();
    render(<Demo onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("radio", { name: "Pro" }));
    expect(onValueChange).toHaveBeenLastCalledWith("pro", expect.anything());
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Free" })).not.toBeChecked();
  });

  it("selects when the label text is clicked", async () => {
    render(<Demo />);
    await userEvent.click(screen.getByText("Pro"));
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();
  });

  it("arrow keys move the selection, and the group is one tab stop", async () => {
    render(
      <>
        <Demo />
        <button>after</button>
      </>,
    );
    await userEvent.tab();
    expect(screen.getByRole("radio", { name: "Free" })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "Pro" })).toHaveFocus();
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "after" })).toHaveFocus();
  });

  it("a disabled radio cannot be chosen", async () => {
    const onValueChange = vi.fn();
    render(<Demo onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("radio", { name: "Team" }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("radio", { name: "Team" })).toHaveAttribute("data-disabled");
  });

  it("works controlled", async () => {
    function Controlled() {
      const [value, setValue] = React.useState("pro");
      return (
        <RadioGroup aria-label="Plan" value={value} onValueChange={(v) => setValue(v)}>
          <Radio value="free" label="Free" />
          <Radio value="pro" label="Pro" />
        </RadioGroup>
      );
    }
    render(<Controlled />);
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();
    await userEvent.click(screen.getByRole("radio", { name: "Free" }));
    expect(screen.getByRole("radio", { name: "Free" })).toBeChecked();
  });

  it("submits the selected value with a form", async () => {
    let submitted: FormData | undefined;
    render(
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitted = new FormData(e.currentTarget);
        }}
      >
        <Demo name="plan" />
        <button type="submit">Go</button>
      </form>,
    );
    await userEvent.click(screen.getByRole("radio", { name: "Pro" }));
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(submitted?.get("plan")).toBe("pro");
  });

  it("without a label, className lands on the radio; with one, on the wrapper", () => {
    const { rerender } = render(
      <RadioGroup aria-label="x">
        <Radio value="a" aria-label="A" className="mine" />
      </RadioGroup>,
    );
    expect(screen.getByRole("radio")).toHaveClass("gu-radio", "mine");
    rerender(
      <RadioGroup aria-label="x">
        <Radio value="a" label="A" className="mine" />
      </RadioGroup>,
    );
    expect(screen.getByRole("radio")).not.toHaveClass("mine");
    expect(screen.getByText("A").closest("label")).toHaveClass("mine");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Demo />);
    expect(await violationsIn(container)).toEqual([]);
  });
});
