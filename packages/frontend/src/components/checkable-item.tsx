import { startTransition, useId, useOptimistic } from "react";

const ThreeDotsIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
  <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
</svg>

export type CheckableItemData = {
  label: string;
  checked: boolean;

};

type CheckableItemProps = CheckableItemData & {
  changeCallback: (data: CheckableItemData) => void;
  triggerChangeCategoryCallback?: () => void
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
      <div className="dropdown dropdown-bottom dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-square">{ThreeDotsIcon}</div>
        <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
          <li><a onClick={() => { if (props.triggerChangeCategoryCallback) { props.triggerChangeCategoryCallback() } }}>Change category</a></li>
        </ul>
      </div>
    </li>
  );
}

export default CheckableItem;
