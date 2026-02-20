import { useRef } from "react";

type NewItemInputProps = {
  onNewItemCallback?: (label: string) => void;
};

export default function NewItemInput(props: NewItemInputProps) {
  const inputFieldRef = useRef<HTMLInputElement>(null)
  const onNewItem = () => {
    if (!inputFieldRef.current) {
      return
    }
    const label = inputFieldRef.current.value;
    if (label && props.onNewItemCallback) {
      props.onNewItemCallback(label.trim());
    }
    inputFieldRef.current.value = "";
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onNewItem();
    }
  };

  return (
    <div className="join w-full my-4">
      <input
        ref={inputFieldRef}
        type="text"
        placeholder="New item"
        onKeyDown={onKeyPress}
        className="input w-full join-item"
      />
      <button className="btn btn-neutral join-item" onClick={onNewItem}>Add</button>
    </div >
  );
}
