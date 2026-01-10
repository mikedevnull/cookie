import PWABadge from "./PWABadge.tsx";
import "./App.css";

import { DatabaseProvider } from "./db/provider.tsx";
import { clearDatabase } from "./db/database.ts";
import ShopList from "./pages/ShopList.tsx";

function App() {
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
        <ShopList />
      </DatabaseProvider>
      {resetDatabaseButton}
      <PWABadge />
    </>
  );
}

export default App;
