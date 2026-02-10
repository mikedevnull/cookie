import { useState, useEffect } from "react";
import type { RxDocument } from "rxdb";
import { useRxCollection } from "rxdb-hooks";
import type { Subscription } from "rxjs";
import type { ItemList } from "../db/schema";

export function useShopList(shoplistId: string) {
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
        subscription = document.$.subscribe((next) => {
          setResult({
            itemList: next,
            isFetching: false,
          });
        });
        setResult({
          itemList: document,
          isFetching: false,
        });
      })
      .catch((error) => {
        console.error("Failed to fetch or create list", error);
        setResult({ itemList: null, isFetching: false });
      });
    return () => {
      subscription?.unsubscribe();
    };
  }, [collection, shoplistId]);

  return { ...result };
}
