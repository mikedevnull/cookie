import { CssBaseline } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router";
import ShoppingList from "@/pages/ShoppingList";
import AddItem from "@/pages/AddItem";
import { createAddItemAction } from "@/pages/AddItem";
import { useRxDB } from "rxdb-hooks";
import { Database } from "./db";
import { useMemo } from "react";

function App() {
  const db: Database = useRxDB();
  const collection = db?.items;
  const addItemAction = useMemo(() => {
    console.log("foo ", collection);
    return createAddItemAction(collection);
  }, [collection]);

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <ShoppingList />,
      },
      { path: "/add", element: <AddItem />, action: addItemAction },
    ],
    { basename: import.meta.env.BASE_URL }
  );

  return (
    <>
      <CssBaseline />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
