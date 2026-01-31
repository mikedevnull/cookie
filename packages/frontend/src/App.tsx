import "./App.css";

import { DatabaseProvider } from "./db/provider.tsx";
import { ErrorBoundary } from "react-error-boundary";
import ShopList from "./pages/ShopList.tsx";

function renderError(error: unknown) {
  return <div>Something went wrong: {String(error)}</div>;
}

function App() {
  return (
    <ErrorBoundary fallbackRender={({ error }) => renderError(error)}>
      <DatabaseProvider>
        <ShopList></ShopList>
      </DatabaseProvider>
    </ErrorBoundary>
  );
}

export default App;
