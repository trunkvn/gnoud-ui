import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { violationsIn } from "../../../test/axe";
import { Skeleton } from "./skeleton";

describe("Skeleton", () => {
  it("is decorative: hidden from assistive tech", () => {
    render(<Skeleton data-testid="s" />);
    expect(screen.getByTestId("s")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("s")).toHaveClass("gu-skeleton");
  });

  it("is a block by default and can be a circle", () => {
    const { rerender } = render(<Skeleton data-testid="s" />);
    expect(screen.getByTestId("s")).toHaveAttribute("data-shape", "block");
    rerender(<Skeleton data-testid="s" shape="circle" />);
    expect(screen.getByTestId("s")).toHaveAttribute("data-shape", "circle");
  });

  it("takes its size from style or className, and forwards ref and props", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} data-testid="s" className="mine" style={{ width: 120, height: 20 }} />);
    expect(ref.current).toBe(screen.getByTestId("s"));
    expect(ref.current).toHaveClass("gu-skeleton", "mine");
    expect(ref.current).toHaveStyle({ width: "120px", height: "20px" });
  });

  it("lets the caller override aria-hidden", () => {
    render(<Skeleton data-testid="s" aria-hidden={false} />);
    expect(screen.getByTestId("s")).toHaveAttribute("aria-hidden", "false");
  });

  it("has no axe violations inside a busy container", async () => {
    const { container } = render(
      <section aria-busy="true" aria-label="Profile">
        <Skeleton shape="circle" />
        <Skeleton />
      </section>,
    );
    expect(await violationsIn(container)).toEqual([]);
  });
});
