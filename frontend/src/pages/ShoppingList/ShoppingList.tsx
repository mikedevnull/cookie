import { Item, ItemCollection } from "@/db";

import { RxDocument } from "rxdb";
import { useRxData } from "rxdb-hooks";
import ShopItemList from "@/components/ShopItemList";
import { Container, Fab, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { useCallback } from "react";
import { AppNavBar } from "@/components/AppNavBar";
import { Link } from "react-router-dom";

type ItemSelectedCallback = (item: Item) => void;

function useShopListItems(showInactive: boolean = false) {
  const queryFactory = useCallback(
    (collection: ItemCollection) =>
      collection?.find({
        selector: showInactive
          ? {}
          : {
              state: { $ne: "hidden" },
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
  const items = useShopListItems();

  const _findAndActivateItem = (item: Item, choices: RxDocument<Item>[]) => {
    const document = choices.find(
      (doc: RxDocument<Item>) => doc.name === item.name
    );
    if (document) {
      document.patch({ state: item.state === "active" ? "done" : "active" });
    }
  };

  const itemSelectedCallback: ItemSelectedCallback = useCallback(
    (item: Item) => _findAndActivateItem(item, items),
    [items]
  );

  const activeItems = items.filter((i) => i.state === "active");
  const doneItems = items.filter((i) => i.state === "done");

  const onRemoveItems = () => {
    doneItems.forEach((i) => i.patch({ state: "hidden" }));
  };

  return (
    <>
      <AppNavBar></AppNavBar>
      <Container maxWidth="sm">
        <main>
          <Stack>
            {renderListSection(activeItems, doneItems, itemSelectedCallback)}
          </Stack>
          {renderFab(doneItems.length > 0, onRemoveItems)}
        </main>
      </Container>
    </>
  );
}

function renderFab(haveDoneItems: boolean, onRemoveItems: () => void) {
  const addFab = (
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
  );
  const removeDoneFab = (
    <Fab
      color="primary"
      aria-label="remove done items"
      sx={{
        position: "fixed",
        bottom: 0,
        right: 0,
        marginRight: 2,
        marginBottom: 10,
      }}
      onClick={onRemoveItems}
    >
      <DeleteSweepIcon />
    </Fab>
  );

  return (
    <>
      {addFab}
      {haveDoneItems && removeDoneFab}
    </>
  );
}

function renderListSection(
  activeItems: Item[],
  doneItems: Item[],
  itemSelectedCallback: ItemSelectedCallback
) {
  if (activeItems.length + doneItems.length === 0) {
    return renderEmptyListHint();
  }
  const activeList = (
    <ShopItemList
      items={activeItems}
      itemSelectedCallback={itemSelectedCallback}
    ></ShopItemList>
  );
  const optionalDoneList = (
    <ShopItemList
      items={doneItems}
      header="Done"
      itemSelectedCallback={itemSelectedCallback}
    ></ShopItemList>
  );

  return (
    <>
      {activeList}
      {doneItems.length > 0 && optionalDoneList}
    </>
  );
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
