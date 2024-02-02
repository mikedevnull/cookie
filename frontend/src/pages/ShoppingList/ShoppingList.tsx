import { Item, ItemCollection } from "@/db";

import { RxDocument } from "rxdb";
import { useRxCollection, useRxData } from "rxdb-hooks";
import ShopItemList from "@/components/ShopItemList";
import { Container, Stack, Typography } from "@mui/material";
import AddItemTextField from "@/components/AddItemTextField";
import { useCallback, useState } from "react";
import { ItemSuggestions } from "@/components/ItemSuggestions";
import { AppNavBar } from "@/components/AppNavBar";
import { PageMenu } from "./PageMenu";

type ItemSelectedCallback = (item: Item) => void;

function createDebounceCallback(callback?: (arg0: string) => void) {
  let debounceTimeout: NodeJS.Timeout | undefined;
  if (!callback) {
    return () => {};
  }
  return (value: string) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      callback(value);
    }, 250);
  };
}

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

function useSuggestedItems(searchFilter: string) {
  const trimmedSearchFilter = searchFilter.trim();
  const queryFactory = useCallback(
    (collection: ItemCollection) => {
      if (trimmedSearchFilter.length > 0) {
        return collection.find({
          selector: {
            active: false,
            name: { $regex: `${trimmedSearchFilter}`, $options: "i" },
          },
          limit: 5,
        });
      }
      return undefined;
    },
    [trimmedSearchFilter]
  );
  const { result: items } = useRxData("items", queryFactory);
  if (trimmedSearchFilter.length === 0) {
    return [];
  }
  return items;
}

export default function ShoppingList() {
  const collection = useRxCollection<Item>("items");
  const [showInactive, setShowInactive] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const items = useShopListItems(showInactive);
  const suggestedItems = useSuggestedItems(searchFilter);
  const [textInputValue, setTextInputValue] = useState<string>("");

  const addOrUpdateItem = (name: string) => {
    collection?.upsert({
      name,
      active: true,
    });
  };

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

  const suggestedItemSelectedCallback: ItemSelectedCallback = (item: Item) => {
    _findAndActivateItem(item, suggestedItems);
    setTextInputValue("");
    setSearchFilter("");
  };

  const updateSearchFilter = createDebounceCallback(setSearchFilter);

  return (
    <>
      <AppNavBar>
        <AddItemTextField
          value={textInputValue}
          onChange={(v) => {
            setTextInputValue(v);
            updateSearchFilter(v);
          }}
          submitValue={addOrUpdateItem}
        ></AddItemTextField>
        <PageMenu
          showInactive={{ value: showInactive, callback: setShowInactive }}
        ></PageMenu>
      </AppNavBar>
      <Container maxWidth="sm">
        <main>
          <Stack>
            <ItemSuggestions
              items={suggestedItems}
              itemSelectedCallback={suggestedItemSelectedCallback}
            ></ItemSuggestions>
            {renderListSection(items, itemSelectedCallback)}
          </Stack>
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
