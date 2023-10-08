import { Item, ItemCollection } from "@/db";
import ItemList from "./ItemList";
import { RxDocument } from "rxdb";
import { useRxData } from "rxdb-hooks";

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
      <h2>Shopping list</h2>
      <ItemList items={items} itemClicked={itemSelectedCallback}></ItemList>
    </section>
  );
}
