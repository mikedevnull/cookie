import { renderWithDb } from "../../test/render";
import { createDatabase, type Database } from "../db/database";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { CategoryEditor } from "./category-editor";
import { userEvent } from "vitest/browser";

describe("CategoryEditor", function () {
    let db: Database;

    beforeEach(async function () {
        const storage = wrappedValidateAjvStorage({ storage: getRxStorageMemory() });
        db = await createDatabase({ storage });
    });

    afterEach(async function () {
        await db?.remove();
    });

    it("renders the categories", async () => {
        const categories = [
            { id: "1", label: "Category 1" },
            { id: "2", label: "Category 2" },
        ];

        const screen = await renderWithDb(db, (
            <CategoryEditor
                categories={categories}
                onReorder={async () => { }}
                onEdit={() => { }}
                onAdd={() => { }}
                onDelete={() => { }}
            />
        ));

        categories.forEach((category) => {
            expect(screen.getByText(category.label)).toBeTruthy();
        });
    });

    it("calls onEdit when a category label is changed", async () => {
        const categories = [
            { id: "1", label: "Category 1" },
        ];

        const mockOnEdit = vi.fn();

        const screen = await renderWithDb(db, (
            <CategoryEditor
                categories={categories}
                onReorder={async () => { }}
                onEdit={mockOnEdit}
                onAdd={() => { }}
                onDelete={() => { }}
            />
        ));

        const input = screen.getByRole('list').getByRole("textbox");
        await userEvent.fill(input, "Updated Category 1")
        input.element().blur();

        expect(mockOnEdit).toHaveBeenCalledWith("1", "Updated Category 1");
    });

    it("calls onAdd when a new category is added", async () => {
        const mockOnAdd = vi.fn();

        const screen = await renderWithDb(db, (
            <CategoryEditor
                categories={[]}
                onReorder={async () => { }}
                onEdit={() => { }}
                onAdd={mockOnAdd}
                onDelete={() => { }}
            />
        ));

        const input = screen.getByRole("textbox", { name: "Add new category" });

        await userEvent.type(input, "New Category{Enter}");
        // input.element().blur();
        expect(mockOnAdd).toHaveBeenCalledWith("New Category");
    });

    it('Calls onDelete when a category is deleted', async () => {
        const categories = [
            { id: "1", label: "Category 1" },
            { id: "2", label: "Category 2" },
        ];
        const mockOnDelete = vi.fn();

        const screen = await renderWithDb(db, (
            <CategoryEditor
                categories={categories}
                onReorder={async () => { }}
                onEdit={() => { }}
                onAdd={() => { }}
                onDelete={mockOnDelete}
            />
        ));

        const deleteHandle = screen.getByRole('listitem').last().getByRole('button', { name: 'Delete category' })
        await deleteHandle.click();
        expect(mockOnDelete).toHaveBeenCalledWith('2')
    })

    it("calls onReorder when a category is reordered", async () => {
        const categories = [
            { id: "1", label: "Category 1" },
            { id: "2", label: "Category 2" },
        ];

        const mockOnReorder = vi.fn();

        const screen = await renderWithDb(db, (
            <CategoryEditor
                categories={categories}
                onReorder={mockOnReorder}
                onEdit={() => { }}
                onAdd={() => { }}
                onDelete={() => { }}
            />
        ));

        const cat2Handle = screen.getByRole("listitem").last().getByRole("button", { name: 'Move category' })
        const cat1Handle = screen.getByRole("listitem").first().getByRole("button", { name: 'Move category' })

        expect(cat2Handle).toBeInTheDocument()
        expect(cat1Handle).toBeInTheDocument()

        await userEvent.dragAndDrop(cat2Handle, cat1Handle);

        expect(mockOnReorder).toHaveBeenCalledWith(categories[1].id, categories[0].id);
    });
});