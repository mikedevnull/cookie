import PWABadge from "./PWABadge.tsx";
import "./App.css";
import CheckableItem from "./components/checkable-item.tsx";
import { useState } from "react";
import { DatabaseProvider } from "./db/provider.tsx";
import { clearDatabase } from "./db/database.ts";

type Item = {
  name?: string;
  checked: boolean;
};

function App() {
  const [item, setItem] = useState<Item>({ name: "Foo", checked: false });

  let resetDatabaseButton;
  if (import.meta.env.DEV) {
    resetDatabaseButton = (
      <button
        onClick={() => {
          clearDatabase();
          window.location.reload();
        }}
      >
        Clear database
      </button>
    );
  }

  return (
    <>
      <DatabaseProvider>
        <CheckableItem
          checked={item.checked}
          label={item.name}
          changeCallback={(data) =>
            setItem({ name: data.label, checked: data.checked })
          }
        />
      </DatabaseProvider>
      {resetDatabaseButton}
      <PWABadge />
    </>
  );
}

export default App;
