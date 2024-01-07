import { Item, ItemCollection } from "@/db";

import { RxDocument } from "rxdb";
import { useRxCollection, useRxData } from "rxdb-hooks";
import ShopItemList from "@/components/ShopItemList";
import { Stack, Typography } from "@mui/material";
import AddItemTextField from "@/components/AddItemTextField";

type ItemSelectedCallback = (item: Item) => void;

export default function ShoppingList() {
  const collection = useRxCollection<Item>("items");
  const { result: items } = useRxData("items", (collection: ItemCollection) =>
    collection?.find({
      selector: {
        active: true,
      },
    })
  );

  items.sort(function (a, b) {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });

  const addOrUpdateItem = (name: string) => {
    collection?.upsert({
      name,
      active: true,
    });
  };

  const itemSelectedCallback: ItemSelectedCallback = (item: Item) => {
    const document = items.find(
      (doc: RxDocument<Item>) => doc.name === item.name
    );
    if (document) {
      document.patch({ active: !item.active });
    }
  };

  return (
    <Stack>
      <AddItemTextField submitValue={addOrUpdateItem}></AddItemTextField>
      {renderListSection(items, itemSelectedCallback)}
    </Stack>
  );
}

function renderListSection(
  items: Item[],
  itemSelectedCallback: ItemSelectedCallback
) {
  if (items.length === 0) {
    return renderEmptyListHint();
  } else {
    return (
      <ShopItemList
        items={items}
        itemSelectedCallback={itemSelectedCallback}
      ></ShopItemList>
    );
  }
}

function renderEmptyListHint() {
  return (
    <Typography
      variant="body2"
      color="primary.light"
      fontWeight={"bold"}
      marginTop={4}
      padding={8}
      textAlign={"center"}
      textTransform={"uppercase"}
    >
      The list is currently empty.
    </Typography>
  );
}
