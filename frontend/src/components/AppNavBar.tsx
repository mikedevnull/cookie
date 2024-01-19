import { AppBar, Toolbar, Typography } from "@mui/material";
import { PropsWithChildren } from "react";

export function AppNavBar({ children }: PropsWithChildren) {
  return (
    <AppBar position="sticky">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          color="inherit"
          sx={{
            flexShrink: 0,
            paddingX: 2,
            display: { xs: "none", sm: "flex" },
          }}
          noWrap
        >
          Cookie
        </Typography>
        {children}
      </Toolbar>
    </AppBar>
  );
}
