import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { render } from "@testing/render";
import { Database, initialize } from "@/db";
import { Provider } from "rxdb-hooks";
import AddItemSection from "./AddItemSection";

interface DbTestContext {
  db: Database;
}

beforeEach<DbTestContext>(async (context) => {
  context.db = await initialize();
});

afterEach<DbTestContext>(async (context) => {
  await context.db.remove();
});

test<DbTestContext>("Adds new items to the database", async ({ db }) => {
  const user = userEvent.setup();

  render(
    <Provider db={db}>
      <AddItemSection />
    </Provider>
  );

  await expect(
    db.collections.items.findOne("Foobar").exec()
  ).resolves.toBeNull();

  const input = await screen.findByPlaceholderText("Add item");
  expect(input).toBeDefined();

  await user.type(input, "Foobar");
  await user.type(input, "{Enter}");
  const newItem = await db.collections.items.findOne("Foobar").exec();
  expect(newItem).not.toBeNull();
  expect(newItem).toMatchObject({ name: "Foobar", active: true });
});

test<DbTestContext>("Modifies existing items in the database", async ({
  db,
}) => {
  const user = userEvent.setup();

  render(
    <Provider db={db}>
      <AddItemSection />
    </Provider>
  );

  await db.collections.items.insert({ name: "Foobar", active: false });

  const input = await screen.findByPlaceholderText("Add item");
  expect(input).toBeDefined();

  await user.type(input, "Foobar");
  await user.type(input, "{Enter}");
  const newItem = await db.collections.items.findOne("Foobar").exec();
  expect(newItem).toMatchObject({ name: "Foobar", active: true });
});
