type NewItemInputProps = {
  onNewItemCallback?: (label: string) => void;
};

export default function NewItemInput(props: NewItemInputProps) {
  const onNewItem = (element: HTMLInputElement) => {
    const label = element.value;
    if (label && props.onNewItemCallback) {
      props.onNewItemCallback(label);
    }
    element.value = "";
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onNewItem(event.currentTarget);
    }
  };

  return (
    <input
      type="text"
      onBlur={(e) => onNewItem(e.currentTarget)}
      placeholder="New item"
      onKeyDown={onKeyPress}
      className="input w-full my-4"
    />
  );
}
