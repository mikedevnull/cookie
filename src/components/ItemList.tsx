import {
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
  ListItem,
  List,
} from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import { Item } from "@/db";

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

  const renderItem = (item: Item, index: number) => {
    const labelId = `checkbox-list-label-${index}`;
    return (
      <ListItem disablePadding>
        <ListItemButton onClick={() => onClick(item)}>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={item.active === false}
              tabIndex={-1}
              disableRipple
              inputProps={{ "aria-labelledby": labelId }}
            />
          </ListItemIcon>
          <ListItemText id={labelId} primary={item.name} />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <List>
      <TransitionGroup>{items.map(renderItem)}</TransitionGroup>
    </List>
  );
}
