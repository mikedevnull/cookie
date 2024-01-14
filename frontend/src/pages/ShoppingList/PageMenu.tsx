import { DoneAll, MoreVert, RemoveDone } from "@mui/icons-material";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

type ValueWithAction<T> = {
  value: T;
  callback: (arg0: T) => void;
};

type PageMenuProps = {
  showInactive: ValueWithAction<boolean>;
};

export function PageMenu({ showInactive }: PageMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = () => {
    if (showInactive.value) {
      return (
        <MenuItem
          onClick={() => {
            handleClose();
            showInactive.callback(false);
          }}
        >
          <ListItemIcon>
            <RemoveDone></RemoveDone>
          </ListItemIcon>
          <ListItemText>Hide inactive items</ListItemText>
        </MenuItem>
      );
    } else {
      return (
        <MenuItem
          onClick={() => {
            handleClose();
            showInactive.callback(true);
          }}
        >
          <ListItemIcon>
            <DoneAll></DoneAll>
          </ListItemIcon>
          <ListItemText>Show inactive items</ListItemText>
        </MenuItem>
      );
    }
  };

  return (
    <>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <MoreVert></MoreVert>
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuItems()}
      </Menu>
    </>
  );
}
