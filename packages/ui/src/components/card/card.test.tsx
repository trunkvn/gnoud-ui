import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { violationsIn } from "../../../test/axe";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLabel,
  CardTitle,
} from "./card";

describe("Card", () => {
  it("is raised by default and can be flat", () => {
    const { rerender } = render(<Card data-testid="c">x</Card>);
    expect(screen.getByTestId("c")).toHaveAttribute("data-variant", "raised");
    rerender(
      <Card data-testid="c" variant="flat">
        x
      </Card>,
    );
    expect(screen.getByTestId("c")).toHaveAttribute("data-variant", "flat");
  });

  it("title is an h3 unless told otherwise, so the page outline stays correct", () => {
    const { rerender } = render(<CardTitle>Hello</CardTitle>);
    expect(screen.getByRole("heading", { level: 3, name: "Hello" })).toHaveClass("gu-card__title");
    rerender(<CardTitle as="h2">Hello</CardTitle>);
    expect(screen.getByRole("heading", { level: 2, name: "Hello" })).toBeInTheDocument();
  });

  it("composes all parts and merges classNames", () => {
    render(
      <Card className="outer">
        <CardHeader>
          <CardLabel>02 · Button</CardLabel>
          <CardTitle>Title</CardTitle>
          <CardDescription>Desc</CardDescription>
        </CardHeader>
        <CardContent className="inner">Body</CardContent>
        <CardFooter>Foot</CardFooter>
      </Card>,
    );
    expect(screen.getByText("Body")).toHaveClass("gu-card__content", "inner");
    expect(screen.getByText("Desc")).toHaveClass("gu-card__description");
    expect(screen.getByText("02 · Button")).toHaveClass("gu-card__label");
    expect(screen.getByText("Foot")).toHaveClass("gu-card__footer");
    expect(screen.getByText("Body").closest(".gu-card")).toHaveClass("outer");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <main>
        <h1>Page</h1>
        <Card>
          <CardHeader>
            <CardTitle as="h2">Title</CardTitle>
            <CardDescription>Desc</CardDescription>
          </CardHeader>
          <CardContent>Body</CardContent>
        </Card>
      </main>,
    );
    expect(await violationsIn(container)).toEqual([]);
  });
});
