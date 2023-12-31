import "@mantine/core/styles.css";
import {
  MantineProvider,
  AppShell,
  Burger,
  Group,
  UnstyledButton,
  Container,
  ThemeIcon,
} from "@mantine/core";
import { DEFAULT_THEME } from "@mantine/core";
import "@/App.css";
import ShoppingList from "@/components/ShoppingList";
import classes from "./Navbar.module.css";
import { IconCookie } from "@tabler/icons-react";
import { useState } from "react";
import AddItemInput from "./components/AddItemSection/AddItemInput";

function App() {
  const [opened, setOpen] = useState(false);

  const toggle = () => {
    setOpen(!opened);
  };
  return (
    <MantineProvider theme={DEFAULT_THEME}>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened, desktop: true },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Group justify="space-between" style={{ flex: 1 }}>
              <ThemeIcon>
                <IconCookie />
              </ThemeIcon>
              <AddItemInput style={{ flex: 2 }}></AddItemInput>
              {/* <Group ml="xl" gap={0} visibleFrom="sm">
                <UnstyledButton className={classes.control}>
                  Home
                </UnstyledButton>
              </Group> */}
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md" px={4}>
          {/* <UnstyledButton className={classes.control}>Home</UnstyledButton> */}
        </AppShell.Navbar>

        <AppShell.Main>
          <ShoppingList />
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
