import { Item } from "@/db";
import { ActionFunctionArgs, redirect } from "react-router";
import { RxCollection } from "rxdb";

export function createAddItemAction(collection: RxCollection<Item> | null) {
  return async ({ request }: ActionFunctionArgs) => {
    if (!collection) {
      throw new Error("No collection, database not setup correctly?");
    }
    const formData = await request.formData();

    const itemName = formData.get("itemName")?.toString();
    if (itemName && itemName !== "") {
      collection.upsert({ name: itemName.toString(), state: "active" });
    }

    return redirect("/");
  };
}
