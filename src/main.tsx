import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Database, initialize } from "./db";
import { Provider } from "rxdb-hooks";

export const Root = () => {
  const [db, setDb] = useState<Database>();

  useEffect(() => {
    initialize().then(setDb);
  }, []);

  return (
    <Provider db={db}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);
