import { Item } from "@/db/types";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { useEffect, useId, useState } from "react";

type Props = {
  name: string;
  active: boolean;
  onToggle?: () => void;
};

const TOGGLE_DELAY_IN_MS = 1000 as const;

type ItemState = "active" | "transitioning" | "inactive";

export default function ShopItemListItem({ name, active, onToggle }: Props) {
  const [itemState, setItemState] = useState<ItemState>(
    active ? "active" : "inactive"
  );
  useEffect(() => {
    if (itemState === "transitioning") {
      const timer = setTimeout(() => {
        if (onToggle) {
          onToggle();
        }
      }, TOGGLE_DELAY_IN_MS);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [itemState, { name, active }, onToggle]);

  const onClick = () => {
    if (itemState === "active") {
      setItemState("transitioning");
    } else {
      if (!active && onToggle) {
        onToggle();
      }
      setItemState("active");
    }
  };

  const labelId = useId();
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={itemState !== "active"}
            tabIndex={-1}
            disableRipple
            inputProps={{ "aria-labelledby": labelId }}
          />
        </ListItemIcon>
        <ListItemText
          id={labelId}
          primary={name}
          primaryTypographyProps={
            itemState !== "active"
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
