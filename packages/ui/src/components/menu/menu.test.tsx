import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { violationsIn } from "../../../test/axe";
import { Button } from "../button/button";
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuLinkItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "./menu";

function Demo({ onEdit = () => {}, onDelete = () => {} }: { onEdit?: () => void; onDelete?: () => void }) {
  return (
    <Menu>
      <MenuTrigger render={<Button />}>Actions</MenuTrigger>
      <MenuContent>
        <MenuItem onClick={onEdit}>Edit</MenuItem>
        <MenuItem onClick={onDelete}>Delete</MenuItem>
        <MenuItem disabled>Archive</MenuItem>
        <MenuSeparator />
        <MenuLinkItem href="/docs">Documentation</MenuLinkItem>
      </MenuContent>
    </Menu>
  );
}

const open = async () => {
  await userEvent.click(screen.getByRole("button", { name: "Actions" }));
  return screen.findByRole("menu");
};

describe("Menu", () => {
  it("is closed until the trigger is pressed, then lists its items", async () => {
    render(<Demo />);
    expect(screen.queryByRole("menu")).toBeNull();
    const menu = await open();
    expect(menu).toHaveClass("gu-menu");
    expect(within(menu).getAllByRole("menuitem").map((i) => i.textContent)).toEqual(["Edit", "Delete", "Archive", "Documentation"]);
  });

  it("runs an item's onClick and closes", async () => {
    const onEdit = vi.fn();
    render(<Demo onEdit={onEdit} />);
    await open();
    await userEvent.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(onEdit).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("is operable with the keyboard: arrows move, Enter chooses, focus returns to the trigger", async () => {
    const onDelete = vi.fn();
    render(<Demo onDelete={onDelete} />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await screen.findByRole("menu");

    const delete_ = screen.getByRole("menuitem", { name: "Delete" });
    for (let i = 0; i < 6 && !delete_.hasAttribute("data-highlighted"); i++) await userEvent.keyboard("{ArrowDown}");
    expect(delete_).toHaveAttribute("data-highlighted");

    await userEvent.keyboard("{Enter}");
    expect(onDelete).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(trigger).toHaveFocus();
  });

  it("a disabled item stays reachable by arrow keys (so it is discoverable) but does nothing", async () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(<Demo onEdit={onEdit} onDelete={onDelete} />);
    await open();
    const archive = screen.getByRole("menuitem", { name: "Archive" });
    for (let i = 0; i < 6 && !archive.hasAttribute("data-highlighted"); i++) await userEvent.keyboard("{ArrowDown}");
    expect(archive).toHaveAttribute("data-highlighted");
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(onEdit).not.toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("closes with Escape", async () => {
    render(<Demo />);
    await open();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("a disabled item cannot be chosen", async () => {
    render(<Demo />);
    await open();
    const item = screen.getByRole("menuitem", { name: "Archive" });
    expect(item).toHaveAttribute("aria-disabled", "true");
    expect(item).toHaveAttribute("data-disabled");
  });

  it("a link item renders a real link", async () => {
    render(<Demo />);
    await open();
    expect(screen.getByRole("menuitem", { name: "Documentation" })).toHaveAttribute("href", "/docs");
  });

  it("checkbox items toggle and report", async () => {
    const onCheckedChange = vi.fn();
    render(
      <Menu>
        <MenuTrigger render={<Button />}>View</MenuTrigger>
        <MenuContent>
          <MenuCheckboxItem defaultChecked onCheckedChange={onCheckedChange}>
            Show grid
          </MenuCheckboxItem>
        </MenuContent>
      </Menu>,
    );
    await userEvent.click(screen.getByRole("button", { name: "View" }));
    const item = await screen.findByRole("menuitemcheckbox", { name: "Show grid" });
    expect(item).toHaveAttribute("aria-checked", "true");
    await userEvent.click(item);
    expect(onCheckedChange).toHaveBeenLastCalledWith(false, expect.anything());
  });

  it("radio items choose one value", async () => {
    function Radios() {
      const [value, setValue] = React.useState("light");
      return (
        <Menu>
          <MenuTrigger render={<Button />}>Theme</MenuTrigger>
          <MenuContent>
            <MenuRadioGroup value={value} onValueChange={(v) => setValue(v as string)}>
              <MenuRadioItem value="light">Light</MenuRadioItem>
              <MenuRadioItem value="dark">Dark</MenuRadioItem>
            </MenuRadioGroup>
          </MenuContent>
        </Menu>
      );
    }
    render(<Radios />);
    await userEvent.click(screen.getByRole("button", { name: "Theme" }));
    expect(await screen.findByRole("menuitemradio", { name: "Light" })).toHaveAttribute("aria-checked", "true");
    await userEvent.click(screen.getByRole("menuitemradio", { name: "Dark" }));
    // Toggle-style items keep the menu open (closeOnClick is false for them), unlike plain items.
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitemradio", { name: "Dark" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("menuitemradio", { name: "Light" })).toHaveAttribute("aria-checked", "false");
  });

  it("supports labelled groups", async () => {
    render(
      <Menu>
        <MenuTrigger render={<Button />}>More</MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuGroupLabel>Account</MenuGroupLabel>
            <MenuItem>Profile</MenuItem>
          </MenuGroup>
        </MenuContent>
      </Menu>,
    );
    await userEvent.click(screen.getByRole("button", { name: "More" }));
    const group = await screen.findByRole("group", { name: "Account" });
    expect(within(group).getByRole("menuitem", { name: "Profile" })).toBeInTheDocument();
  });

  it("has no axe violations while open", async () => {
    const { baseElement } = render(<Demo />);
    await open();
    expect(await violationsIn(baseElement)).toEqual([]);
  });
});
