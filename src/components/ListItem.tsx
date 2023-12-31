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
    <div role="listitem" className={usedClasses} onClick={onClick}>
      {item.name}
    </div>
  );
}
