import { getAllByRole, getByText, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import { render } from "../../tests/render";
import ItemList from "./ItemList";
import ListItemClasses from "./ListItem.module.css";
import { Item } from "./ListItem";

const testItem1: Item = {
  name: "Some item",
  marked: false,
};
const testItem2: Item = {
  name: "Another item",
  marked: true,
};
const testItem3: Item = {
  name: "Third item",
  marked: true,
};
const testItem4: Item = {
  name: "Item item",
  marked: false,
};

const testItems = [testItem1, testItem2, testItem3, testItem4];

test("displays list of items with correct state", async () => {
  render(<ItemList items={testItems} />);

  const itemlist = await screen.findByRole("list");

  expect(getByText(itemlist, testItem1.name)).toBeDefined;
  expect(getByText(itemlist, testItem1.name)).not.toHaveClass(
    ListItemClasses.selected
  );
  expect(getByText(itemlist, testItem2.name)).toBeDefined;
  expect(getByText(itemlist, testItem2.name)).toHaveClass(
    ListItemClasses.selected
  );
  expect(getByText(itemlist, testItem3.name)).toBeDefined;
  expect(getByText(itemlist, testItem3.name)).toHaveClass(
    ListItemClasses.selected
  );
  expect(getByText(itemlist, testItem4.name)).toBeDefined;
  expect(getByText(itemlist, testItem4.name)).not.toHaveClass(
    ListItemClasses.selected
  );

  expect(getAllByRole(itemlist, "listitem")).toHaveLength(testItems.length);
});

test("click on item in list triggeres callback with item", async () => {
  const user = userEvent.setup();
  const mockCallback = vi.fn();
  render(<ItemList items={testItems} itemClicked={mockCallback} />);

  const itemlist = await screen.findByRole("list");
  const item2 = getByText(itemlist, testItem2.name);

  await user.click(item2);
  expect(mockCallback).toHaveBeenCalledOnce();
  expect(mockCallback).toHaveBeenCalledWith(testItem2);

  mockCallback.mockReset();

  const item3 = getByText(itemlist, testItem3.name);

  await user.click(item3);
  expect(mockCallback).toHaveBeenCalledOnce();
  expect(mockCallback).toHaveBeenCalledWith(testItem3);
});
