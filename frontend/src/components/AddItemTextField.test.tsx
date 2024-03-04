import { act, render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import AddItemTextField from "./AddItemTextField";

let user: UserEvent;
beforeEach(() => {
  jest.useFakeTimers();
  user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
});

afterEach(() => {
  act(() => jest.runOnlyPendingTimers());
  jest.useRealTimers();
});

test("Does use value as text", async () => {
  const value = { name: "MyNiceValue" };
  const setValue = jest.fn();
  render(<AddItemTextField value={value} setValue={setValue} options={[]} />);

  const input = await screen.findByLabelText<HTMLInputElement>(
    "Add new or existing item"
  );
  expect(input).toBeInTheDocument();
  expect(input.value).toBe("MyNiceValue");
});

test("Clicking the clear icon removes all input text", async () => {
  const value = { name: "123" };
  const setValue = jest.fn();

  render(<AddItemTextField value={value} setValue={setValue} options={[]} />);

  const clearButton = await screen.findByLabelText("Clear");

  await user.click(clearButton);

  expect(setValue).toHaveBeenCalled();
  expect(setValue).toHaveBeenLastCalledWith(null);
});
