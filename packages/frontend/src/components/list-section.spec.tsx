import { createDatabase, type Database } from "../db/database";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { renderWithDb } from "../../test/render";
import { ListSection } from "./list-section";

async function setupTestData(db: Database) {

    const collection = db.collections.items;
    await db.collections.items.bulkInsert([
        {
            id: collection.schema.getPrimaryOfDocumentData({ name: "testItem1", listId: "0" }),
            name: "testItem1",
            listId: "0",
            checked: false,
            category: "categoryA",
            rankOrder: 100,
        },
        {
            id: collection.schema.getPrimaryOfDocumentData({ name: "testItem2", listId: "0" }),
            name: "testItem2",
            listId: "0",
            checked: true,
            category: "categoryA",
            rankOrder: 200,
        }, {
            id: collection.schema.getPrimaryOfDocumentData({ name: "testItem3", listId: "0" }),
            name: "testItem3",
            listId: "0",
            checked: true,
            category: "categoryB",
            rankOrder: 300,
        }, {
            id: collection.schema.getPrimaryOfDocumentData({ name: "testItem4", listId: "0" }),
            name: "testItem4",
            listId: "0",
            checked: false,
            category: "categoryA",
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

    it('Renders a list of all items in the database for a category', async () => {
        const screen = await renderWithDb(db, <ListSection shoplistId="0" categoryId="categoryA" showCompleted={true} />)
        const items = screen.getByRole("listitem").all();
        expect(items.length).to.be.eq(3)
        const labels = items.map(i => i.getByRole('textbox').element().getAttribute("value"));
        expect(labels).to.have.members(['testItem1', 'testItem2', 'testItem4'])
    })

    it('Renders a list of only done items when show completed is disabled', async () => {
        const screen = await renderWithDb(db, <ListSection shoplistId="0" categoryId="categoryA" showCompleted={false} />)
        const items = screen.getByRole("listitem").all();
        expect(items.length).to.be.eq(2)
        const labels = items.map(i => i.getByRole('textbox').element().getAttribute("value"));
        expect(labels).to.have.members(['testItem1', 'testItem4'])
    })
})