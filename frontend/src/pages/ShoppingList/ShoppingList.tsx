import { Item, ItemCollection } from "@/db";

import { RxDocument } from "rxdb";
import { useRxData } from "rxdb-hooks";
import ShopItemList from "@/components/ShopItemList";
import { Container, Fab, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useState } from "react";
import { AppNavBar } from "@/components/AppNavBar";
import { PageMenu } from "./PageMenu";
import { Link } from "react-router-dom";

type ItemSelectedCallback = (item: Item) => void;

function useShopListItems(showInactive: boolean) {
  const queryFactory = useCallback(
    (collection: ItemCollection) =>
      collection?.find({
        selector: showInactive
          ? {}
          : {
              active: true,
            },
      }),
    [showInactive]
  );
  const { result: items } = useRxData("items", queryFactory);
  items.sort(function (a, b) {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });
  return items;
}

export default function ShoppingList() {
  const [showInactive, setShowInactive] = useState<boolean>(false);
  const items = useShopListItems(showInactive);

  const _findAndActivateItem = (item: Item, choices: RxDocument<Item>[]) => {
    const document = choices.find(
      (doc: RxDocument<Item>) => doc.name === item.name
    );
    if (document) {
      document.patch({ active: !item.active });
    }
  };

  const itemSelectedCallback: ItemSelectedCallback = useCallback(
    (item: Item) => _findAndActivateItem(item, items),
    [items]
  );

  return (
    <>
      <AppNavBar>
        <PageMenu
          showInactive={{ value: showInactive, callback: setShowInactive }}
        ></PageMenu>
      </AppNavBar>
      <Container maxWidth="sm">
        <main>
          <Stack>{renderListSection(items, itemSelectedCallback)}</Stack>
          <Fab
            color="primary"
            aria-label="add"
            sx={{
              position: "fixed",
              bottom: 0,
              right: 0,
              marginRight: 2,
              marginBottom: 2,
            }}
            component={Link}
            to="/add"
          >
            <AddIcon />
          </Fab>
        </main>
      </Container>
    </>
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
