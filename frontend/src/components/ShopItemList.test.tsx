import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Item } from "@/db";

import ShopItemList from "./ShopItemList";

const testItem1: Item = {
  name: "Some item",
  active: false,
};
const testItem2: Item = {
  name: "Another item",
  active: true,
};
const testItem3: Item = {
  name: "Third item",
  active: true,
};
const testItem4: Item = {
  name: "Item item",
  active: false,
};

const testItems = [testItem1, testItem2, testItem3, testItem4];

test("displays list of items with correct state", async () => {
  render(<ShopItemList items={testItems} />);

  for (const item of testItems) {
    const domItem = screen.getByLabelText<HTMLInputElement>(item.name);
    expect(domItem).toBeInTheDocument();
    expect(domItem.checked).toStrictEqual(!item.active);
  }

  expect(screen.getAllByRole("listitem")).toHaveLength(testItems.length);
});

test("click on item in list triggeres callback with item", async () => {
  const user = userEvent.setup();
  const mockCallback = jest.fn();
  render(
    <ShopItemList items={testItems} itemSelectedCallback={mockCallback} />
  );

  const item2 = await screen.findByLabelText(testItem2.name);

  await user.click(item2);
  expect(mockCallback).toHaveBeenCalledTimes(1);
  expect(mockCallback).toHaveBeenCalledWith(testItem2);

  mockCallback.mockReset();

  const item3 = await screen.findByLabelText(testItem3.name);

  await user.click(item3);
  expect(mockCallback).toHaveBeenCalledTimes(1);
  expect(mockCallback).toHaveBeenCalledWith(testItem3);
});
