import { Box, IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import Clear from "@mui/icons-material/Clear";

type Props = {
  value: string;
  onChange: (arg0: string) => void;
  submitValue?: (arg0: string) => void;
};

export default function AddItemTextField({
  value,
  onChange,
  submitValue,
}: Props) {
  const addItem = (name: string) => {
    if (submitValue && name.length > 0) {
      submitValue(name);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: "sm" }}>
      <OutlinedInput
        size="small"
        sx={{
          backgroundColor: "background.default",
        }}
        value={value}
        onChange={(event) => {
          onChange(event.currentTarget.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            addItem(value.trim());
            onChange("");
          }
        }}
        fullWidth
        inputProps={{
          autoCapitalize: "on",
          enterKeyHint: "done",
        }}
        placeholder="Add item"
        type="text"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="Clear text for adding new items"
              edge="end"
              onClick={() => {
                onChange("");
              }}
              data-testid="input-clear-button"
            >
              <Clear />
            </IconButton>
          </InputAdornment>
        }
      />
    </Box>
  );
}
