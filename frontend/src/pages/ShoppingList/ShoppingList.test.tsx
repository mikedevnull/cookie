import {
  screen,
  waitForElementToBeRemoved,
  findByText,
} from "@testing-library/react";
import ShoppingList from "./ShoppingList";
import { userEvent } from "@testing-library/user-event";
import { Database, createDatabase } from "@/db";
import { renderWithDb } from "@testing/render";
import { MemoryRouter } from "react-router";

async function setupTestData(db: Database) {
  await db.collections.items.bulkInsert([
    {
      name: "testItem1",
      state: "hidden",
      rankOrder: 0,
    },
    {
      name: "testItem2",
      state: "active",
      rankOrder: 0,
    },
    {
      name: "testItem3",
      state: "active",
      rankOrder: 0,
    },
    {
      name: "testItem4",
      state: "active",
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
    renderWithDb(
      db,
      <MemoryRouter>
        <ShoppingList />
      </MemoryRouter>
    );

    const items = await screen.findAllByRole("listitem");

    expect(items.length).toBe(3);
    expect(items.at(0)).toHaveTextContent("testItem2");
    expect(items.at(1)).toHaveTextContent("testItem3");
    expect(items.at(2)).toHaveTextContent("testItem4");
  });

  test("Removal from database removes from list", async () => {
    await setupTestData(db);
    renderWithDb(
      db,
      <MemoryRouter>
        <ShoppingList />
      </MemoryRouter>
    );

    await screen.findByText("testItem2");

    const removalFinished = waitForElementToBeRemoved(
      screen.getByText("testItem2")
    );

    await db.collections.items.findOne("testItem2").remove();
    await removalFinished;
  });

  test("Empty list displays message", async () => {
    renderWithDb(
      db,
      <MemoryRouter>
        <ShoppingList />
      </MemoryRouter>
    );

    const notifyText = await screen.findByText("The list is currently empty.");
    expect(notifyText).toBeInTheDocument();
  });

  test("Clicking an item toggles state in database", async () => {
    const user = userEvent.setup();
    await setupTestData(db);
    renderWithDb(
      db,
      <MemoryRouter>
        <ShoppingList />
      </MemoryRouter>
    );

    const item = await screen.findByText("testItem2");

    expect(item).not.toBeUndefined();
    expect(item).toBeInTheDocument();

    await user.click(item);
    await waitForElementToBeRemoved(item, {
      timeout: 1500,
    });
    const dbItem = await db.collections.items.findOne("testItem2").exec();
    expect(dbItem?.state).toBe("done");
  });

  test("Items move first to done section and disappears when clicked two times", async () => {
    await setupTestData(db);
    renderWithDb(
      db,
      <MemoryRouter>
        <ShoppingList />
      </MemoryRouter>
    );

    const mainList = await screen.findByTestId("main-list");
    const item = await findByText(mainList, "testItem2");
    await userEvent.click(item);
    await waitForElementToBeRemoved(item, {
      timeout: 1500,
    });
    const dbItem = await db.collections.items.findOne("testItem2").exec();
    expect(dbItem?.state).toBe("done");

    const doneList = await screen.findByTestId("done-list");
    const doneItem = await findByText(doneList, "testItem2");
    expect(doneItem).toBeInTheDocument();

    const removeDone = screen.getByRole("button", {
      name: "remove done items",
    });
    expect(removeDone).toBeInTheDocument();
    await userEvent.click(removeDone);

    const dbItem2 = await db.collections.items.findOne("testItem2").exec();
    expect(dbItem2?.state).toBe("hidden");
  });
});
