import { Item } from "@/db/types";
import ShopItemList from "./ShopItemList";
import { Collapse, Divider } from "@mui/material";

export type ItemSuggestionsProps = {
  items: Item[];
};

export function ItemSuggestions({ items }: ItemSuggestionsProps) {
  const visible = items.length > 0;

  return (
    <section>
      <Collapse in={visible}>
        <ShopItemList items={items}></ShopItemList>
        <Divider></Divider>
      </Collapse>
    </section>
  );
}
