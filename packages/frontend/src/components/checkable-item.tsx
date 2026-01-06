import classes from "./checkable-item.module.css";

type CheckableItemProps = {
  label: string;
  checked: boolean;
  changeCallback: (data: { checked: boolean; label: string }) => void;
};

function CheckableItem(props: CheckableItemProps) {
  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.changeCallback) {
      props.changeCallback({ checked: e.target.checked, label: props.label });
    }
  };

  const onLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.changeCallback) {
      props.changeCallback({ checked: props.checked, label: e.target.value });
    }
  };

  return (
    <div className={classes.container}>
      <input
        type="checkbox"
        onChange={(e) => onCheckboxChange(e)}
        checked={props.checked}
        aria-label={props.label}
      />
      <input
        type="text"
        onChange={(e) => onLabelChange(e)}
        value={props.label}
      />
    </div>
  );
}

export default CheckableItem;
