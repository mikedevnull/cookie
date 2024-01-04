import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.tsx";
import "@/index.css";
import { DatabaseProvider } from "@/db";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <DatabaseProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </DatabaseProvider>
);
