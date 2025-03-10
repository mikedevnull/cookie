import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { renderWithDb } from "@testing/render";
import { RouteObject, RouterProvider, createMemoryRouter } from "react-router";
import { Database, Item, createDatabase } from "@/db";
import AddItem from "./AddItem";
import { createAddItemAction } from "./action";

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

describe("AddItem page with database", function () {
  let db: Database;
  let router: ReturnType<typeof createMemoryRouter>;

  beforeEach(async function () {
    db = await createDatabase();
    setupTestData(db);
    const routes: RouteObject[] = [
      {
        path: "/add",
        element: <AddItem />,
        action: createAddItemAction(db.items),
      },
      { path: "/", element: <div></div> },
    ];
    router = createMemoryRouter(routes, { initialEntries: ["/add"] });

    renderWithDb(db, <RouterProvider router={router} />);
  });

  afterEach(async function () {
    await db?.remove();
  });

  test("Entering new item name adds item to database", async () => {
    const user = userEvent.setup();

    const input = await screen.findByLabelText("Add new or existing item");

    await expect(
      db.collections.items.findOne("Foobar").exec()
    ).resolves.toBeNull();

    await user.type(input, "Foobar");
    await user.type(input, "{Enter}");
    const newItem = await db.collections.items.findOne("Foobar").exec();
    expect(newItem).not.toBeNull();
    expect(newItem).toMatchObject({
      name: "Foobar",
      state: "active",
    } satisfies Partial<Item>);
    expect(router.state.location.pathname).toBe("/");
  });

  test("Entering existing item name updates item in database", async () => {
    const user = userEvent.setup();

    const input = await screen.findByLabelText("Add new or existing item");

    await user.type(input, "testItem1");
    await user.type(input, "{Enter}");

    const updatedItem = await db.collections.items.findOne("testItem1").exec();
    expect(updatedItem).not.toBeNull();
    expect(updatedItem).toMatchObject({
      name: "testItem1",
      state: "active",
    } satisfies Partial<Item>);
    expect(router.state.location.pathname).toBe("/");
  });

  test("Typing new item and clicking add button adds item to database", async () => {
    const user = userEvent.setup();

    const input = await screen.findByLabelText("Add new or existing item");
    const button = await screen.findByRole("button", { name: "add" });
    await expect(
      db.collections.items.findOne("Foobar").exec()
    ).resolves.toBeNull();

    await user.type(input, "Foobar");
    await user.click(button);
    const newItem = await db.collections.items.findOne("Foobar").exec();
    expect(newItem).not.toBeNull();
    expect(newItem).toMatchObject({
      name: "Foobar",
      state: "active",
    } satisfies Partial<Item>);
    expect(router.state.location.pathname).toBe("/");
  });

  test("Click back icon button redirects to main page", async () => {
    const user = userEvent.setup();
    const button = await screen.findByRole("link", { name: "back" });

    await user.click(button);
    expect(router.state.location.pathname).toBe("/");
  });

  test("Clicking on existing item updates item in database", async () => {
    const user = userEvent.setup();
    const item = await screen.findByText("testItem1");

    await user.click(item);
    const dbItem = await db.collections.items.findOne("testItem1").exec();
    expect(dbItem).not.toBeNull();
    expect(dbItem).toMatchObject({
      name: "testItem1",
      state: "active",
    } satisfies Partial<Item>);
    expect(router.state.location.pathname).toBe("/");
  });
});
