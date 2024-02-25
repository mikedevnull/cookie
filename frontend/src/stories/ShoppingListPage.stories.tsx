import type { Meta, StoryObj } from "@storybook/react";

import ShoppingList from "@/pages/ShoppingList";
import { createDatabase, insertDefaultData } from "@/db";
import { Provider } from "rxdb-hooks";

const meta = {
  title: "Pages/ShoppingList",
  component: ShoppingList,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story, { loaded: { db } }) => (
      <Provider db={db}>
        <Story />
      </Provider>
    ),
  ],
} satisfies Meta<typeof ShoppingList>;

export default meta;
type Story = StoryObj<typeof meta>;

const db = await createDatabase();

export const WithItems: Story = {
  loaders: [
    async () => {
      await insertDefaultData(db);
      return { db };
    },
  ],
};

export const Empty: Story = {
  loaders: [],
};
