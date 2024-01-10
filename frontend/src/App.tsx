import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
} from "@mui/material";

import ShoppingList from "@/pages/ShoppingList";

function App() {
  return (
    <>
      <CssBaseline />

      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Cookie
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <main>
          <ShoppingList></ShoppingList>
        </main>
      </Container>
    </>
  );
}

export default App;
