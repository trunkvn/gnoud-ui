import {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@gnoud-ui/react";
import { Example, PageHeader, PropsTable } from "@/components/example";

export const metadata = { title: "Select" };

const rows = [
  ["Select items", "{ label, value }[]", "-", "Pass this so the trigger can show the selected label, not the raw value."],
  ["Select value / defaultValue / onValueChange", "-", "-", "Controlled / uncontrolled selection."],
  ["Select name / required / disabled", "-", "-", "Form integration. A hidden input submits the value."],
  ["SelectValue placeholder", "ReactNode", "-", "Shown while nothing is selected."],
  ["SelectItem value", "string", "required", "What is submitted and reported."],
  ["SelectItem disabled", "boolean", "false", "Visible but not selectable."],
] as const;

const fruits = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Dragon fruit", value: "dragon-fruit" },
];

const food = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Bread", value: "bread" },
  { label: "Rice", value: "rice" },
];

export default function SelectPage() {
  return (
    <>
      <PageHeader eyebrow="Component · 12" title="Select">
        Pick one value from a list. The trigger is a flat field like Input; the list is raised, and
        the highlighted item is inked in like the selected tab. Built on Base UI for keyboard,
        typeahead and form behaviour.
      </PageHeader>

      <Example
        title="Default"
        description="Open it, then use the arrow keys, type to jump, Enter to choose, Escape to close."
        code={`const fruits = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  …
];

<Select items={fruits}>
  <SelectLabel>Favourite fruit</SelectLabel>
  <SelectTrigger>
    <SelectValue placeholder="Pick a fruit" />
  </SelectTrigger>
  <SelectContent>
    {fruits.map((f) => (
      <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
    ))}
  </SelectContent>
</Select>`}
      >
        <div className="grid w-full max-w-xs gap-1.5">
          <Select items={fruits}>
            <SelectLabel>Favourite fruit</SelectLabel>
            <SelectTrigger>
              <SelectValue placeholder="Pick a fruit" />
            </SelectTrigger>
            <SelectContent>
              {fruits.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Example>

      <Example
        title="Groups and a default"
        code={`<Select items={food} defaultValue="bread">
  <SelectTrigger aria-label="Food">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectGroupLabel>Fruit</SelectGroupLabel>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectGroupLabel>Staples</SelectGroupLabel>
      <SelectItem value="bread">Bread</SelectItem>
      <SelectItem value="rice" disabled>Rice</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`}
      >
        <div className="w-full max-w-xs">
          <Select items={food} defaultValue="bread">
            <SelectTrigger aria-label="Food">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectGroupLabel>Fruit</SelectGroupLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectGroupLabel>Staples</SelectGroupLabel>
                <SelectItem value="bread">Bread</SelectItem>
                <SelectItem value="rice" disabled>
                  Rice
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Example>

      <Example
        title="Disabled"
        code={`<Select items={fruits} disabled>
  <SelectTrigger aria-label="Fruit">
    <SelectValue placeholder="Unavailable" />
  </SelectTrigger>
  …
</Select>`}
      >
        <div className="w-full max-w-xs">
          <Select items={fruits} disabled>
            <SelectTrigger aria-label="Fruit">
              <SelectValue placeholder="Unavailable" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Example>

      <PropsTable rows={rows} />
    </>
  );
}
