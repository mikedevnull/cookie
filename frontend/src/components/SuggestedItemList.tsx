import { Item } from "@/db";
import { List, ListItemButton, ListItemText } from "@mui/material";

type ItemClicked = (item: Item) => void;

type Props = {
  items: Item[];
  itemSelectedCallback?: ItemClicked;
};

export default function SuggestedItemList({
  items,
  itemSelectedCallback,
}: Props) {
  const renderedItems = items.map((item) => (
    <ListItemButton
      onClick={() => itemSelectedCallback?.(item)}
      key={item.name}
    >
      <ListItemText
        primary={item.name}
        secondary={item.active ? "" : "Not on list"}
      />
    </ListItemButton>
  ));
  return <List>{renderedItems}</List>;
}
