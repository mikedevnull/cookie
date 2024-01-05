import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import ShoppingList from "./ShoppingList";
import userEvent from "@testing-library/user-event";
import { Database } from "@/db";
import { DbTestContext } from "@testing/setup";

async function setupTestData(db: Database) {
  await db.collections.items.bulkInsert([
    {
      name: "testItem1",
      active: false,
    },
    {
      name: "testItem2",
      active: true,
    },
    {
      name: "testItem3",
      active: true,
    },
  ]);
}

test<DbTestContext>("Render items in database", async ({ db, render }) => {
  await setupTestData(db);

  render(<ShoppingList />);

  await screen.findAllByRole("listitem");

  const items = await screen.getAllByRole("listitem");
  expect(items.length).toBe(2);
  expect(items.at(0)).toHaveTextContent("testItem2");
  expect(items.at(1)).toHaveTextContent("testItem3");
});

test<DbTestContext>("Clicking an item toggles state in database", async ({
  db,
  render,
}) => {
  await setupTestData(db);

  render(<ShoppingList />);

  await screen.findByText("testItem2");

  const item = screen.getByText("testItem2");
  assert(item !== undefined);
  const removalFinished = waitForElementToBeRemoved(
    screen.getByText("testItem2")
  );
  await userEvent.click(item);
  await removalFinished;
});

test<DbTestContext>("Removal from database removes from list", async ({
  db,
  render,
}) => {
  await setupTestData(db);

  render(<ShoppingList />);

  await screen.findByText("testItem2");

  const removalFinished = waitForElementToBeRemoved(
    screen.getByText("testItem2")
  );

  await db.collections.items.findOne("testItem2").remove();
  await removalFinished;
});

test<DbTestContext>("Empty list displays message", async ({ render }) => {
  render(<ShoppingList />);
  const notifyText = await screen.findByText("The list is currently empty.");
  expect(notifyText).toBeInTheDocument();
});
