import type { RxCollection, RxDocument } from "rxdb";
import { type Item } from "./schema";
import type { CheckableItemData } from "../components/checkable-item";

export async function insertOrUncheckItem(
    collection: RxCollection<Item> | null,
    name: string,
    listId: string,
    newItemOptions: { category: string; rankOrder: number }
) {
    if (collection) {
        const itemId = collection.schema.getPrimaryOfDocumentData({name, listId});
        const item = await collection.insertIfNotExists({ id: itemId, name, listId, checked: false, ...newItemOptions });
        // if the item already exists, just set it to not checked
        await item.patch({ checked: false });
    }
}

export async function handleItemChange(item: RxDocument<Item>, data: CheckableItemData) {
    // delete item if label is gone
    if(data.label.length === 0) {
        await item.remove()
    }
    else if(data.label !== item.name) {
        // label change --> need to rename, probably by delete and recreate
        const newItemData = {name: data.label, listId: item.listId, checked: item.checked, category: item.category, rankOrder: item.rankOrder}
        const newItemId = item.collection.schema.getPrimaryOfDocumentData(newItemData);
        await item.collection.insert({id: newItemId, ...newItemData }).then(()=>item.remove()).catch(()=>console.log('Failed to rename item'));
    }
    else {
        await item.patch({checked: data.checked})
    }
}