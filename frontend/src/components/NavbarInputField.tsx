import { useCallback, useState } from "react";
import {
  Container,
  IconButton,
  InputAdornment,
  OutlinedInput,
  alpha,
} from "@mui/material";
import Clear from "@mui/icons-material/Clear";

type Props = {
  defaultValue?: string;
  submitValue?: (arg0: string) => void;
  searchFilterCallback?: (arg0: string) => void;
  focusChange?: (arg0: boolean) => void;
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

export default function NavbarInputField({
  defaultValue,
  submitValue,
  searchFilterCallback,
  focusChange,
}: Props) {
  const [value, setValue] = useState<string>(defaultValue || "");

  const onFocusChange = focusChange || (() => {});

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
    <Container maxWidth="sm">
      <OutlinedInput
        size="small"
        value={value}
        onChange={(event) => {
          setValue(event.currentTarget.value);
          searchCallback(event.currentTarget.value);
        }}
        fullWidth
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            addItem(value.trim());
            setValue("");
            searchCallback("");
          }
        }}
        style={{
          backgroundColor: alpha("#FFFFFF", 0.15),
          borderColor: "#FFFFFFF",
        }}
        inputProps={{
          autoCapitalize: "on",
          enterKeyHint: "done",
          onFocus: () => onFocusChange(true),
          onBlur: () => onFocusChange(false),
        }}
        placeholder="Add item"
        type="text"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="Clear text for adding new items"
              edge="end"
              onClick={() => {
                setValue("");
                searchCallback("");
              }}
              data-testid="input-clear-button"
            >
              <Clear />
            </IconButton>
          </InputAdornment>
        }
      />
    </Container>
  );
}
