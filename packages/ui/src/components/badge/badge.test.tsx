import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { violationsIn } from "../../../test/axe";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders a span with the neutral variant by default", () => {
    render(<Badge>Beta</Badge>);
    const badge = screen.getByText("Beta");
    expect(badge.tagName).toBe("SPAN");
    expect(badge).toHaveClass("gu-badge");
    expect(badge).toHaveAttribute("data-variant", "neutral");
  });

  it.each(["accent", "highlight", "success", "danger"] as const)("reflects variant %s", (variant) => {
    render(<Badge variant={variant}>x</Badge>);
    expect(screen.getByText("x")).toHaveAttribute("data-variant", variant);
  });

  it("merges className and forwards props", () => {
    render(
      <Badge className="mine" title="hint">
        x
      </Badge>,
    );
    expect(screen.getByText("x")).toHaveClass("gu-badge", "mine");
    expect(screen.getByText("x")).toHaveAttribute("title", "hint");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Badge variant="danger">Failed</Badge>);
    expect(await violationsIn(container)).toEqual([]);
  });
});
