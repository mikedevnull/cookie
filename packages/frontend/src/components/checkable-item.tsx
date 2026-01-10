import { useId } from "react";
import classes from "./checkable-item.module.css";

export type CheckableItemData = {
  label: string;
  checked: boolean;
};

type CheckableItemProps = CheckableItemData & {
  changeCallback: (data: CheckableItemData) => void;
};

function CheckableItem(props: CheckableItemProps) {
  const isChecked = !props.label ? false : props.checked;
  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.changeCallback) {
      props.changeCallback({ checked: e.target.checked, label: props.label });
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

  const checkbox = (
    <input
      type="checkbox"
      onChange={(e) => onCheckboxChange(e)}
      checked={isChecked}
      aria-label={props.label}
      aria-labelledby={checkboxLabelId}
    />
  );

  return (
    <div className={classes.container}>
      {checkbox}
      <input
        className={props.checked ? classes.checked : ""}
        id={checkboxLabelId}
        type="text"
        onFocus={(e) => e.currentTarget.select()}
        onBlur={(e) => onLabelChange(e.target.value)}
        onKeyDown={onKeyPress}
        defaultValue={props.label}
      />
    </div>
  );
}

export default CheckableItem;
