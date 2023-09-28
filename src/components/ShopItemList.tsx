import { SimpleGrid } from "@mantine/core";
import type { ShopItem } from "./ShopItemListItem";
import ShopItemListItem from "./ShopItemListItem";

export default function ShopItemList({ items }: { items: ShopItem[] }) {
  const itemsViews = items.map((i) => {
    return <ShopItemListItem item={i} key={i.name}></ShopItemListItem>;
  });
  return <SimpleGrid cols={{ base: 2, sm: 4, lg: 6 }}>{itemsViews}</SimpleGrid>;
}
