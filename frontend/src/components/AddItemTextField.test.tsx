import { vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import AddItemTextField from "./AddItemTextField";

describe("AddItemTextField", () => {
  let user: UserEvent;
  beforeEach(() => {
    vi.useFakeTimers();
    user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  });

  afterEach(() => {
    act(() => vi.runOnlyPendingTimers());
    vi.useRealTimers();
  });

  test("Does use value as text", async () => {
    const value = { name: "MyNiceValue" };
    const setValue = vi.fn();
    render(<AddItemTextField value={value} setValue={setValue} options={[]} />);

    const input = await screen.findByLabelText<HTMLInputElement>(
      "Add new or existing item"
    );
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("MyNiceValue");
  });

  test("Clicking the clear icon removes all input text", async () => {
    const value = { name: "123" };
    const setValue = vi.fn();

    render(<AddItemTextField value={value} setValue={setValue} options={[]} />);

    const clearButton = await screen.findByLabelText("Clear");

    await user.click(clearButton);

    expect(setValue).toHaveBeenCalled();
    expect(setValue).toHaveBeenLastCalledWith(null);
  });
});
