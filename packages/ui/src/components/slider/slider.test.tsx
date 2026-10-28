import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { violationsIn } from "../../../test/axe";
import { Slider } from "./slider";

describe("Slider", () => {
  it("is a slider named by its label, with the current value and range", () => {
    render(<Slider label="Volume" defaultValue={40} />);
    const thumb = screen.getByRole("slider", { name: "Volume" });
    expect(thumb).toHaveAttribute("aria-valuenow", "40");
    expect(thumb).toHaveAttribute("min", "0");
    expect(thumb).toHaveAttribute("max", "100");
    expect(document.querySelector(".gu-slider")).toBeInTheDocument();
  });

  it("moves with the arrow keys and reports it", async () => {
    const onValueChange = vi.fn();
    render(<Slider label="Volume" defaultValue={40} onValueChange={onValueChange} />);
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith(41, expect.anything());
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "41");
    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "0");
  });

  it("honours min, max and step", async () => {
    render(<Slider aria-label="Rating" defaultValue={2} min={0} max={5} step={1} />);
    await userEvent.tab();
    await userEvent.keyboard("{End}");
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "5");
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "5");
  });

  it("can show the value beside the label", () => {
    render(<Slider label="Volume" defaultValue={40} showValue />);
    expect(screen.getByText("Volume")).toHaveClass("gu-slider__label");
    expect(document.querySelector(".gu-slider__value")).toHaveTextContent("40");
  });

  it("is a range with one named thumb per value", () => {
    render(<Slider label="Price" defaultValue={[20, 80]} thumbLabels={["Minimum price", "Maximum price"]} />);
    const [min, max] = screen.getAllByRole("slider");
    expect(min).toHaveAccessibleName("Minimum price");
    expect(max).toHaveAccessibleName("Maximum price");
    expect(min).toHaveAttribute("aria-valuenow", "20");
    expect(max).toHaveAttribute("aria-valuenow", "80");
  });

  it("does not move when disabled", async () => {
    render(<Slider aria-label="x" defaultValue={40} disabled />);
    expect(screen.getByRole("slider")).toBeDisabled();
  });

  it("merges className", () => {
    render(<Slider aria-label="x" defaultValue={1} className="mine" />);
    expect(document.querySelector(".gu-slider")).toHaveClass("mine");
  });

  it("has no axe violations (single and range)", async () => {
    const { container } = render(
      <div>
        <Slider label="Volume" defaultValue={40} showValue />
        <Slider aria-label="Price" defaultValue={[20, 80]} thumbLabels={["Minimum", "Maximum"]} />
      </div>,
    );
    expect(await violationsIn(container)).toEqual([]);
  });
});
