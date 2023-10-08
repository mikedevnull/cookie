import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { render } from "../../../tests/render";
import AddItemInput from "./AddItemInput";
import { Database, initialize } from "@/db";
import { Provider } from "rxdb-hooks";

interface DbTestContext {
  db: Database;
}

beforeEach<DbTestContext>(async (context) => {
  context.db = await initialize();
});

test<DbTestContext>("Entering text and enter will trigger callback", async ({
  db,
}) => {
  const user = userEvent.setup();
  const mockCallback = vi.fn();
  render(
    <Provider db={db}>
      <AddItemInput addItemCallback={mockCallback} />
    </Provider>
  );

  const input = await screen.findByPlaceholderText("Add item");
  expect(input).toBeDefined();

  await user.type(input, "Foobar");
  await user.type(input, "{Enter}");
  expect(input).toHaveValue("");
  expect(mockCallback).toHaveBeenCalledOnce();
  expect(mockCallback).toHaveBeenCalledWith("Foobar");
});
