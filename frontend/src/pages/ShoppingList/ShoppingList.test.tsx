import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import ShoppingList from "./ShoppingList";
import { userEvent } from "@testing-library/user-event";
import { Database, createDatabase } from "@/db";
import { renderWithDb } from "@testing/render";
import { describe, expect, test, beforeEach, afterEach } from "@jest/globals";

async function setupTestData(db: Database) {
  await db.collections.items.bulkInsert([
    {
      name: "testItem1",
      active: false,
      rankOrder: 0,
    },
    {
      name: "testItem2",
      active: true,
      rankOrder: 0,
    },
    {
      name: "testItem3",
      active: true,
      rankOrder: 0,
    },
    {
      name: "testItem4",
      active: true,
      rankOrder: 0,
    },
  ]);
}

describe("ShoppingList with database", function () {
  let db: Database;

  beforeEach(async function () {
    db = await createDatabase();
  });

  afterEach(async function () {
    await db?.remove();
  });

  test("Render items in database", async () => {
    await setupTestData(db);
    renderWithDb(db, <ShoppingList />);

    const items = await screen.findAllByRole("listitem");

    expect(items.length).toBe(3);
    expect(items.at(0)).toHaveTextContent("testItem2");
    expect(items.at(1)).toHaveTextContent("testItem3");
    expect(items.at(2)).toHaveTextContent("testItem4");
  });

  test("Removal from database removes from list", async () => {
    await setupTestData(db);
    renderWithDb(db, <ShoppingList />);

    await screen.findByText("testItem2");

    const removalFinished = waitForElementToBeRemoved(
      screen.getByText("testItem2")
    );

    await db.collections.items.findOne("testItem2").remove();
    await removalFinished;
  });

  test("Empty list displays message", async () => {
    renderWithDb(db, <ShoppingList />);

    const notifyText = await screen.findByText("The list is currently empty.");
    expect(notifyText).toBeInTheDocument();
  });

  test("Entering new item name adds item to database", async () => {
    const user = userEvent.setup();

    renderWithDb(db, <ShoppingList />);
    const addButton = await screen.findByLabelText("add");
    await user.click(addButton);
    const input = await screen.findByLabelText("Add new or existing item");

    await expect(
      db.collections.items.findOne("Foobar").exec()
    ).resolves.toBeNull();

    await user.type(input, "Foobar");
    await user.type(input, "{Enter}");
    const newItem = await db.collections.items.findOne("Foobar").exec();
    expect(newItem).not.toBeNull();
    expect(newItem).toMatchObject({ name: "Foobar", active: true });
  });

  test("Entering existing item name updates item in database", async () => {
    const user = userEvent.setup();

    renderWithDb(db, <ShoppingList />);
    const addButton = await screen.findByLabelText("add");
    await user.click(addButton);
    const input = await screen.findByLabelText("Add new or existing item");

    await user.type(input, "testItem1");
    await user.type(input, "{Enter}");

    const updatedItem = await db.collections.items.findOne("testItem1").exec();
    expect(updatedItem).not.toBeNull();
    expect(updatedItem).toMatchObject({ name: "testItem1", active: true });
  });

  test("Clicking an item toggles state in database", async () => {
    const user = userEvent.setup();
    await setupTestData(db);
    renderWithDb(db, <ShoppingList />);

    const item = await screen.findByText("testItem2");

    expect(item).not.toBeUndefined;
    expect(item).toBeInTheDocument();

    await user.click(item);
    await waitForElementToBeRemoved(item, {
      timeout: 1500,
    });
  });
});
