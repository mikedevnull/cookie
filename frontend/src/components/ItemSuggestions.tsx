import { Item } from "@/db/types";
import ShopItemList from "./ShopItemList";
import { Collapse, Divider } from "@mui/material";

type ItemClicked = (item: Item) => void;

export type ItemSuggestionsProps = {
  items: Item[];
  itemSelectedCallback?: ItemClicked;
};

export function ItemSuggestions({
  items,
  itemSelectedCallback,
}: ItemSuggestionsProps) {
  const visible = items.length > 0;

  return (
    <section>
      <Collapse in={visible}>
        <ShopItemList
          items={items}
          itemSelectedCallback={itemSelectedCallback}
        ></ShopItemList>
        <Divider></Divider>
      </Collapse>
    </section>
  );
}
