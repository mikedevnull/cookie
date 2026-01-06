export type Item = {
  name: string;
  checked: boolean;
  category?: string;
};

export type Category = {
  id: string;
  label: string;
};

export type ItemList = {
  id: string;
  label: string;
  categories: Category[];
  items: Item[];
};
