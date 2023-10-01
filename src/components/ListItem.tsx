import { Paper } from "@mantine/core";
import classes from "./ListItem.module.css";

export type Item = {
  name: string;
  marked: boolean;
};

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
  if (item.marked) {
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
