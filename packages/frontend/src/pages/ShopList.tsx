import { useRxCollection } from "rxdb-hooks";
import { useEffect, useState } from "react";
import type { RxDocument } from "rxdb";
import type { Subscription } from "rxjs";
import type { ItemList } from "../db/schema";
import { MainLayout } from "./Layout";
import type { ValueWithSetCallback } from "../utils";
import { ListSection } from "../components/list-section";
import { Link, useParams } from "react-router";
import { useShopList } from "../hooks/useShoplist";

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
    className="menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box z-1 mt-3 w-52 p-2 shadow">
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
      subscription?.unsubscribe();
    };
  }, [collection, shoplistId]);

  return result;
}

// use this later when we hide empty categories and have other means to move an item to them (preferrably automatically)
// function useAtLeastOneVisibleItemInSomeCategory(shoplistId: string, checkedVisible: boolean): boolean {
//   const queryConstructor = useCallback(
//     (itemCollection: RxCollection<Item>) => {
//       const query = itemCollection
//         ?.findOne()
//         .where("listId")
//         .equals(shoplistId)
//         .where("category")
//         .ne("")
//       if (checkedVisible) {
//         return query;
//       }
//       return query.where('checked').equals(false);
//     },
//     [shoplistId, checkedVisible],
//   );
//   const { result: visibleItemInSomeCategory } = useRxData("items", queryConstructor);
//   return visibleItemInSomeCategory.length > 0;
// }

export default function ShopList() {
  let { shoplistId } = useParams();

  shoplistId = shoplistId ?? '0'
  const { itemList, isFetching: isListFetching } = useShopList(shoplistId);
  const [checkedVisible, setCheckedVisible] = useState(true)

  // const atLeastOneItemInCategoryVisible = useAtLeastOneVisibleItemInSomeCategory(shoplistId, checkedVisible)
  const hasCategories = itemList?.categories.length && itemList?.categories.length > 0;

  if (isListFetching || !itemList) {
    return <>None</>;
  }

  const otherLabel = hasCategories ? "Other" : undefined

  const sections = itemList.categories.map((category) => <ListSection key={category.id} categoryId={category.id} label={category.label} shoplistId={shoplistId} showCompleted={checkedVisible} />)
  return <MainLayout pageMenuItems={shopListPageMenu({ checkedVisible: { value: checkedVisible, callback: setCheckedVisible } })}>
    {sections}
    <ListSection categoryId="" label={otherLabel} shoplistId={shoplistId} showCompleted={checkedVisible} />
  </MainLayout>

}
