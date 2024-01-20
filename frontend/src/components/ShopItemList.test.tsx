import { screen, render, act } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { Item } from "@/db";

import ShopItemList from "./ShopItemList";

const testItem1: Item = {
  name: "Some item",
  active: false,
  rankOrder: 0,
};
const testItem2: Item = {
  name: "Another item",
  active: true,
  rankOrder: 0,
};
const testItem3: Item = {
  name: "Third item",
  active: true,
  rankOrder: 0,
};
const testItem4: Item = {
  name: "Item item",
  active: false,
  rankOrder: 0,
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
describe("ShopItemList user interaction", () => {
  let user: UserEvent;
  beforeEach(() => {
    jest.useFakeTimers();
    user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  });

  afterEach(() => {
    act(() => jest.runOnlyPendingTimers());
    jest.useRealTimers();
  });

  test("click on item in list triggeres callback with item", async () => {
    const mockCallback = jest.fn();
    render(
      <ShopItemList items={testItems} itemSelectedCallback={mockCallback} />
    );

    const item2 = await screen.findByLabelText(testItem2.name);

    await user.click(item2);
    act(() => jest.runOnlyPendingTimers());
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(testItem2);

    mockCallback.mockReset();

    const item3 = await screen.findByLabelText(testItem3.name);

    await user.click(item3);
    act(() => jest.runOnlyPendingTimers());
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(testItem3);
  });
});
