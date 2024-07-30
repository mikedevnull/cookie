import { List, Collapse, ListSubheader } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import { Item } from "@/db";
import ShopItemListItem from "./ShopItemListItem";

type ItemClicked = (item: Item) => void;

type Props = {
  items: Item[];
  itemSelectedCallback?: ItemClicked;
  header?: string;
};

export default function ShopItemList({
  items,
  itemSelectedCallback,
  header,
}: Props) {
  const onClick = (item: Item) => {
    if (itemSelectedCallback) {
      itemSelectedCallback(item);
    }
  };

  return (
    <List>
      {header !== undefined ? (
        <ListSubheader>{header}</ListSubheader>
      ) : undefined}
      <TransitionGroup>
        {items.map((i) => (
          <Collapse key={i.name}>
            <ShopItemListItem
              name={i.name}
              active={i.state === "active"}
              onToggle={() => onClick(i)}
            />
          </Collapse>
        ))}
      </TransitionGroup>
    </List>
  );
}
