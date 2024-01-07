import { useRxCollection } from "rxdb-hooks";
import { Item } from "@/db";
import TextField from "@mui/material/TextField";

import DOMPurify from "dompurify";
import { useCallback, useState } from "react";
import { Box } from "@mui/material";

type Props = {
  searchFilterCallback?: (arg0: string) => void;
};

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

export default function AddItemSection({ searchFilterCallback }: Props) {
  const collection = useRxCollection<Item>("items");
  const [value, setValue] = useState<string>("");

  const addItem = (name: string) => {
    return collection?.upsert({
      name: DOMPurify.sanitize(name),
      active: true,
    });
  };

  const callback = useCallback(createDebounceCallback(searchFilterCallback), [
    searchFilterCallback,
  ]);

  return (
    <Box marginTop={2}>
      <TextField
        value={value}
        onChange={(event) => {
          setValue(event.currentTarget.value);
          callback(event.currentTarget.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            addItem(value);
            setValue("");
            callback("");
          }
        }}
        onBlur={() => setValue("")}
        fullWidth
        inputProps={{
          autoCapitalize: "on",
          enterKeyHint: "done",
        }}
        label="Add item"
        type="text"
        variant="outlined"
      />
    </Box>
  );
}
