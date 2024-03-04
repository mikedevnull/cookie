import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";
import AddItemTextField, { ItemOptionType } from "./AddItemTextField";

type AddItemDialogProps = {
  open: boolean;
  options: ItemOptionType[];
  onClose: () => void;
  onAdd?: (name: string) => void;
};

export default function AddItemDialog({
  open,
  onClose,
  options,
  onAdd,
}: AddItemDialogProps) {
  const [value, setValue] = useState<ItemOptionType | null>(null);
  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog
      fullWidth={true}
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();

          if (value && onAdd) {
            onAdd(value.name);
          }
          setValue({ inputValue: undefined, name: "" });
        },
      }}
    >
      <DialogTitle>Add item</DialogTitle>
      <DialogContentText />
      <DialogContent>
        <AddItemTextField
          value={value}
          setValue={setValue}
          options={options}
        ></AddItemTextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">Add</Button>
      </DialogActions>
    </Dialog>
  );
}
