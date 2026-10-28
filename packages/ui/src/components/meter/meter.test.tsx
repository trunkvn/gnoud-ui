import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { violationsIn } from "../../../test/axe";
import { Meter } from "./meter";

describe("Meter", () => {
  it("is a meter with the current value and range", () => {
    render(<Meter label="Storage" value={72} />);
    const meter = screen.getByRole("meter", { name: "Storage" });
    expect(meter).toHaveAttribute("aria-valuenow", "72");
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "100");
    expect(meter).toHaveClass("gu-meter");
  });

  it("fills the track to the value's position in the range", () => {
    const { container } = render(<Meter aria-label="x" value={5} min={0} max={20} />);
    expect(container.querySelector<HTMLElement>(".gu-meter__indicator")!.style.width).toBe("25%");
  });

  it("can show the value beside the label", () => {
    render(<Meter label="Storage" value={72} showValue />);
    expect(screen.getByText("Storage")).toHaveClass("gu-meter__label");
    expect(document.querySelector(".gu-meter__value")).toHaveTextContent("72");
  });

  it("formats the value and its spoken text", () => {
    render(
      <Meter
        aria-label="Disk"
        value={0.4}
        max={1}
        showValue
        format={{ style: "percent" }}
        getAriaValueText={(formatted) => `${formatted} used`}
      />,
    );
    expect(document.querySelector(".gu-meter__value")).toHaveTextContent("40%");
    expect(screen.getByRole("meter")).toHaveAttribute("aria-valuetext", "40% used");
  });

  it("merges className", () => {
    render(<Meter aria-label="x" value={1} className="mine" />);
    expect(screen.getByRole("meter")).toHaveClass("gu-meter", "mine");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Meter label="Storage" value={72} showValue />);
    expect(await violationsIn(container)).toEqual([]);
  });
});
