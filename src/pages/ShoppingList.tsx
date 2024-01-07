import { Item, ItemCollection } from "@/db";

import { RxDocument } from "rxdb";
import { useRxData } from "rxdb-hooks";
import ShopItemList from "@/components/ShopItemList";
import { Stack, Typography } from "@mui/material";
import AddItemSection from "@/components/AddItemSection";

export default function ShoppingList() {
  const { result: items } = useRxData("items", (collection: ItemCollection) =>
    collection?.find({
      selector: {
        active: true,
      },
    })
  );

  const itemSelectedCallback = (item: Item) => {
    const document = items.find(
      (doc: RxDocument<Item>) => doc.name === item.name
    );
    if (document) {
      document.patch({ active: !item.active });
    }
  };

  if (items.length === 0) {
    return renderEmptyListHint();
  } else {
    return (
      <Stack>
        <AddItemSection></AddItemSection>
        <ShopItemList
          items={items}
          itemSelectedCallback={itemSelectedCallback}
        ></ShopItemList>
      </Stack>
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
