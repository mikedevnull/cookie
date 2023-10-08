import { useRxCollection } from "rxdb-hooks";
import AddItemInput from "./AddItemInput";
import { Item } from "@/db";

export default function AddItemSection() {
  const collection = useRxCollection<Item>("items");
  const onItemAdded = (name: string) => {
    collection?.upsert({
      name,
      active: true,
    });
  };
  return (
    <section>
      <AddItemInput addItemCallback={onItemAdded}></AddItemInput>
    </section>
  );
}
