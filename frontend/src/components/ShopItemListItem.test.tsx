import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ShopItemListItem from "./ShopItemListItem";
import userEvent, { UserEvent } from "@testing-library/user-event";

describe("ShopItemListItem", () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
  });
  afterEach(() => {});

  it("Should render active items correctly", () => {
    const renderedItem = render(<ShopItemListItem name="Foo" active={true} />);
    expect(renderedItem).toMatchSnapshot();
  });

  it("Should render inactive items correctly", () => {
    const renderedItem = render(<ShopItemListItem name="Foo" active={false} />);
    expect(renderedItem).toMatchSnapshot();
  });

  it("Clicking an item should invoke toggle callback immediately", async () => {
    const cb = vi.fn();
    render(<ShopItemListItem name="Foo" active={true} onToggle={cb} />);

    const listItem = await screen.findByText("Foo");
    await user.click(listItem);

    expect(cb).toHaveBeenCalled();
  });
});
