import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import AddItemSection from "./AddItemSection";
import { DbTestContext } from "@testing/setup";

test<DbTestContext>("Adds new items to the database", async ({
  db,
  render,
}) => {
  const user = userEvent.setup();

  render(<AddItemSection />);

  await expect(
    db.collections.items.findOne("Foobar").exec()
  ).resolves.toBeNull();

  const input = await screen.findByLabelText("Add item");
  expect(input).toBeDefined();

  await user.type(input, "Foobar");
  await user.type(input, "{Enter}");
  const newItem = await db.collections.items.findOne("Foobar").exec();
  expect(newItem).not.toBeNull();
  expect(newItem).toMatchObject({ name: "Foobar", active: true });
});

test<DbTestContext>("Modifies existing items in the database", async ({
  db,
  render,
}) => {
  const user = userEvent.setup();

  render(<AddItemSection />);

  await db.collections.items.insert({ name: "Foobar", active: false });

  const input = await screen.findByLabelText("Add item");
  expect(input).toBeDefined();

  await user.type(input, "Foobar");
  await user.type(input, "{Enter}");
  const newItem = await db.collections.items.findOne("Foobar").exec();
  expect(newItem).toMatchObject({ name: "Foobar", active: true });
});
