import { Paper } from "@mantine/core";
import classes from "./ShopItemListItem.module.css";

export type ShopItem = {
  name: string;
};

export default function ShopItemListItem({ item }: { item: ShopItem }) {
  let usedClasses = `${classes.item}`;
  const selected = true;
  if (selected) {
    usedClasses += ` ${classes.selected}`;
  }
  return (
    <Paper className={usedClasses} shadow="xs" p="xl">
      {item.name}
    </Paper>
  );
}
