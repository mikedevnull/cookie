export type ItemState = "active" | "done" | "hidden";

export type Item = {
  name: string;
  state: ItemState;
  rankOrder: number;
};
