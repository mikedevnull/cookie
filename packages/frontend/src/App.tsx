import "./App.css";

import { DatabaseProvider } from "./db/provider.tsx";
import { ErrorBoundary } from "react-error-boundary";
import ShopList from "./pages/ShopList.tsx";
import { Navigate, Route, Routes } from "react-router";

function renderError(error: unknown) {
  return <div>Something went wrong: {String(error)}</div>;
}


function App() {
  return (
    <ErrorBoundary fallbackRender={({ error }) => renderError(error)}>
      <DatabaseProvider>
        <Routes>
          <Route index element={<Navigate to="/shoplist/0" replace />} />

          <Route path="/shoplist/:shoplistId" element={<ShopList />}></Route>

        </Routes>
      </DatabaseProvider>
    </ErrorBoundary>
  );
}

export default App;
