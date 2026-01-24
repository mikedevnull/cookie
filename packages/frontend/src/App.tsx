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
    <>
      <div className="flex flex-col h-full justify-between">
        <header>
          <div className="navbar bg-base-100 shadow-sm">
            <a className="btn btn-ghost text-xl">Cookie</a>
          </div>
        </header>
        <main className="p-4 grow self-center w-full md:w-3xl">
          <ErrorBoundary fallbackRender={({ error }) => renderError(error)}>
            <DatabaseProvider>
              <ShopList />
            </DatabaseProvider>
          </ErrorBoundary>
        </main>
        <PWABadge />
      </div >
    </>
  );
}

export default App;
