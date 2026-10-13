import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { violationsIn } from "../../../test/axe";
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "./accordion";

function Demo(props: Partial<React.ComponentProps<typeof Accordion>> = {}) {
  return (
    <Accordion {...props}>
      <AccordionItem value="a">
        <AccordionTrigger>First</AccordionTrigger>
        <AccordionPanel>First content</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Second</AccordionTrigger>
        <AccordionPanel>Second content</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="c" disabled>
        <AccordionTrigger>Third</AccordionTrigger>
        <AccordionPanel>Third content</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

const expanded = (name: string) => screen.getByRole("button", { name }).getAttribute("aria-expanded");

describe("Accordion", () => {
  it("renders each trigger inside a heading, all collapsed by default", () => {
    render(<Demo />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
    expect(expanded("First")).toBe("false");
    expect(expanded("Second")).toBe("false");
    expect(screen.getByRole("button", { name: "First" })).toHaveClass("gu-accordion__trigger");
  });

  it("opens a section on click and shows its content", async () => {
    render(<Demo />);
    await userEvent.click(screen.getByRole("button", { name: "First" }));
    expect(expanded("First")).toBe("true");
    expect(screen.getByText("First content")).toBeVisible();
    expect(screen.getByRole("button", { name: "First" })).toHaveAttribute("data-panel-open");
  });

  it("closes the other section when one opens (single mode)", async () => {
    render(<Demo />);
    await userEvent.click(screen.getByRole("button", { name: "First" }));
    await userEvent.click(screen.getByRole("button", { name: "Second" }));
    expect(expanded("Second")).toBe("true");
    expect(expanded("First")).toBe("false");
  });

  it("keeps several open with `multiple`", async () => {
    render(<Demo multiple />);
    await userEvent.click(screen.getByRole("button", { name: "First" }));
    await userEvent.click(screen.getByRole("button", { name: "Second" }));
    expect(expanded("First")).toBe("true");
    expect(expanded("Second")).toBe("true");
  });

  it("toggles closed again", async () => {
    render(<Demo />);
    const first = screen.getByRole("button", { name: "First" });
    await userEvent.click(first);
    await userEvent.click(first);
    expect(expanded("First")).toBe("false");
  });

  it("works from the keyboard: Enter and Space toggle, and every trigger is its own tab stop", async () => {
    render(<Demo />);
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(expanded("First")).toBe("true");
    // Unlike tabs, accordion headers are plain buttons in the tab order (WAI-ARIA: arrow keys are optional).
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Second" })).toHaveFocus();
    await userEvent.keyboard(" ");
    expect(expanded("Second")).toBe("true");
  });

  it("reports the open values", async () => {
    const onValueChange = vi.fn();
    render(<Demo onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Second" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["b"], expect.anything());
  });

  it("a disabled section cannot be opened", async () => {
    render(<Demo />);
    await userEvent.click(screen.getByRole("button", { name: "Third" }));
    expect(expanded("Third")).toBe("false");
    expect(screen.getByRole("button", { name: "Third" })).toHaveAttribute("data-disabled");
  });

  it("can start open", () => {
    render(<Demo defaultValue={["b"]} />);
    expect(expanded("Second")).toBe("true");
  });

  it("has no axe violations, closed and open", async () => {
    const { container } = render(<Demo defaultValue={["a"]} />);
    expect(await violationsIn(container)).toEqual([]);
  });
});
