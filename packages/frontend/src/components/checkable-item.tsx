import { startTransition, useId, useOptimistic } from "react";

export type CheckableItemData = {
  label: string;
  checked: boolean;
};

type CheckableItemProps = CheckableItemData & {
  changeCallback: (data: CheckableItemData) => void;
};

function CheckableItem(props: CheckableItemProps) {
  const [isChecked, setOptimisticChecked] = useOptimistic(props.checked, (_state, newState: boolean) => { return newState; });
  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.changeCallback) {
      startTransition(async () => {
        setOptimisticChecked(e.target.checked);
        await new Promise((res) => setTimeout(res, 500));
        props.changeCallback({ checked: e.target.checked, label: props.label });
      })
    }
  };

  const onLabelChange = (label: string) => {
    if (props.changeCallback) {
      if (label !== props.label)
        props.changeCallback({
          checked: isChecked,
          label,
        });
    }
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    }
  };

  const checkboxLabelId = useId();

  return (
    <li className="list-row">
      <input type="checkbox" onChange={(e) => onCheckboxChange(e)}
        checked={isChecked}
        aria-label={props.label} aria-labelledby={checkboxLabelId} className="checkbox checkbox-primary place-self-center" />
      <input type="text" id={checkboxLabelId}
        onFocus={(e) => e.currentTarget.select()}
        onBlur={(e) => onLabelChange(e.target.value)}
        onKeyDown={onKeyPress}
        defaultValue={props.label} className={"input input-ghost w-full " + (isChecked ? "line-through" : "")} />
    </li>
  );
}

export default CheckableItem;
