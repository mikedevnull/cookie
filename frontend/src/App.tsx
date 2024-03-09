import { CssBaseline } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ShoppingList from "@/pages/ShoppingList";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <ShoppingList />,
    },
  ],
  { basename: import.meta.env.BASE_URL }
);

function App() {
  return (
    <>
      <CssBaseline />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
