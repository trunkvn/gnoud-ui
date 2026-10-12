import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { violationsIn } from "../../../test/axe";
import { Alert, AlertDescription, AlertTitle } from "./alert";

describe("Alert", () => {
  it("is a polite status by default", () => {
    render(<Alert>Saved</Alert>);
    const alert = screen.getByRole("status");
    expect(alert).toHaveAttribute("data-variant", "info");
    expect(alert).toHaveClass("gu-alert");
  });

  it.each(["info", "success", "warning"] as const)("%s is a status", (variant) => {
    render(<Alert variant={variant}>x</Alert>);
    expect(screen.getByRole("status")).toHaveAttribute("data-variant", variant);
  });

  it("danger is announced assertively", () => {
    render(<Alert variant="danger">Failed</Alert>);
    expect(screen.getByRole("alert")).toHaveAttribute("data-variant", "danger");
  });

  it("role can be overridden, for static notices", () => {
    render(
      <Alert role="note" variant="danger">
        x
      </Alert>,
    );
    expect(screen.getByRole("note")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("composes title and description and merges classNames", () => {
    render(
      <Alert className="mine">
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription className="d">Details here.</AlertDescription>
      </Alert>,
    );
    expect(screen.getByRole("status")).toHaveClass("gu-alert", "mine");
    expect(screen.getByText("Heads up")).toHaveClass("gu-alert__title");
    expect(screen.getByText("Details here.")).toHaveClass("gu-alert__description", "d");
  });

  it("has no axe violations for every variant", async () => {
    const { container } = render(
      <div>
        {(["info", "success", "warning", "danger"] as const).map((v) => (
          <Alert key={v} variant={v}>
            <AlertTitle>{v}</AlertTitle>
            <AlertDescription>Something happened.</AlertDescription>
          </Alert>
        ))}
      </div>,
    );
    expect(await violationsIn(container)).toEqual([]);
  });
});
