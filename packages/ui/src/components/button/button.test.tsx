import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { violationsIn } from "../../../test/axe";
import { Button } from "./button";

describe("Button", () => {
  it("renders a native button that does not submit forms by default", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("gu-button");
  });

  it("lets type be overridden", () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("defaults to secondary / md and reflects variant and size as data attributes", () => {
    const { rerender } = render(<Button>x</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", "secondary");
    expect(screen.getByRole("button")).toHaveAttribute("data-size", "md");

    rerender(
      <Button variant="primary" size="lg">
        x
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", "primary");
    expect(screen.getByRole("button")).toHaveAttribute("data-size", "lg");
  });

  it("merges a custom className instead of replacing ours", () => {
    render(<Button className="mine">x</Button>);
    expect(screen.getByRole("button")).toHaveClass("gu-button", "mine");
  });

  it("forwards ref and extra props", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} data-testid="b" aria-label="Close">
        x
      </Button>,
    );
    expect(ref.current).toBe(screen.getByTestId("b"));
    expect(ref.current).toHaveAccessibleName("Close");
  });

  it("calls onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  describe("disabled", () => {
    it("is natively disabled and ignores clicks", async () => {
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          Go
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("data-disabled");
      await userEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("loading", () => {
    it("blocks clicks, announces busy, and stays focusable", async () => {
      const onClick = vi.fn();
      render(
        <Button loading onClick={onClick}>
          Save
        </Button>,
      );
      const button = screen.getByRole("button", { name: "Save" });
      expect(button).toHaveAttribute("aria-busy", "true");
      expect(button).toHaveAttribute("aria-disabled", "true");
      expect(button).not.toBeDisabled();

      await userEvent.tab();
      expect(button).toHaveFocus();
      await userEvent.click(button);
      await userEvent.keyboard("{Enter}");
      expect(onClick).not.toHaveBeenCalled();
    });

    it("hides the spinner from assistive tech so the name stays 'Save'", () => {
      const { container } = render(<Button loading>Save</Button>);
      const spinner = container.querySelector(".gu-button__spinner");
      expect(spinner).toHaveAttribute("aria-hidden", "true");
      expect(screen.getByRole("button")).toHaveAccessibleName("Save");
    });

    it("does not set aria-busy when idle", () => {
      render(<Button>Save</Button>);
      expect(screen.getByRole("button")).not.toHaveAttribute("aria-busy");
      expect(screen.getByRole("button")).not.toHaveAttribute("aria-disabled");
    });
  });

  describe("render prop", () => {
    it("renders as a link and keeps the element's own props", () => {
      render(
        <Button render={<a href="/docs" className="from-link" />} variant="primary">
          Docs
        </Button>,
      );
      const link = screen.getByRole("link", { name: "Docs" });
      expect(link).toHaveAttribute("href", "/docs");
      expect(link).toHaveClass("gu-button", "from-link");
      expect(link).toHaveAttribute("data-variant", "primary");
      expect(screen.queryByRole("button")).toBeNull();
      expect(link).not.toHaveAttribute("type");
    });

    it("expresses disabled through aria-disabled and blocks the click", async () => {
      const onClick = vi.fn();
      render(
        <Button render={<a href="/docs" />} disabled onClick={onClick}>
          Docs
        </Button>,
      );
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("aria-disabled", "true");
      await userEvent.click(link);
      expect(onClick).not.toHaveBeenCalled();
    });

    it("forwards ref to the rendered element", () => {
      const ref = createRef<HTMLAnchorElement>();
      render(
        <Button render={<a href="/x" />} ref={ref as never}>
          x
        </Button>,
      );
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    });
  });

  describe("accessibility (axe)", () => {
    const cases = [
      ["default", <Button key="a">Save</Button>],
      ["primary", <Button key="b" variant="primary">Save</Button>],
      ["ghost", <Button key="c" variant="ghost">Save</Button>],
      ["disabled", <Button key="d" disabled>Save</Button>],
      ["loading", <Button key="e" loading>Save</Button>],
      ["as link", <Button key="f" render={<a href="/docs" />}>Docs</Button>],
    ] as const;

    it.each(cases)("%s has no violations", async (_name, element) => {
      const { container } = render(element);
      expect(await violationsIn(container)).toEqual([]);
    });
  });
});
