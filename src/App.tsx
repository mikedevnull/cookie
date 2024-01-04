import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Stack,
} from "@mui/material";

import ShoppingList from "./components/ShoppingList";
import AddItemSection from "./components/AddItemSection";

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
          <Stack>
            <AddItemSection></AddItemSection>
            <ShoppingList></ShoppingList>
          </Stack>
        </main>
      </Container>
    </>
  );
}

export default App;
