import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { violationsIn } from "../../../test/axe";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

const fruits = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
];

function Demo(props: React.ComponentProps<typeof Select<string>> = {}) {
  return (
    <Select items={fruits} {...props}>
      <SelectLabel>Fruit</SelectLabel>
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
  );
}

describe("Select", () => {
  it("shows the placeholder, is named by its label, and keeps the list closed", () => {
    render(<Demo />);
    const trigger = screen.getByRole("combobox", { name: /Fruit/ });
    expect(trigger).toHaveTextContent("Pick a fruit");
    expect(trigger).toHaveClass("gu-select__trigger");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("opens a listbox of options and selects with a click", async () => {
    const onValueChange = vi.fn();
    render(<Demo onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("combobox"));
    const list = await screen.findByRole("listbox");
    expect(within(list).getAllByRole("option")).toHaveLength(3);
    await userEvent.click(within(list).getByRole("option", { name: "Banana" }));
    expect(onValueChange).toHaveBeenCalledWith("banana", expect.anything());
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    expect(screen.getByRole("combobox")).toHaveTextContent("Banana");
  });

  it("marks the selected option", async () => {
    render(<Demo defaultValue="cherry" />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Cherry");
    await userEvent.click(screen.getByRole("combobox"));
    expect(await screen.findByRole("option", { name: "Cherry" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: "Apple" })).toHaveAttribute("aria-selected", "false");
  });

  it("is operable with the keyboard", async () => {
    render(<Demo />);
    await userEvent.tab();
    expect(screen.getByRole("combobox")).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await screen.findByRole("listbox");
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    expect(screen.getByRole("combobox")).toHaveTextContent(/Apple|Banana|Cherry/);
    expect(screen.getByRole("combobox")).not.toHaveTextContent("Pick a fruit");
  });

  it("closes with Escape without changing the value", async () => {
    render(<Demo defaultValue="apple" />);
    await userEvent.click(screen.getByRole("combobox"));
    await screen.findByRole("listbox");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    expect(screen.getByRole("combobox")).toHaveTextContent("Apple");
  });

  it("submits the chosen value with a form", async () => {
    let submitted: FormData | undefined;
    render(
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitted = new FormData(e.currentTarget);
        }}
      >
        <Demo name="fruit" defaultValue="apple" />
        <button type="submit">Go</button>
      </form>,
    );
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(await screen.findByRole("option", { name: "Cherry" }));
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(submitted?.get("fruit")).toBe("cherry");
  });

  it("disabled does not open", async () => {
    render(<Demo disabled />);
    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(screen.getByRole("combobox")).toHaveAttribute("data-disabled");
  });

  it("supports groups", async () => {
    render(
      <Select items={fruits}>
        <SelectTrigger aria-label="Fruit">
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectGroupLabel>Common</SelectGroupLabel>
            <SelectItem value="apple">Apple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>,
    );
    await userEvent.click(screen.getByRole("combobox"));
    const group = await screen.findByRole("group", { name: "Common" });
    expect(within(group).getByRole("option", { name: "Apple" })).toBeInTheDocument();
  });

  it("has no axe violations closed and open", async () => {
    const { baseElement } = render(<Demo />);
    expect(await violationsIn(baseElement)).toEqual([]);
    await userEvent.click(screen.getByRole("combobox"));
    await screen.findByRole("listbox");
    expect(await violationsIn(baseElement)).toEqual([]);
  });
});
