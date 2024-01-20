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
  item: Pick<Item, "name" | "active">;
  onToggle?: (item: Pick<Item, "name" | "active">) => void;
};

const TOGGLE_DELAY_IN_MS = 1000 as const;

type ItemState = "active" | "transitioning" | "inactive";

export default function ShopItemListItem({ item, onToggle }: Props) {
  const [itemState, setItemState] = useState<ItemState>(
    item.active ? "active" : "inactive"
  );
  useEffect(() => {
    if (itemState === "transitioning") {
      const timer = setTimeout(() => {
        if (onToggle) {
          onToggle(item);
        }
      }, TOGGLE_DELAY_IN_MS);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [itemState, item, onToggle]);

  const onClick = () => {
    if (itemState === "active") {
      setItemState("transitioning");
    } else {
      if (!item.active && onToggle) {
        onToggle(item);
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
          primary={item.name}
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
