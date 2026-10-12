import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { violationsIn } from "../../../test/axe";
import { Tabs, TabsList, TabsPanel, TabsTab } from "./tabs";

function Demo(props: Partial<React.ComponentProps<typeof Tabs>> = {}) {
  return (
    <Tabs defaultValue="a" {...props}>
      <TabsList aria-label="Sections">
        <TabsTab value="a">Alpha</TabsTab>
        <TabsTab value="b">Beta</TabsTab>
        <TabsTab value="c" disabled>
          Gamma
        </TabsTab>
      </TabsList>
      <TabsPanel value="a">Alpha panel</TabsPanel>
      <TabsPanel value="b">Beta panel</TabsPanel>
      <TabsPanel value="c">Gamma panel</TabsPanel>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("exposes tablist / tab / tabpanel roles with the default tab selected", () => {
    render(<Demo />);
    expect(screen.getByRole("tablist", { name: "Sections" })).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByRole("tab", { name: "Alpha" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Alpha" })).toHaveAttribute("data-active");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Alpha panel");
  });

  it("switches panel on click and reports it", async () => {
    const onValueChange = vi.fn();
    render(<Demo onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "Beta" }));
    expect(onValueChange).toHaveBeenCalledWith("b", expect.anything());
    expect(screen.getByRole("tab", { name: "Beta" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Beta panel");
    expect(screen.queryByText("Alpha panel")).toBeNull();
  });

  it("moves focus with arrow keys, then selects with Enter", async () => {
    render(<Demo />);
    await userEvent.tab();
    expect(screen.getByRole("tab", { name: "Alpha" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Beta" })).toHaveFocus();
    // focus moved but selection has not changed until activated
    expect(screen.getByRole("tab", { name: "Alpha" })).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("tab", { name: "Beta" })).toHaveAttribute("aria-selected", "true");
  });

  it("keeps disabled tabs discoverable by keyboard but not selectable", async () => {
    render(<Demo />);
    const gamma = screen.getByRole("tab", { name: "Gamma" });
    expect(gamma).toHaveAttribute("data-disabled");
    expect(gamma).toHaveAttribute("aria-disabled", "true");

    // Base UI follows WAI-ARIA: a disabled tab can still receive focus so screen reader
    // users learn it exists, but it cannot be activated.
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    expect(gamma).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(gamma).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Alpha" })).toHaveAttribute("aria-selected", "true");
  });

  it("is only one tab stop (roving tabindex)", async () => {
    render(
      <>
        <Demo />
        <button>after</button>
      </>,
    );
    await userEvent.tab();
    await userEvent.tab();
    // the second Tab leaves the tab list entirely, past the panel to the next control
    expect(screen.getByRole("tab", { name: "Beta" })).not.toHaveFocus();
  });

  it("merges classNames on every part", () => {
    render(
      <Tabs defaultValue="a" className="r">
        <TabsList className="l">
          <TabsTab value="a" className="t">
            A
          </TabsTab>
        </TabsList>
        <TabsPanel value="a" className="p">
          P
        </TabsPanel>
      </Tabs>,
    );
    expect(screen.getByRole("tab")).toHaveClass("gu-tabs__tab", "t");
    expect(screen.getByRole("tablist")).toHaveClass("gu-tabs__list", "l");
    expect(screen.getByRole("tabpanel")).toHaveClass("gu-tabs__panel", "p");
    expect(screen.getByRole("tablist").parentElement).toHaveClass("gu-tabs", "r");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Demo />);
    expect(await violationsIn(container)).toEqual([]);
  });
});
