import type { Item } from "./types";

export const initialItems: Item[] = [
  { name: "Äpfel", active: true },
  { name: "Bananen", active: false },
  { name: "Tomaten", active: true },
  { name: "Brot", active: false },
  { name: "Butter", active: true },
  { name: "Backpulver", active: false },
  { name: "Duschgel", active: true },
  { name: "Hackfleisch", active: false },
  { name: "Schnitzel", active: true },
  { name: "Käse", active: false },
  { name: "Ketchup", active: true },
  { name: "Zahnpasta", active: false },
  { name: "Milch", active: true },
  { name: "Sojamilch", active: false },
  { name: "Nudeln", active: true },
  { name: "Pommes Frites", active: false },
  { name: "Reis", active: true },
  { name: "Salz", active: false },
  { name: "Tortellini", active: true },
  { name: "Waschmittel", active: false },
  { name: "Zitrone", active: true },
].map(
  (n) =>
    ({
      ...n,
      rankOrder: 0,
    }) satisfies Item
);
