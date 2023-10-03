import { ItemCollection } from "../db";
import ItemList from "./ItemList";
import { useRxData } from "rxdb-hooks";

export default function ShoppingList() {
  const { result: items } = useRxData("items", (collection: ItemCollection) =>
    collection?.find({
      selector: {
        active: true,
      },
    })
  );

  return (
    <section>
      <h2>Shopping list</h2>
      <ItemList items={items}></ItemList>
    </section>
  );
}
