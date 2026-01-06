import classes from "./checkable-item.module.css";

type CheckableItemProps = {
  label?: string;
  checked: boolean;
  changeCallback: (data: { checked: boolean; label?: string }) => void;
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
      const effectiveValue = label.length === 0 ? undefined : label;
      console.log(effectiveValue);
      if (effectiveValue !== props.label)
        props.changeCallback({
          checked: isChecked,
          label: effectiveValue,
        });
    }
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onLabelChange(event.currentTarget.value);
    }
  };

  const checkbox = (
    <input
      type="checkbox"
      onChange={(e) => onCheckboxChange(e)}
      checked={isChecked}
      disabled={!props.label}
      aria-label={props.label}
    />
  );

  return (
    <div className={classes.container}>
      {checkbox}
      <input
        type="text"
        onFocus={(e) => e.currentTarget.select()}
        onBlur={(e) => onLabelChange(e.target.value)}
        onKeyDown={onKeyPress}
        defaultValue={props.label}
        className={props.label ? undefined : classes.newItem}
      />
    </div>
  );
}

export default CheckableItem;
