import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { violationsIn } from "../../../test/axe";
import { Separator } from "./separator";

describe("Separator", () => {
  it("is a horizontal separator by default", () => {
    render(<Separator />);
    const rule = screen.getByRole("separator");
    expect(rule).toHaveClass("gu-separator");
    expect(rule).toHaveAttribute("data-orientation", "horizontal");
  });

  it("can be vertical, and says so to assistive technology", () => {
    render(<Separator orientation="vertical" />);
    const rule = screen.getByRole("separator");
    expect(rule).toHaveAttribute("aria-orientation", "vertical");
    expect(rule).toHaveAttribute("data-orientation", "vertical");
  });

  it("can be made decorative", () => {
    render(<Separator role="presentation" />);
    expect(screen.queryByRole("separator")).toBeNull();
  });

  it("merges className", () => {
    render(<Separator className="mine" />);
    expect(screen.getByRole("separator")).toHaveClass("gu-separator", "mine");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <Separator />
        <Separator orientation="vertical" />
      </div>,
    );
    expect(await violationsIn(container)).toEqual([]);
  });
});
