import { act, render, screen, waitFor } from "@testing-library/react";
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

test("Enter text and press enter submits and resets", async () => {
  const submit = jest.fn();

  render(<AddItemTextField submitValue={submit} />);

  const input =
    await screen.findByPlaceholderText<HTMLInputElement>("Add item");
  expect(input).toBeInTheDocument();

  await user.type(input, "Foobar");
  expect(input.value).toBe("Foobar");
  await user.type(input, "{Enter}");
  await waitFor(() => expect(input.value).toBe(""));

  expect(submit).toHaveBeenCalledTimes(1);
  expect(submit).toHaveBeenCalledWith("Foobar");
});

test("Does use default value as text", async () => {
  render(<AddItemTextField defaultValue="MyNiceValue" />);

  const input =
    await screen.findByPlaceholderText<HTMLInputElement>("Add item");
  expect(input).toBeInTheDocument();
  expect(input.value).toBe("MyNiceValue");
});

test("Does not submit on empty texts", async () => {
  const submit = jest.fn();

  render(<AddItemTextField submitValue={submit} />);
  const input =
    await screen.findByPlaceholderText<HTMLInputElement>("Add item");
  expect(input).toBeInTheDocument();

  await user.type(input, "{Enter}");
  expect(submit).not.toHaveBeenCalled();
});

test("Updates search input with more than three character entered", async () => {
  const mockSearchCallback = jest.fn();

  render(<AddItemTextField searchFilterCallback={mockSearchCallback} />);
  const input = await screen.findByPlaceholderText("Add item");
  await user.type(input, "123");

  act(() => jest.advanceTimersByTime(100));
  expect(mockSearchCallback).not.toHaveBeenCalled();
});

test("Updates search input with more than three character entered", async () => {
  const mockSearchCallback = jest.fn();

  render(<AddItemTextField searchFilterCallback={mockSearchCallback} />);

  const input = await screen.findByPlaceholderText("Add item");
  await user.type(input, "123");

  await user.type(input, "45");
  act(() => jest.advanceTimersByTime(50));
  await user.type(input, "67");

  act(() => jest.runOnlyPendingTimers());
  expect(mockSearchCallback).toHaveBeenCalledTimes(1);
  expect(mockSearchCallback).toHaveBeenCalledWith("1234567");
});

test("Clicking the clear icon removes all input text", async () => {
  const mockSearchCallback = jest.fn();

  render(<AddItemTextField searchFilterCallback={mockSearchCallback} />);

  const input =
    await screen.findByPlaceholderText<HTMLInputElement>("Add item");
  const clearButton = await screen.findByTestId("input-clear-button");
  await user.type(input, "123");

  await user.click(clearButton);
  act(() => jest.advanceTimersByTime(400));

  expect(input.value).toBe("");
  expect(mockSearchCallback).toHaveBeenCalled();
  expect(mockSearchCallback).toHaveBeenLastCalledWith("");
});
