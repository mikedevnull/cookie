import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import AddItemInput from "./AddItemInput";
import { DbTestContext } from "@testing/setup";

test<DbTestContext>("Entering text and enter will trigger callback", async ({
  render,
}) => {
  const user = userEvent.setup();
  const mockCallback = vi.fn();
  render(<AddItemInput addItemCallback={mockCallback} />);

  const input = await screen.findByPlaceholderText("Add item");
  expect(input).toBeDefined();

  await user.type(input, "Foobar");
  await user.type(input, "{Enter}");
  expect(input).toHaveValue("");
  expect(mockCallback).toHaveBeenCalledOnce();
  expect(mockCallback).toHaveBeenCalledWith("Foobar");
});
