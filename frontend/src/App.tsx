import { CssBaseline, Container } from "@mui/material";

import ShoppingList from "@/pages/ShoppingList";
import { AppNavBar } from "@/components/AppNavBar";

function App() {
  return (
    <>
      <CssBaseline />
      <AppNavBar />
      <Container maxWidth="sm">
        <main>
          <ShoppingList></ShoppingList>
        </main>
      </Container>
    </>
  );
}

export default App;
