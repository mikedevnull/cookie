import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
} from "@mui/material";

import ShoppingList from "./components/ShoppingList";
import AddItemInput from "./components/AddItemSection/AddItemInput";

function App() {
  return (
    <>
      <CssBaseline />
      <Container>
        <AppBar position="relative">
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              Cookie
            </Typography>
          </Toolbar>
        </AppBar>
        <main>
          <AddItemInput></AddItemInput>
          <ShoppingList></ShoppingList>
        </main>
      </Container>
    </>
  );
}

export default App;
