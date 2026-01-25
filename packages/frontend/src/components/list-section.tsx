import { useCallback } from "react";
import NewItemInput from "./new-item-input";
import type { RxCollection } from "rxdb";
import type { Item } from "../db/schema";
import { useRxCollection, useRxData } from "rxdb-hooks";
import CheckableItem from "./checkable-item";
import { handleItemChange, insertOrUncheckItem } from "../db/utilts";

interface Props {
    label?: string
    categoryId: string,
    shoplistId: string,
    showCompleted: boolean
}


export function ListSection({ label, categoryId, shoplistId, showCompleted }: Props) {
    const queryConstructor = useCallback(
        (itemCollection: RxCollection<Item>) => {
            const query = itemCollection
                ?.find()
                .where("listId")
                .equals(shoplistId)
                .where("category")
                .equals(categoryId)
                .sort({ checked: "asc", rankOrder: "asc", name: "asc" });
            if (showCompleted) {
                return query;
            }
            return query.where('checked').equals(false);
        },
        [categoryId, shoplistId, showCompleted],
    );

    const { result: itemsForCategory } = useRxData("items", queryConstructor);

    const itemCollection = useRxCollection<Item>("items");
    const itemComponents = itemsForCategory.map((item) => (
        <CheckableItem
            checked={item.checked}
            label={item.name}
            key={item.name}
            changeCallback={(data) => handleItemChange(item, data)}
        />
    ));

    const nextRank =
        (itemsForCategory.length > 0
            ? itemsForCategory[itemsForCategory.length - 1].rankOrder
            : 0) + 100;

    const labelElement = label ? <h2 className="font-semibold p-2">{label}</h2> : <></>
    return <section>
        {labelElement}
        <ul className="list bg-base-100 rounded-box shadow-md">
            {itemComponents}
        </ul>
        <NewItemInput
            onNewItemCallback={(label) => insertOrUncheckItem(itemCollection, label, shoplistId, {
                category: categoryId,
                rankOrder: nextRank,
            })}
        />
    </section>


}
