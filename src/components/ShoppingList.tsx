import { Item, ItemCollection } from "@/db";

import { RxDocument } from "rxdb";
import { useRxData } from "rxdb-hooks";
import ShopItemList from "./ShopItemList";
import { Fade, Typography } from "@mui/material";

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
    return (
      <Fade in={items.length === 0}>
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
      </Fade>
    );
  } else {
    return (
      <ShopItemList
        items={items}
        itemSelectedCallback={itemSelectedCallback}
      ></ShopItemList>
    );
  }
}
