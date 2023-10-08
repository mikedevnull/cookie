import { SimpleGrid } from "@mantine/core";
import ListItem from "./ListItem";
import { Item } from "@/db";

type ItemClicked = (item: Item) => void;

type Props = {
  items: Item[];
  itemClicked?: ItemClicked;
};

export default function ShopItemList({ items, itemClicked }: Props) {
  const onClick = (item: Item) => {
    if (itemClicked) {
      itemClicked(item);
    }
  };

  const itemsViews = items.map((i) => {
    return <ListItem item={i} key={i.name} itemClicked={onClick}></ListItem>;
  });

  return (
    <SimpleGrid role="list" cols={{ base: 2, sm: 4, lg: 6 }}>
      {itemsViews}
    </SimpleGrid>
  );
}
