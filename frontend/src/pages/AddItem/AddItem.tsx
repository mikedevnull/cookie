import { IconButton, Button, Container, TextField } from "@mui/material";

import BackIcon from "@mui/icons-material/ArrowBack";
import { Form, Link, useSubmit } from "react-router";
import { AppNavBar } from "@/components/AppNavBar";
import SuggestedItemList from "@/components/SuggestedItemList";
import debounce from "lodash.debounce";
import { ChangeEventHandler, useEffect, useMemo, useState } from "react";
import { useRxData } from "rxdb-hooks";
import { Item, ItemCollection } from "@/db";

const BackAction = (
  <IconButton
    edge="start"
    color="inherit"
    component={Link}
    to="/"
    aria-label="back"
  >
    <BackIcon />
  </IconButton>
);

function useSuggestedItems(searchText: string): Item[] {
  const cleanText = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").trim();
  const itemsQuerys = useRxData("items", (collection: ItemCollection) => {
    return collection?.find({
      selector: {
        name: { $regex: cleanText, $options: "i" },
      },
    });
  });

  return itemsQuerys.result;
}

export default function AddItem() {
  const [searchText, setSearchText] = useState<string>("");

  const suggestedItems = useSuggestedItems(searchText);

  const debounceSearch = useMemo(
    () => debounce(setSearchText, 500, { leading: true }),
    []
  );
  const onInputChange: ChangeEventHandler<HTMLInputElement> = function (event) {
    debounceSearch(event.currentTarget.value);
  };
  useEffect(() => {
    return () => {
      debounceSearch.cancel();
    };
  }, [debounceSearch]);

  const submit = useSubmit();
  return (
    <>
      <Form method="post">
        <AppNavBar leftAction={BackAction} title="Add item">
          <Button color="inherit" type="submit">
            add
          </Button>
        </AppNavBar>
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
          <TextField
            onChange={onInputChange}
            fullWidth
            name="itemName"
            autoFocus
            label="Add new or existing item"
          />
        </Container>
      </Form>
      <Container maxWidth="sm" sx={{ marginTop: 4 }}>
        <SuggestedItemList
          items={suggestedItems}
          itemSelectedCallback={(item) => {
            const formData = new FormData();
            formData.append("itemName", item.name);
            submit(formData, { method: "post" });
          }}
        />
      </Container>
    </>
  );
}
