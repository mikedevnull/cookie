import { TextInput } from "@mantine/core";
import { CSSProperties, createRef } from "react";

type AddItemCallback = (name: string) => void;
type Props = {
  addItemCallback?: AddItemCallback;
  style: CSSProperties;
};

export default function AddItemInput({ addItemCallback, style }: Props) {
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
      onSubmit(e.currentTarget.value);
    }
  };
  return (
    <TextInput
      style={style}
      ref={textInput}
      placeholder="Add item"
      onKeyDown={onKeydown}
    ></TextInput>
  );
}
