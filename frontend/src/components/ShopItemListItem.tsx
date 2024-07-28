import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { useId } from "react";

type Props = {
  name: string;
  active: boolean;
  onToggle?: () => void;
};

export default function ShopItemListItem({ name, active, onToggle }: Props) {
  const onClick = () => {
    if (onToggle) {
      onToggle();
    }
  };

  const labelId = useId();
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={!active}
            tabIndex={-1}
            disableRipple
            inputProps={{ "aria-labelledby": labelId }}
          />
        </ListItemIcon>
        <ListItemText
          id={labelId}
          primary={name}
          primaryTypographyProps={
            !active
              ? {
                  style: { textDecoration: "line-through" },
                }
              : {}
          }
        />
      </ListItemButton>
    </ListItem>
  );
}
