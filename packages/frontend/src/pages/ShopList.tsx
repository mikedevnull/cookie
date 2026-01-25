import { useRxCollection, useRxData } from "rxdb-hooks";
import { useCallback, useEffect, useState } from "react";
import type { RxCollection, RxDocument } from "rxdb";
import type { Subscription } from "rxjs";
import CheckableItem from "../components/checkable-item";
import type { Item, ItemList } from "../db/schema";
import NewItemInput from "../components/new-item-input";
import { handleItemChange, insertOrUncheckItem } from "../db/utilts";
import { MainLayout } from "./Layout";
import type { ValueWithSetCallback } from "../utils";

const notVisibleIcon =
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>

const visibleIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>

type pageMenuProps = {
  checkedVisible: ValueWithSetCallback<boolean>;
}

function shopListPageMenu({ checkedVisible }: pageMenuProps) {
  const icon = checkedVisible.value ? notVisibleIcon : visibleIcon;
  const text = checkedVisible.value ? "Hide completed items" : "Show completed items";

  return <ul
    tabIndex={-1}
    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
    <li>
      <a role="button" onClick={() => checkedVisible.callback(!checkedVisible.value)}>
        {icon} {text}
      </a>
    </li>
  </ul>
}

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
  const [checkedVisible, setCheckedVisible] = useState(true)

  const queryConstructor = useCallback(
    (itemCollection: RxCollection<Item>) => {
      const query = itemCollection
        ?.find()
        .where("listId")
        .equals(shoplistId)
        .where("category")
        .equals("")
        .sort({ checked: "asc", rankOrder: "asc", name: "asc" });
      if (checkedVisible) {
        return query;
      }
      return query.where('checked').equals(false);
    },
    [shoplistId, checkedVisible],
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
    <MainLayout pageMenuItems={shopListPageMenu({ checkedVisible: { value: checkedVisible, callback: setCheckedVisible } })}>
      <section>
        {/* <h2 className="font-semibold p-2">Without category</h2> */}
        <ul className="list bg-base-100 rounded-box shadow-md">
          {itemComponents}
        </ul>
      </section>
      <NewItemInput
        onNewItemCallback={(label) => {
          insertOrUncheckItem(itemCollection, label, shoplistId, {
            category: "",
            rankOrder: nextRank,
          });
        }}
      />
    </MainLayout>
  );
}
