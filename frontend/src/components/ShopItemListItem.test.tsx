import { vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import ShopItemListItem from "./ShopItemListItem";
import userEvent, { UserEvent } from "@testing-library/user-event";

describe("ShopItemListItem", () => {
  let user: UserEvent;

  beforeEach(() => {
    vi.useFakeTimers();
    user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  });
  afterEach(() => {
    act(() => vi.runOnlyPendingTimers());
    vi.useRealTimers();
  });

  it("Should render active items correctly", () => {
    const renderedItem = render(<ShopItemListItem name="Foo" active={true} />);
    expect(renderedItem).toMatchSnapshot();
  });

  it("Should render inactive items correctly", () => {
    const renderedItem = render(<ShopItemListItem name="Foo" active={false} />);
    expect(renderedItem).toMatchSnapshot();
  });

  it("Clicking an active item should change appearence to inactive immediately", async () => {
    render(<ShopItemListItem name="Foo" active={true} />);
    const listItem = await screen.findByText("Foo");
    await user.click(listItem);
    const checkBox = await screen.findByLabelText<HTMLInputElement>("Foo");
    expect(checkBox.checked).toBeTruthy();
  });

  it("Clicking an inactive item should change appearence to active immediately", async () => {
    render(<ShopItemListItem name="Foo" active={false} />);
    const listItem = await screen.findByText("Foo");
    await user.click(listItem);
    const checkBox = await screen.findByLabelText<HTMLInputElement>("Foo");
    expect(checkBox.checked).toBeFalsy();
  });

  it("Clicking an item should invoke toggle callback after delay", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    vi.useFakeTimers();
    const cb = vi.fn();
    render(<ShopItemListItem name="Foo" active={true} onToggle={cb} />);

    const listItem = await screen.findByText("Foo");
    await user.click(listItem);
    expect(cb).not.toHaveBeenCalled();

    act(() => vi.runOnlyPendingTimers());
    expect(cb).toHaveBeenCalled();
  });

  it("Clicking an item twice withing a short timefreame should invoke not invoke callback", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    vi.useFakeTimers();
    const cb = vi.fn();
    render(<ShopItemListItem name="Foo" active={true} onToggle={cb} />);

    const listItem = await screen.findByText("Foo");
    await user.click(listItem);
    act(() => vi.advanceTimersByTime(100));

    expect(cb).not.toHaveBeenCalled();

    await user.click(listItem);

    act(() => vi.runOnlyPendingTimers());
    expect(cb).not.toHaveBeenCalled();
  });
});
