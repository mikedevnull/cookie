import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import AddItemTextField from "./AddItemTextField";
import { useState } from "react";

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

  type Props = {
    submitValue?: (arg: string) => void;
  };

  const WrappedAddItemTextField = ({ submitValue }: Props) => {
    const [value, setValue] = useState<string>("");
    return (
      <AddItemTextField
        value={value}
        onChange={setValue}
        submitValue={submitValue}
      />
    );
  };

  render(<WrappedAddItemTextField submitValue={submit} />);

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

test("Does use value as text", async () => {
  const value = "MyNiceValue";
  const setValue = jest.fn();
  render(<AddItemTextField value={value} onChange={setValue} />);

  const input =
    await screen.findByPlaceholderText<HTMLInputElement>("Add item");
  expect(input).toBeInTheDocument();
  expect(input.value).toBe("MyNiceValue");
});

test("Does not submit on empty texts", async () => {
  const submit = jest.fn();
  const value = "";
  const setValue = jest.fn();

  render(
    <AddItemTextField value={value} onChange={setValue} submitValue={submit} />
  );
  const input =
    await screen.findByPlaceholderText<HTMLInputElement>("Add item");
  expect(input).toBeInTheDocument();

  await user.type(input, "{Enter}");
  expect(submit).not.toHaveBeenCalled();
});

test("Clicking the clear icon removes all input text", async () => {
  const value = "123";
  const setValue = jest.fn();

  render(<AddItemTextField value={value} onChange={setValue} />);

  const clearButton = await screen.findByTestId("input-clear-button");

  await user.click(clearButton);

  expect(setValue).toHaveBeenCalled();
  expect(setValue).toHaveBeenLastCalledWith("");
});
