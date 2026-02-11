import "./App.css";

import { DatabaseProvider } from "./db/provider.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { Navigate, Route, Routes } from "react-router";
import { lazy } from "react";

const ShopListSettings = lazy(() => import('./pages/ShopListSettings.tsx'));
const NotFound = lazy(() => import('./pages/NotFound.tsx'));
const ShopList = lazy(() => import('./pages/ShopList.tsx'));
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
          <Route path="/shoplist/:shoplistId/settings" element={<ShopListSettings />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />

        </Routes>
      </DatabaseProvider>
    </ErrorBoundary>
  );
}

export default App;
