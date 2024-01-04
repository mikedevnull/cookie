import { useRxCollection, useRxData } from "rxdb-hooks";
import { Item, ItemCollection } from "@/db";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import DOMPurify from "dompurify";
import { useState } from "react";
import { Box } from "@mui/material";

export default function AddItemSection() {
  const collection = useRxCollection<Item>("items");
  const [value, setValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>();
  const onItemAdded = (name: string) => {
    return collection?.upsert({
      name: DOMPurify.sanitize(name),
      active: true,
    });
  };

  const { result } = useRxData("items", (collection: ItemCollection) => {
    return collection?.find({
      selector: { name: { $regex: searchValue, $options: "i" } },
    });
  });
  const availableItems = result.map((i) => i.name);

  let searchDebounceTimeout: NodeJS.Timeout | undefined;

  const onInputChange = (_e: React.SyntheticEvent, value: string) => {
    clearTimeout(searchDebounceTimeout);
    searchDebounceTimeout = setTimeout(
      () => setSearchValue(DOMPurify.sanitize(value)),
      1000
    );
  };

  return (
    <Box marginTop={2}>
      <Autocomplete
        fullWidth
        blurOnSelect
        clearOnBlur
        handleHomeEndKeys
        freeSolo
        options={availableItems}
        onInputChange={onInputChange}
        value={value}
        onChange={(_e, newValue, reason) => {
          if (reason === "createOption" || reason === "selectOption") {
            if (newValue) {
              onItemAdded(newValue);
            }
            setValue("");
            return;
          }
          if (newValue) {
            setValue(newValue);
          }
        }}
        getOptionLabel={(option) => {
          return option;
        }}
        filterOptions={(options, { inputValue }) => {
          const isExisting = options.some((o) => o === inputValue);
          if (inputValue !== "" && !isExisting) {
            options.push(`Add "${inputValue}"`);
          }
          return options;
        }}
        renderOption={(props, option) => <li {...props}>{option}</li>}
        renderInput={(params) => <TextField {...params} label="Add item" />}
      />
    </Box>
  );
}
