import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { violationsIn } from "../../../test/axe";
import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders a labelled textarea with 4 rows by default", () => {
    render(
      <label>
        Message
        <Textarea />
      </label>,
    );
    const field = screen.getByLabelText("Message");
    expect(field.tagName).toBe("TEXTAREA");
    expect(field).toHaveAttribute("rows", "4");
    expect(field).toHaveClass("gu-textarea");
  });

  it("forwards ref and props, merges className, lets rows be set", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} rows={8} name="msg" className="mine" aria-label="Msg" />);
    const field = screen.getByRole("textbox", { name: "Msg" });
    expect(ref.current).toBe(field);
    expect(field).toHaveAttribute("rows", "8");
    expect(field).toHaveAttribute("name", "msg");
    expect(field).toHaveClass("gu-textarea", "mine");
  });

  it("accepts multi-line typing", async () => {
    const onChange = vi.fn();
    render(<Textarea aria-label="x" onChange={onChange} />);
    await userEvent.type(screen.getByRole("textbox"), "a{Enter}b");
    expect(screen.getByRole("textbox")).toHaveValue("a\nb");
    expect(onChange).toHaveBeenCalled();
  });

  it("invalid sets aria-invalid and a styling hook", () => {
    render(<Textarea aria-label="x" invalid />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("textbox")).toHaveAttribute("data-invalid");
  });

  it("disabled blocks typing", async () => {
    render(<Textarea aria-label="x" disabled />);
    await userEvent.type(screen.getByRole("textbox"), "nope");
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <label>
        Message
        <Textarea invalid />
      </label>,
    );
    expect(await violationsIn(container)).toEqual([]);
  });
});
