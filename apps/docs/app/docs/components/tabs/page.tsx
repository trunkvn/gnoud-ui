import { Tabs, TabsList, TabsPanel, TabsTab } from "@gnoud-ui/react";
import { Example, PageHeader, PropsTable } from "@/components/example";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/docs/components/tabs");

const rows = [
  ["Tabs defaultValue / value", "string", "-", "Which tab is selected. Controlled with value + onValueChange."],
  ["Tabs orientation", '"horizontal" | "vertical"', '"horizontal"', "Layout and which arrow keys move focus."],
  ["TabsList activateOnFocus", "boolean", "false", "Select as soon as an arrow key moves focus, instead of waiting for Enter or Space."],
  ["TabsTab value", "string", "required", "Pairs the tab with the panel of the same value."],
  ["TabsTab disabled", "boolean", "false", "Stays focusable so screen reader users find it, but cannot be selected."],
  ["TabsPanel keepMounted", "boolean", "false", "Keep the hidden panel in the DOM."],
] as const;

export default function TabsPage() {
  return (
    <>
      <PageHeader href="/docs/components/tabs" eyebrow="Component · 06" title="Tabs">
        Built on Base UI for roving focus, arrow-key navigation and the right ARIA roles. The
        selected tab is inked in, like a pressed block.
      </PageHeader>

      <Example
        title="Default"
        description="Tab into the list, use the arrow keys to move, and Enter or Space to select."
        code={`<Tabs defaultValue="overview">
  <TabsList aria-label="Project sections">
    <TabsTab value="overview">Overview</TabsTab>
    <TabsTab value="activity">Activity</TabsTab>
    <TabsTab value="settings">Settings</TabsTab>
  </TabsList>
  <TabsPanel value="overview">…</TabsPanel>
  …
</Tabs>`}
      >
        <Tabs defaultValue="overview" className="w-full">
          <TabsList aria-label="Project sections">
            <TabsTab value="overview">Overview</TabsTab>
            <TabsTab value="activity">Activity</TabsTab>
            <TabsTab value="settings">Settings</TabsTab>
          </TabsList>
          <TabsPanel value="overview">Workspace stats and a summary of recent work.</TabsPanel>
          <TabsPanel value="activity">Everything that changed this week.</TabsPanel>
          <TabsPanel value="settings">Names, members and billing.</TabsPanel>
        </Tabs>
      </Example>

      <Example
        title="Vertical and disabled"
        code={`<Tabs defaultValue="a" orientation="vertical">
  <TabsList aria-label="Sections">
    <TabsTab value="a">Account</TabsTab>
    <TabsTab value="b">Billing</TabsTab>
    <TabsTab value="c" disabled>Audit log</TabsTab>
  </TabsList>
  …
</Tabs>`}
      >
        <Tabs defaultValue="a" orientation="vertical" className="w-full">
          <TabsList aria-label="Sections">
            <TabsTab value="a">Account</TabsTab>
            <TabsTab value="b">Billing</TabsTab>
            <TabsTab value="c" disabled>
              Audit log
            </TabsTab>
          </TabsList>
          <TabsPanel value="a">Profile, email and password.</TabsPanel>
          <TabsPanel value="b">Plan, invoices and payment method.</TabsPanel>
          <TabsPanel value="c">Not available on your plan.</TabsPanel>
        </Tabs>
      </Example>

      <PropsTable rows={rows} />
    </>
  );
}
