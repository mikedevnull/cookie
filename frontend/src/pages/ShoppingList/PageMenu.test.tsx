import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageMenu } from "./PageMenu";
import userEvent from "@testing-library/user-event";

test("Renders correct icon button when value is truthy", async () => {
  const user = userEvent.setup();
  const mockCallback = vi.fn();
  render(<PageMenu showInactive={{ value: true, callback: mockCallback }} />);

  const button = await screen.findByTestId("RemoveDoneIcon");
  await user.click(button);

  expect(mockCallback).toHaveBeenCalledTimes(1);
  expect(mockCallback).toHaveBeenCalledWith(false);
});

test("Renders correct icon button when value is falsy", async () => {
  const user = userEvent.setup();
  const mockCallback = vi.fn();
  render(<PageMenu showInactive={{ value: false, callback: mockCallback }} />);

  const button = await screen.findByTestId("DoneAllIcon");
  await user.click(button);

  expect(mockCallback).toHaveBeenCalledTimes(1);
  expect(mockCallback).toHaveBeenCalledWith(true);
});
