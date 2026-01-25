import { createDatabase, type Database } from "../db/database";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { renderWithDb } from "../../test/render";
import ShopList from "./ShopList";

const { FakeListSection } = vi.hoisted(() => {
    return { FakeListSection: vi.fn((props) => { console.log(props); return <ul>{props.label}</ul> }) }
})

vi.mock(import('../components/list-section'), async () => ({
    ListSection: FakeListSection
}))



describe("ShoppingList page with database", function () {
    let db: Database;

    beforeEach(async function () {
        const storage = wrappedValidateAjvStorage({ storage: getRxStorageMemory() });
        db = await createDatabase({ storage });

    });

    afterEach(async function () {
        await db?.remove();
        FakeListSection.mockReset()
    });

    it('Renders section for each category in the database, plus an "other" section', async () => {
        await db.collections.itemLists.insert({ id: "0", label: "TestList", categories: [{ id: "categoryA", label: "A" }, { id: "categoryB", label: "B" }] })
        const screen = await renderWithDb(db, <ShopList />)
        const sections = screen.getByRole("list").all();
        expect(sections.length).to.be.eq(2 + 1)
        expect(FakeListSection).toHaveBeenCalledTimes(3);
        expect(FakeListSection).toHaveBeenCalledWith({ label: 'A', categoryId: 'categoryA', shoplistId: '0', showCompleted: true }, undefined)
        expect(FakeListSection).toHaveBeenCalledWith({ label: 'B', categoryId: 'categoryB', shoplistId: '0', showCompleted: true }, undefined)
        expect(FakeListSection).toHaveBeenCalledWith({ label: 'Other', categoryId: '', shoplistId: '0', showCompleted: true }, undefined)
    })

    it('If no other sections are defined, renders last section without heading', async () => {
        await db.collections.itemLists.insert({ id: "0", label: "TestList", categories: [] })
        const screen = await renderWithDb(db, <ShopList />)
        const sections = screen.getByRole("list").all();
        expect(sections.length).to.be.eq(1)
        expect(FakeListSection).toHaveBeenCalledTimes(1);
        expect(FakeListSection).toHaveBeenCalledWith({ label: undefined, categoryId: '', shoplistId: '0', showCompleted: true }, undefined)
    })
})