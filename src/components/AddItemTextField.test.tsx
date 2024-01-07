import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import AddItemTextField from "./AddItemTextField";

function sleepForMs(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

test("Enter text and press enter submits and resets", async () => {
  const user = userEvent.setup();
  const submit = vi.fn();

  render(<AddItemTextField submitValue={submit} />);

  const input = await screen.findByLabelText<HTMLInputElement>("Add item");
  expect(input).toBeInTheDocument();

  await user.type(input, "Foobar");
  expect(input.value).toBe("Foobar");
  await user.type(input, "{Enter}");
  await waitFor(() => expect(input.value).toBe(""));

  expect(submit).toHaveBeenCalledOnce();
  expect(submit).toHaveBeenCalledWith("Foobar");
});

test("Does use default value as text", async () => {
  render(<AddItemTextField defaultValue="MyNiceValue" />);

  const input = await screen.findByLabelText<HTMLInputElement>("Add item");
  expect(input).toBeInTheDocument();
  expect(input.value).toBe("MyNiceValue");
});

test("Does not submit on empty texts", async () => {
  const user = userEvent.setup();
  const submit = vi.fn();

  render(<AddItemTextField submitValue={submit} />);
  const input = await screen.findByLabelText<HTMLInputElement>("Add item");
  expect(input).toBeInTheDocument();

  await user.type(input, "{Enter}");
  expect(submit).not.toHaveBeenCalled();
});

test("Updates search input with more than three character entered", async () => {
  const user = userEvent.setup();
  const mockSearchCallback = vi.fn();

  render(<AddItemTextField searchFilterCallback={mockSearchCallback} />);
  const input = await screen.findByLabelText("Add item");
  await user.type(input, "123");

  // wait for any debounce interval to happen
  await sleepForMs(100);
  expect(mockSearchCallback).not.toHaveBeenCalled();
});

test("Updates search input with more than three character entered", async () => {
  const user = userEvent.setup();
  const mockSearchCallback = vi.fn();

  render(<AddItemTextField searchFilterCallback={mockSearchCallback} />);

  const input = await screen.findByLabelText("Add item");
  await user.type(input, "123");

  await user.type(input, "45");
  await sleepForMs(50);
  await user.type(input, "67");

  await sleepForMs(400);
  expect(mockSearchCallback).toHaveBeenCalledOnce();
  expect(mockSearchCallback).toHaveBeenCalledWith("1234567");
});
