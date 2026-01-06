import classes from "./checkable-item.module.css";

type NewItemInputProps = {
  onNewItemCallback?: (label: string) => void;
};

export default function NewItemInput(props: NewItemInputProps) {
  const onNewItem = (element: HTMLInputElement) => {
    const label = element.value;
    if (label && props.onNewItemCallback) {
      console.log(label);
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
    <div className={classes.container}>
      <div className={classes.fakeCheckbox} />
      <input
        type="text"
        onBlur={(e) => onNewItem(e.currentTarget)}
        onKeyDown={onKeyPress}
        className={classes.newItem}
      />
    </div>
  );
}
