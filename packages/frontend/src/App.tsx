import PWABadge from "./PWABadge.tsx";
import "./App.css";
import CheckableItem from "./components/checkable-item.tsx";
import { useState } from "react";

type Item = {
  name: string;
  checked: boolean;
};

function App() {
  const [item, setItem] = useState<Item>({ name: "Foo", checked: false });
  return (
    <>
      <CheckableItem
        checked={item.checked}
        label={item.name}
        changeCallback={(data) =>
          setItem({ name: data.label, checked: data.checked })
        }
      />
      <PWABadge />
    </>
  );
}

export default App;
