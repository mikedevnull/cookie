import { Item, ItemCollection } from "@/db";

import { RxDocument } from "rxdb";
import { useRxData } from "rxdb-hooks";
import ShopItemList from "./ShopItemList";

export default function ShoppingList() {
  const { result: items } = useRxData("items", (collection: ItemCollection) =>
    collection?.find({
      selector: {
        active: true,
      },
    })
  );

  const itemSelectedCallback = (item: Item) => {
    const document = items.find(
      (doc: RxDocument<Item>) => doc.name === item.name
    );
    if (document) {
      document.patch({ active: !item.active });
    }
  };

  return (
    <section>
      <ShopItemList
        items={items}
        itemSelectedCallback={itemSelectedCallback}
      ></ShopItemList>
    </section>
  );
}
