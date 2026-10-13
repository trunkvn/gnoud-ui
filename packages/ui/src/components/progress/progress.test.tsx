import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { violationsIn } from "../../../test/axe";
import { Progress } from "./progress";

describe("Progress", () => {
  it("is a progressbar with the current value and range", () => {
    render(<Progress label="Upload" value={40} />);
    const bar = screen.getByRole("progressbar", { name: "Upload" });
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveClass("gu-progress");
  });

  it("fills the track to the value", () => {
    const { container } = render(<Progress aria-label="x" value={40} />);
    expect(container.querySelector<HTMLElement>(".gu-progress__indicator")!.style.width).toBe("40%");
  });

  it("honours a custom range", () => {
    render(<Progress aria-label="x" value={5} min={0} max={10} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "10");
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "5");
  });

  it("can show the value beside the label", () => {
    render(<Progress label="Upload" value={40} showValue />);
    expect(screen.getByText("Upload")).toHaveClass("gu-progress__label");
    expect(document.querySelector(".gu-progress__value")).toHaveTextContent("40%");
  });

  it("is indeterminate when the value is null: no value announced", () => {
    render(<Progress aria-label="Working" value={null} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar).toHaveAttribute("data-indeterminate");
  });

  it("marks itself complete at the maximum", () => {
    render(<Progress aria-label="x" value={100} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("data-complete");
  });

  it("merges className", () => {
    render(<Progress aria-label="x" value={1} className="mine" />);
    expect(screen.getByRole("progressbar")).toHaveClass("gu-progress", "mine");
  });

  it("has no axe violations (determinate and indeterminate)", async () => {
    const { container } = render(
      <div>
        <Progress label="Upload" value={40} showValue />
        <Progress aria-label="Working" value={null} />
      </div>,
    );
    expect(await violationsIn(container)).toEqual([]);
  });
});
