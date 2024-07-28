import type { Item, ItemState } from "./types";

export const initialItems: Item[] = [
  { name: "Äpfel", state: "active" as ItemState },
  { name: "Bananen", state: "hidden" as ItemState },
  { name: "Tomaten", state: "active" as ItemState },
  { name: "Brot", state: "hidden" as ItemState },
  { name: "Butter", state: "active" as ItemState },
  { name: "Backpulver", state: "hidden" as ItemState },
  { name: "Duschgel", state: "active" as ItemState },
  { name: "Hackfleisch", state: "hidden" as ItemState },
  { name: "Schnitzel", state: "active" as ItemState },
  { name: "Käse", state: "hidden" as ItemState },
  { name: "Ketchup", state: "active" as ItemState },
  { name: "Zahnpasta", state: "hidden" as ItemState },
  { name: "Milch", state: "active" as ItemState },
  { name: "Sojamilch", state: "hidden" as ItemState },
  { name: "Nudeln", state: "active" as ItemState },
  { name: "Pommes Frites", state: "hidden" as ItemState },
  { name: "Reis", state: "active" as ItemState },
  { name: "Salz", state: "hidden" as ItemState },
  { name: "Tortellini", state: "active" as ItemState },
  { name: "Waschmittel", state: "hidden" as ItemState },
  { name: "Zitrone", state: "active" as ItemState },
].map(
  (n) =>
    ({
      ...n,
      rankOrder: 0,
    }) satisfies Item
);
