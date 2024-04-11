import { AppBar, Toolbar, Typography } from "@mui/material";
import React, { PropsWithChildren } from "react";

type AppNavBarProps = {
  leftAction?: React.ReactNode;
  title?: string;
} & PropsWithChildren;

export function AppNavBar({ leftAction, title, children }: AppNavBarProps) {
  return (
    <AppBar position="sticky">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {leftAction}
        <Typography
          variant="h6"
          color="inherit"
          sx={{
            flexShrink: 0,
            paddingX: 2,
            display: "flex",
          }}
          noWrap
        >
          {title ?? "Cookie"}
        </Typography>
        {children}
      </Toolbar>
    </AppBar>
  );
}
