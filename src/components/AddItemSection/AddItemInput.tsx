import { createRef } from "react";
import TextField from "@mui/material/TextField";

type AddItemCallback = (name: string) => void;
type Props = {
  addItemCallback?: AddItemCallback;
};

export default function AddItemInput({ addItemCallback }: Props) {
  const textInput = createRef<HTMLInputElement>();
  const onSubmit = (name: string) => {
    if (addItemCallback !== undefined) {
      addItemCallback(name);
    }

    if (textInput.current) {
      textInput.current.value = "";
    }
  };

  const onKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (textInput.current) {
        onSubmit(textInput.current.value);
      }
    }
  };
  return (
    <TextField
      inputRef={textInput}
      placeholder="Add item"
      onKeyDown={onKeydown}
    ></TextField>
  );
}
