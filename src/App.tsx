import "@mantine/core/styles.css";
import { MantineProvider, Stack } from "@mantine/core";
import { DEFAULT_THEME } from "@mantine/core";
import AddItemSection from "@/components/AddItemSection";
import "@/App.css";
import ShoppingList from "@/components/ShoppingList";

function App() {
  return (
    <MantineProvider theme={DEFAULT_THEME}>
      <Stack justify="flex-start" h="100%">
        <AddItemSection></AddItemSection>
        <ShoppingList></ShoppingList>
      </Stack>
    </MantineProvider>
  );
}

export default App;
