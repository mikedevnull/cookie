import type { RxCollection, RxDocument } from "rxdb";
import { type Category, type Item, type ItemList } from "./schema";
import type { CheckableItemData } from "../components/checkable-item";
import { arrayMove } from "@dnd-kit/sortable";

export async function insertOrUncheckItem(
  collection: RxCollection<Item> | null,
  name: string,
  listId: string,
  newItemOptions: { category: string; rankOrder: number },
) {
  if (collection) {
    const itemId = collection.schema.getPrimaryOfDocumentData({ name, listId });
    const item = await collection.insertIfNotExists({
      id: itemId,
      name,
      listId,
      checked: false,
      ...newItemOptions,
    });
    // if the item already exists, just set it to not checked
    await item.patch({ checked: false });
  }
}

export async function handleItemChange(
  item: RxDocument<Item>,
  data: CheckableItemData,
) {
  // delete item if label is gone
  if (data.label.length === 0) {
    await item.remove();
  } else if (data.label !== item.name) {
    // label change --> need to rename, probably by delete and recreate
    const newItemData = {
      name: data.label,
      listId: item.listId,
      checked: item.checked,
      category: item.category,
      rankOrder: item.rankOrder,
    };
    const newItemId =
      item.collection.schema.getPrimaryOfDocumentData(newItemData);
    await item.collection
      .insert({ id: newItemId, ...newItemData })
      .then(() => item.remove())
      .catch(() => console.log("Failed to rename item"));
  } else {
    await item.patch({ checked: data.checked });
  }
}

export async function changeItemCategory(
  item: RxDocument<Item>,
  newCategoryId: string,
) {
  await item.patch({ category: newCategoryId });
}

export async function addNewCategory(
  newLabel: string,
  itemList: RxDocument<ItemList>,
) {
  const newId = crypto.randomUUID();
  const newCategories: Category[] = [
    ...itemList.categories,
    { id: newId, label: newLabel },
  ];
  await itemList.incrementalPatch({ categories: newCategories });
}

export async function deleteCategory(
  id: string,
  itemList: RxDocument<ItemList>,
) {
  const index = itemList.categories.findIndex((cat) => cat.id === id);
  if (index > -1) {
    // only splice array when item is found
    const cats = [...itemList.categories];
    cats.splice(index, 1); // 2nd parameter means remove one item only
    await itemList.incrementalPatch({ categories: cats });
  }
}

export async function changeCategoryLabel(
  newLabel: string,
  id: string,
  itemList: RxDocument<ItemList>,
) {
  const itemIndex = itemList.categories.findIndex((c) => c.id === id);
  if (itemIndex == -1) {
    return;
  }
  const newCategories = [...itemList.categories];
  newCategories[itemIndex] = { id, label: newLabel };
  await itemList.patch({ categories: newCategories });
}

export async function moveCategory(
  id: string,
  nextId: string,
  itemList: RxDocument<ItemList>,
) {
  const oldIndex = itemList.categories.findIndex((item) => item.id === id);
  const newIndex = itemList.categories.findIndex((item) => item.id === nextId);
  const reordrered = arrayMove(itemList.categories, oldIndex, newIndex);

  await itemList.patch({ categories: reordrered });
}
