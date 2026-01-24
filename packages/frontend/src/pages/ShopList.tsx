import { useRxCollection, useRxData } from "rxdb-hooks";
import { useCallback, useEffect, useState } from "react";
import type { RxCollection, RxDocument } from "rxdb";
import type { Subscription } from "rxjs";
import CheckableItem from "../components/checkable-item";
import type { Item, ItemList } from "../db/schema";
import NewItemInput from "../components/new-item-input";
import { handleItemChange, insertOrUncheckItem } from "../db/utilts";

function useShopList(shoplistId: string) {
  const [result, setResult] = useState<{
    itemList: RxDocument<ItemList> | null;
    isFetching: boolean;
  }>({ itemList: null, isFetching: true });
  const collection = useRxCollection<ItemList>("itemLists");

  // todo: move "create if does not exist outside of this component, show error instead"
  useEffect(() => {
    let subscription: Subscription | undefined;
    if (!collection) {
      return;
    }
    collection
      .insertIfNotExists({
        id: shoplistId,
        label: "New list",
        categories: [],
      })
      .then((document) => {
        subscription = document.$.subscribe((next) =>
          setResult({ itemList: next, isFetching: false }),
        );
        setResult({ itemList: document, isFetching: false });
      })
      .catch((error) => {
        console.error("Failed to fetch or create list", error);
        setResult({ itemList: null, isFetching: false });
      });
    return () => {
      console.log(subscription);
      subscription?.unsubscribe();
    };
  }, [collection, shoplistId]);

  return result;
}

export default function ShopList() {
  const shoplistId = "0";

  const { itemList, isFetching: isListFetching } = useShopList(shoplistId);

  const queryConstructor = useCallback(
    (itemCollection: RxCollection<Item>) =>
      itemCollection
        ?.find()
        .where("listId")
        .equals(shoplistId)
        .where("category")
        .equals("")
        .sort({ checked: "asc", rankOrder: "asc", name: "asc" }),
    [shoplistId],
  );
  const { result: itemsWithoutCategory } = useRxData("items", queryConstructor);
  const itemCollection = useRxCollection<Item>("items");

  if (isListFetching || !itemList) {
    return <>None</>;
  }

  const itemComponents = itemsWithoutCategory.map((item) => (
    <CheckableItem
      checked={item.checked}
      label={item.name}
      key={item.name}
      changeCallback={(data) => handleItemChange(item, data)}
    />
  ));

  const nextRank =
    (itemsWithoutCategory.length > 0
      ? itemsWithoutCategory[itemsWithoutCategory.length - 1].rankOrder
      : 0) + 100;

  return (
    <>
      <section>
        <h2 className="font-semibold p-2">Without category</h2>
        <ul className="list bg-base-100 rounded-box shadow-md">
          {itemComponents}
        </ul>
      </section>
      <NewItemInput
        onNewItemCallback={(label) => {
          console.log("insert", {
            name: label,
            category: "",
            rankOrder: nextRank,
            listId: shoplistId,
          });
          insertOrUncheckItem(itemCollection, label, shoplistId, {
            category: "",
            rankOrder: nextRank,
          });
        }}
      />
    </>
  );
}
