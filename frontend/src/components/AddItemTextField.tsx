import { Autocomplete, TextField, createFilterOptions } from "@mui/material";

export type ItemOptionType = {
  inputValue?: string;
  name: string;
};

type AddItemTextFieldProps = {
  value: ItemOptionType | null;
  setValue: (arg0: ItemOptionType | null) => void;
  options: ItemOptionType[];
};

export default function AddItemTextField({
  options,
  value,
  setValue,
}: AddItemTextFieldProps) {
  const filter = createFilterOptions<ItemOptionType>();

  return (
    <Autocomplete
      fullWidth={true}
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
          setValue({
            name: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            name: newValue.inputValue,
          });
        } else {
          setValue(newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.name);
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            inputValue,
            name: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="add-item"
      options={options}
      getOptionLabel={(option) => {
        if (typeof option === "string") {
          return option;
        }
        if (option.inputValue) {
          return option.inputValue;
        }
        return option.name;
      }}
      renderOption={(props, option) => <li {...props}>{option.name}</li>}
      freeSolo
      renderInput={(params) => (
        <TextField autoFocus {...params} label="Add new or existing item" />
      )}
    />
  );
}
