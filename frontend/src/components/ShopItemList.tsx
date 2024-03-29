import { List, Collapse } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import { Item } from "@/db";
import ShopItemListItem from "./ShopItemListItem";

type ItemClicked = (item: Item) => void;

type Props = {
  items: Item[];
  itemSelectedCallback?: ItemClicked;
};

export default function ShopItemList({ items, itemSelectedCallback }: Props) {
  const onClick = (item: Item) => {
    if (itemSelectedCallback) {
      itemSelectedCallback(item);
    }
  };

  return (
    <List>
      <TransitionGroup>
        {items.map((i) => (
          <Collapse key={i.name}>
            <ShopItemListItem
              name={i.name}
              active={i.active}
              onToggle={() => onClick(i)}
            />
          </Collapse>
        ))}
      </TransitionGroup>
    </List>
  );
}
