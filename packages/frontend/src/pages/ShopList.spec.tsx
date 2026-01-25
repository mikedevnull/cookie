import { createDatabase, type Database } from "../db/database";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { renderWithDb } from "../../test/render";
import ShopList from "./ShopList";

async function setupTestData(db: Database) {
    await db.collections.itemLists.insert({ id: "0", label: "TestList", categories: [] })
    const collection = db.collections.items;
    await db.collections.items.bulkInsert([
        {
            id: collection.schema.getPrimaryOfDocumentData({ name: "testItem1", listId: "0" }),
            name: "testItem1",
            listId: "0",
            checked: false,
            category: "",
            rankOrder: 100,
        },
        {
            id: collection.schema.getPrimaryOfDocumentData({ name: "testItem2", listId: "0" }),
            name: "testItem2",
            listId: "0",
            checked: true,
            category: "",
            rankOrder: 200,
        }, {
            id: collection.schema.getPrimaryOfDocumentData({ name: "testItem3", listId: "0" }),
            name: "testItem3",
            listId: "0",
            checked: true,
            category: "",
            rankOrder: 300,
        }, {
            id: collection.schema.getPrimaryOfDocumentData({ name: "testItem4", listId: "0" }),
            name: "testItem4",
            listId: "0",
            checked: false,
            category: "",
            rankOrder: 400,
        }

    ]);

}

describe("ShoppingList page with database", function () {
    let db: Database;

    beforeEach(async function () {
        const storage = wrappedValidateAjvStorage({ storage: getRxStorageMemory() });
        db = await createDatabase({ storage });
        await setupTestData(db);
    });

    afterEach(async function () {
        await db?.remove();
    });

    it('Renders a list of all items in the database', async () => {
        const screen = await renderWithDb(db, <ShopList />)
        const items = screen.getByRole("listitem").all();
        expect(items.length).to.be.eq(4)
        const labels = items.map(i => i.getByRole('textbox').element().getAttribute("value"));
        expect(labels).to.have.members(['testItem1', 'testItem2', 'testItem3', 'testItem4'])
    })

    it('Renders a list of only done items when menu item toggled', async () => {
        const screen = await renderWithDb(db, <ShopList />)
        await screen.getByLabelText('Page menu toggle').click()
        await screen.getByText('Hide completed items').click();
        const main = screen.getByRole("main");
        const items = main.getByRole('listitem').all();
        expect(items.length).to.be.eq(2)
        const labels = items.map(i => i.getByRole('textbox').element().getAttribute("value"));
        expect(labels).to.have.members(['testItem1', 'testItem4'])
        expect(screen.getByText('Show completed items')).toBeInTheDocument()
    })
})