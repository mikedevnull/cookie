import { AppBar, Toolbar, Typography } from "@mui/material";
import { PropsWithChildren } from "react";

export function AppNavBar({ children }: PropsWithChildren) {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }} noWrap>
          Cookie
        </Typography>
        {children}
      </Toolbar>
    </AppBar>
  );
}
