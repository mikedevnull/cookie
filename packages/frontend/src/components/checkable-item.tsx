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

  const onLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.changeCallback) {
      const effectiveValue =
        e.target.value.length === 0 ? undefined : e.target.value;
      if (effectiveValue !== props.label)
        props.changeCallback({
          checked: isChecked,
          label: effectiveValue,
        });
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
        onChange={(e) => onLabelChange(e)}
        value={props.label}
        className={props.label ? undefined : classes.newItem}
      />
    </div>
  );
}

export default CheckableItem;
