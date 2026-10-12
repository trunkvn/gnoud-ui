import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { violationsIn } from "../../../test/axe";
import { Input } from "./input";

describe("Input", () => {
  it("renders a text input by default, labelled through its <label>", () => {
    render(
      <label>
        Email
        <Input />
      </label>,
    );
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveClass("gu-input");
    expect(input).toHaveAttribute("data-size", "md");
  });

  it("accepts other types, forwards ref and props, merges className", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} type="email" name="mail" className="mine" aria-label="Mail" />);
    const input = screen.getByRole("textbox", { name: "Mail" });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("name", "mail");
    expect(input).toHaveClass("gu-input", "mine");
  });

  it("reports typing", async () => {
    const onChange = vi.fn();
    render(<Input aria-label="Name" onChange={onChange} />);
    await userEvent.type(screen.getByRole("textbox"), "Hi");
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("textbox")).toHaveValue("Hi");
  });

  it("invalid sets aria-invalid and a styling hook", () => {
    const { rerender } = render(<Input aria-label="x" invalid />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("textbox")).toHaveAttribute("data-invalid");
    rerender(<Input aria-label="x" />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
  });

  it("does not use the native size attribute for sizing", () => {
    render(<Input aria-label="x" size="lg" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("data-size", "lg");
    expect(screen.getByRole("textbox")).not.toHaveAttribute("size");
  });

  it("disabled blocks typing", async () => {
    render(<Input aria-label="x" disabled />);
    await userEvent.type(screen.getByRole("textbox"), "nope");
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("has no axe violations (labelled, invalid, disabled)", async () => {
    const { container } = render(
      <div>
        <label>
          A
          <Input />
        </label>
        <label>
          B
          <Input invalid />
        </label>
        <label>
          C
          <Input disabled />
        </label>
      </div>,
    );
    expect(await violationsIn(container)).toEqual([]);
  });
});
