import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { violationsIn } from "../../../test/axe";
import { Avatar, AvatarGroup, initialsOf } from "./avatar";

/** jsdom never loads images, so stand in for the browser's image preloader. */
function stubImage(outcome: "load" | "error") {
  class FakeImage {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    crossOrigin = "";
    referrerPolicy = "";
    set src(_value: string) {
      setTimeout(() => (outcome === "load" ? this.onload?.() : this.onerror?.()), 0);
    }
  }
  vi.stubGlobal("Image", FakeImage);
}

afterEach(() => vi.unstubAllGlobals());

describe("initialsOf", () => {
  it.each([
    ["Nguyễn Đại Dương", "ND"],
    ["gnoud", "G"],
    ["  ada   lovelace  ", "AL"],
    ["Jean-Luc Picard", "JP"],
    ["", ""],
  ])("%s → %s", (name, expected) => {
    expect(initialsOf(name)).toBe(expected);
  });

  it("takes whole characters, so accents and non-Latin scripts survive", () => {
    expect(initialsOf("Đặng Ánh")).toBe("ĐÁ");
    expect(initialsOf("李 小龍")).toBe("李小");
  });
});

describe("Avatar", () => {
  it("is named by alt and shows initials when there is no picture", () => {
    render(<Avatar alt="Ada Lovelace" />);
    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toHaveClass("gu-avatar");
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("lets the fallback be overridden", () => {
    render(<Avatar alt="Ada Lovelace" fallback="?!" />);
    expect(screen.getByText("?!")).toBeInTheDocument();
    expect(screen.queryByText("AL")).toBeNull();
  });

  it("keeps showing the initials while the picture has not loaded", () => {
    render(<Avatar alt="Ada Lovelace" src="/ada.png" />);
    expect(screen.getByText("AL")).toBeInTheDocument();
    expect(document.querySelector("img")).toBeNull();
  });

  it("swaps in the picture once it loads, with the same accessible name", async () => {
    stubImage("load");
    render(<Avatar alt="Ada Lovelace" src="/ada.png" />);
    await waitFor(() => expect(document.querySelector("img")).toHaveAttribute("src", "/ada.png"));
    expect(screen.queryByText("AL")).toBeNull();
    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toBeInTheDocument();
    // the <img> itself is empty-alt so the name is not read twice
    expect(document.querySelector("img")).toHaveAttribute("alt", "");
  });

  it("falls back to the initials when the picture fails", async () => {
    stubImage("error");
    render(<Avatar alt="Ada Lovelace" src="/missing.png" />);
    await new Promise((r) => setTimeout(r, 20));
    expect(document.querySelector("img")).toBeNull();
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("defaults to a medium circle, and takes size and shape", () => {
    const { rerender } = render(<Avatar alt="A" data-testid="a" />);
    expect(screen.getByTestId("a")).toHaveAttribute("data-size", "md");
    expect(screen.getByTestId("a")).toHaveAttribute("data-shape", "circle");
    rerender(<Avatar alt="A" data-testid="a" size="xl" shape="square" />);
    expect(screen.getByTestId("a")).toHaveAttribute("data-size", "xl");
    expect(screen.getByTestId("a")).toHaveAttribute("data-shape", "square");
  });

  it("can be decorative: hidden from assistive tech", () => {
    render(<Avatar alt="Ada Lovelace" decorative data-testid="a" />);
    expect(screen.getByTestId("a")).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("merges className and forwards props", () => {
    render(<Avatar alt="A" className="mine" data-testid="a" title="Ada" />);
    expect(screen.getByTestId("a")).toHaveClass("gu-avatar", "mine");
    expect(screen.getByTestId("a")).toHaveAttribute("title", "Ada");
  });

  it("has no axe violations alone or in a group", async () => {
    const { container } = render(
      <div>
        <Avatar alt="Ada Lovelace" />
        <AvatarGroup aria-label="Reviewers">
          <Avatar alt="Ada Lovelace" />
          <Avatar alt="Alan Turing" />
        </AvatarGroup>
      </div>,
    );
    expect(await violationsIn(container)).toEqual([]);
  });
});

describe("AvatarGroup max", () => {
  const people = ["Ada Lovelace", "Alan Turing", "Grace Hopper", "Linus Torvalds", "Margaret Hamilton"];
  const group = (props: React.ComponentProps<typeof AvatarGroup> = {}) => (
    <AvatarGroup aria-label="Team" {...props}>
      {people.map((name) => (
        <Avatar key={name} alt={name} />
      ))}
    </AvatarGroup>
  );

  it("shows every avatar when there is no max, or when they fit", () => {
    const { rerender } = render(group());
    expect(screen.getAllByRole("img")).toHaveLength(5);
    rerender(group({ max: 5 }));
    expect(screen.getAllByRole("img")).toHaveLength(5);
    expect(screen.queryByText(/^\+/)).toBeNull();
  });

  it("folds the rest into one '+N' avatar named 'N more'", () => {
    render(group({ max: 3 }));
    expect(screen.getAllByRole("img")).toHaveLength(4);
    expect(screen.getByRole("img", { name: "2 more" })).toHaveTextContent("+2");
    expect(screen.queryByRole("img", { name: "Linus Torvalds" })).toBeNull();
    expect(screen.getByRole("img", { name: "Grace Hopper" })).toBeInTheDocument();
  });

  it("max 0 leaves only the count", () => {
    render(group({ max: 0 }));
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(screen.getByRole("img", { name: "5 more" })).toHaveTextContent("+5");
  });

  it("applies a default size and shape to the group, unless an avatar sets its own", () => {
    render(
      <AvatarGroup aria-label="Team" size="lg" shape="square" max={2}>
        <Avatar alt="Ada Lovelace" />
        <Avatar alt="Alan Turing" size="sm" />
        <Avatar alt="Grace Hopper" />
      </AvatarGroup>,
    );
    const [ada, turing, more] = screen.getAllByRole("img");
    expect(ada).toHaveAttribute("data-size", "lg");
    expect(ada).toHaveAttribute("data-shape", "square");
    expect(turing).toHaveAttribute("data-size", "sm");
    expect(more).toHaveAttribute("data-size", "lg");
  });

  it("has no axe violations with an overflow avatar", async () => {
    const { container } = render(group({ max: 2 }));
    expect(await violationsIn(container)).toEqual([]);
  });
});

describe("AvatarGroup", () => {
  it("is a named group of avatars", () => {
    render(
      <AvatarGroup aria-label="Reviewers">
        <Avatar alt="Ada Lovelace" />
        <Avatar alt="Alan Turing" />
      </AvatarGroup>,
    );
    const group = screen.getByRole("group", { name: "Reviewers" });
    expect(group).toHaveClass("gu-avatar-group");
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });
});
