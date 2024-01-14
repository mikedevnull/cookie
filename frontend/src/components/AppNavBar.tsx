import { AppBar, Toolbar, Typography } from "@mui/material";

export function AppNavBar() {
  return (
    <AppBar position="relative">
      <Toolbar>
        <Typography variant="h6" color="inherit" noWrap>
          Cookie
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
