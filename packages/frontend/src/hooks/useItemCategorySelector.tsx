import { type JSX, useCallback, useState } from "react"
import type { RxDocument } from "rxdb"
import type { Item, Category } from "../db/schema"
import { ItemCategorySelector } from "../components/item-category-selector"
import { changeItemCategory } from "../db/utilts"

export function useItemCategorySelector(): [React.Dispatch<React.SetStateAction<RxDocument<Item> | undefined>>, (availableCategories: Category[]) => JSX.Element] {
    const [currentEditedItem, setCurrentEditedItem] = useState<RxDocument<Item> | undefined>(undefined)
    const onChangeCategory = useCallback(async (newCategoryId: string) => {
        if (currentEditedItem && newCategoryId !== currentEditedItem.category) {
            await changeItemCategory(currentEditedItem, newCategoryId);
        }
        setCurrentEditedItem(undefined)
    }, [currentEditedItem])

    const renderDialog = useCallback((availableCategories: Category[]) => {
        if (currentEditedItem) {
            return <ItemCategorySelector currentCategory={currentEditedItem?.category} action={onChangeCategory} availableCategories={availableCategories}></ItemCategorySelector>
        }
        return <></>
    }, [onChangeCategory, currentEditedItem])

    return [setCurrentEditedItem, renderDialog]
}