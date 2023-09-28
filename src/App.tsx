import "@mantine/core/styles.css";
import { MantineProvider, Stack, Title } from "@mantine/core";
import { DEFAULT_THEME } from "@mantine/core";
import ShopItemList from "./components/ShopItemList";
import "./App.css";
import SearchAndAddItemField from "./components/SearchAndAddItemField";
const items = [
  { name: "Foo" },
  { name: "Bar" },
  { name: "Baz" },
  { name: "Fuu" },
];

function App() {
  return (
    <MantineProvider theme={DEFAULT_THEME}>
      <Stack justify="flex-start" h="100%">
        <SearchAndAddItemField></SearchAndAddItemField>
        <section>
          <Title order={3}>Shoppinglist</Title>
          <ShopItemList items={items}></ShopItemList>
        </section>
      </Stack>
    </MantineProvider>
  );
}

export default App;
