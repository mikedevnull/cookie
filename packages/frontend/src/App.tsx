import PWABadge from "./PWABadge.tsx";
import "./App.css";

import { DatabaseProvider } from "./db/provider.tsx";
import ShopList from "./pages/ShopList.tsx";
import { ErrorBoundary } from "react-error-boundary";

function renderError(error: unknown) {
  return <div>Something went wrong: {String(error)}</div>;
}

function App() {
  return (
    <ErrorBoundary fallbackRender={({ error }) => renderError(error)}>
      <DatabaseProvider>
        <ShopList />
      </DatabaseProvider>
      <PWABadge />
    </ErrorBoundary>
  );
}

export default App;
