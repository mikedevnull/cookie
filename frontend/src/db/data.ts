import type { Item } from "./types";

function createItems() {
  const items = new Array<Item>();
  for (let i = 0; i < 30; ++i) {
    items.push({ name: `Item ${i}`, active: i % 2 === 0, rankOrder: 0 });
  }
  return items;
}

export const initialItems: Item[] = createItems();
