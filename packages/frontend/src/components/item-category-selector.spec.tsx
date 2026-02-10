import { render } from "vitest-browser-react";
import { ItemCategorySelector } from "./item-category-selector"

describe("ItemCategorySelector", function () {
    it('Shows a list of selectable categories', async function () {
        const actionMock = vi.fn()
        const screen = await render(<ItemCategorySelector currentCategory="" action={actionMock} availableCategories={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }, { id: 'c', label: 'C' }]} ></ItemCategorySelector >);
        const items = screen.getByRole('dialog').getByRole('listitem');
        expect(items.length).toBe(3 + 1) // given categories + "Other"
        const itemForB = items.filter({ hasText: 'B' });
        await itemForB.click()
        expect(actionMock).toHaveBeenCalledWith('b')
    })

    it('Current category is highlighted', async function () {
        const actionMock = vi.fn()
        const screen = await render(<ItemCategorySelector currentCategory="b" action={actionMock} availableCategories={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }, { id: 'c', label: 'C' }]} ></ItemCategorySelector >);
        const items = screen.getByRole('dialog').getByRole('listitem');
        expect(items.length).toBe(3 + 1)
        const itemForB = items.getByText('B');
        expect(itemForB).toHaveClass('bg-primary')
    })

    it('Current category is highlighted', async function () {
        const actionMock = vi.fn()
        const screen = await render(<ItemCategorySelector currentCategory="b" action={actionMock} availableCategories={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }, { id: 'c', label: 'C' }]} ></ItemCategorySelector >);
        const items = screen.getByRole('dialog').getByRole('listitem');
        expect(items.length).toBe(3 + 1)
        const itemForB = items.getByText('B');
        expect(itemForB).toHaveClass('bg-primary')
    })

    it('Hides dialog when currentCategory is set to undefined', async function () {
        const actionMock = vi.fn()
        const screen = await render(<ItemCategorySelector action={actionMock} availableCategories={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }, { id: 'c', label: 'C' }]} ></ItemCategorySelector >);
        const dialog = screen.getByRole('dialog');
        expect(dialog).not.toBeInTheDocument()
    })
})