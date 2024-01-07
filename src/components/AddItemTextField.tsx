import TextField from "@mui/material/TextField";

import { useCallback, useState } from "react";
import { Box } from "@mui/material";

type Props = {
  defaultValue?: string;
  submitValue?: (arg0: string) => void;
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

export default function AddItemTextField({
  defaultValue,
  submitValue,
  searchFilterCallback,
}: Props) {
  const [value, setValue] = useState<string>(defaultValue || "");

  const addItem = (name: string) => {
    if (submitValue && name.length > 0) {
      submitValue(name);
    }
  };

  const searchCallback = useCallback(
    createDebounceCallback(searchFilterCallback),
    [searchFilterCallback]
  );

  return (
    <Box marginTop={2}>
      <TextField
        value={value}
        onChange={(event) => {
          setValue(event.currentTarget.value);
          searchCallback(event.currentTarget.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            addItem(value.trim());
            setValue("");
            searchCallback("");
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
