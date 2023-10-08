import { Paper } from "@mantine/core";
import classes from "./ListItem.module.css";
import { Item } from "@/db";

type Props = {
  item: Item;
  itemClicked?: (item: Item) => void;
};

export default function ListItem({ item, itemClicked }: Props) {
  const onClick = () => {
    if (itemClicked) {
      itemClicked(item);
    }
  };
  let usedClasses = `${classes.item}`;
  if (item.active) {
    usedClasses += ` ${classes.selected}`;
  }
  return (
    <Paper
      role="listitem"
      className={usedClasses}
      shadow="xs"
      p="xl"
      onClick={onClick}
    >
      {item.name}
    </Paper>
  );
}
