import {
  Button,
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
} from "@gnoud-ui/react";
import { Example, PageHeader, PropsTable } from "@/components/example";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/docs/components/menu");

const rows = [
  ["Menu open / defaultOpen / onOpenChange", "-", "closed", "Open it uncontrolled, or control it from state."],
  ["MenuTrigger render", "ReactElement", "<button>", "Use your own button: render={<Button />}."],
  ["MenuContent side / align / sideOffset", "-", '"bottom" / "start" / 4', "Where it opens relative to the trigger."],
  ["MenuItem onClick", "(event) => void", "-", "Runs when chosen. The menu then closes."],
  ["MenuItem disabled", "boolean", "false", "Stays reachable by arrow keys so it is discoverable, but does nothing."],
  ["MenuItem label", "string", "-", "Text for typeahead, when the children are not plain text."],
  ["MenuItem closeOnClick", "boolean", "true", "Set false to keep the menu open after choosing."],
  ["MenuCheckboxItem checked / defaultChecked / onCheckedChange", "-", "false", "A toggle. Keeps the menu open by default."],
  ["MenuRadioGroup value / onValueChange", "-", "-", "Holds the choice among its MenuRadioItems. Keeps the menu open by default."],
  ["MenuLinkItem href", "string", "-", "An item that navigates: renders a real link."],
] as const;

export default function MenuPage() {
  return (
    <>
      <PageHeader href="/docs/components/menu" eyebrow="Component · 16" title="Menu">
        A dropdown list of actions. Arrow keys move, typing jumps to an item, Enter chooses, Escape
        closes and focus returns to the button. The highlighted item is inked in, like the selected tab.
        Built on Base UI.
      </PageHeader>

      <Example
        title="Actions"
        description="Open it with the mouse, or focus the button and press Enter or the down arrow."
        code={`<Menu>
  <MenuTrigger render={<Button />}>Actions</MenuTrigger>
  <MenuContent>
    <MenuItem onClick={() => rename()}>Rename</MenuItem>
    <MenuItem onClick={() => duplicate()}>Duplicate</MenuItem>
    <MenuItem disabled>Archive</MenuItem>
    <MenuSeparator />
    <MenuLinkItem href="/docs">Documentation</MenuLinkItem>
  </MenuContent>
</Menu>`}
      >
        <Menu>
          <MenuTrigger render={<Button />}>Actions</MenuTrigger>
          <MenuContent>
            <MenuItem>Rename</MenuItem>
            <MenuItem>Duplicate</MenuItem>
            <MenuItem disabled>Archive</MenuItem>
            <MenuSeparator />
            <MenuLinkItem href="/docs/getting-started">Documentation</MenuLinkItem>
          </MenuContent>
        </Menu>
      </Example>

      <Example
        title="Toggles, choices and groups"
        description="Checkbox and radio items keep the menu open, so several can be changed in one visit."
        code={`<Menu>
  <MenuTrigger render={<Button />}>View</MenuTrigger>
  <MenuContent>
    <MenuGroup>
      <MenuGroupLabel>Show</MenuGroupLabel>
      <MenuCheckboxItem defaultChecked>Grid</MenuCheckboxItem>
      <MenuCheckboxItem>Rulers</MenuCheckboxItem>
    </MenuGroup>
    <MenuSeparator />
    <MenuGroup>
      <MenuGroupLabel>Theme</MenuGroupLabel>
      <MenuRadioGroup defaultValue="light">
        <MenuRadioItem value="light">Light</MenuRadioItem>
        <MenuRadioItem value="dark">Dark</MenuRadioItem>
      </MenuRadioGroup>
    </MenuGroup>
  </MenuContent>
</Menu>`}
      >
        <Menu>
          <MenuTrigger render={<Button />}>View</MenuTrigger>
          <MenuContent>
            <MenuGroup>
              <MenuGroupLabel>Show</MenuGroupLabel>
              <MenuCheckboxItem defaultChecked>Grid</MenuCheckboxItem>
              <MenuCheckboxItem>Rulers</MenuCheckboxItem>
            </MenuGroup>
            <MenuSeparator />
            <MenuGroup>
              <MenuGroupLabel>Theme</MenuGroupLabel>
              <MenuRadioGroup defaultValue="light">
                <MenuRadioItem value="light">Light</MenuRadioItem>
                <MenuRadioItem value="dark">Dark</MenuRadioItem>
              </MenuRadioGroup>
            </MenuGroup>
          </MenuContent>
        </Menu>
      </Example>

      <PropsTable rows={rows} />
      <p className="mt-3 text-sm text-muted">
        A menu is for commands. To pick a value for a form field use Select, and for optional detail
        use Popover.
      </p>
    </>
  );
}
