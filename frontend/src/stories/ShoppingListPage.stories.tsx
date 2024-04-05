import type { Meta, StoryObj } from "@storybook/react";

import ShoppingList from "@/pages/ShoppingList";
import { Database, createDatabase, insertDefaultData } from "@/db";
import { Provider } from "rxdb-hooks";
import { BrowserRouter } from "react-router-dom";

const meta = {
  title: "Pages/ShoppingList",
  component: ShoppingList,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story, { loaded: { db } }) => (
      <BrowserRouter>
        <Provider db={db}>
          <Story />
        </Provider>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof ShoppingList>;

export default meta;
type Story = StoryObj<typeof meta>;

let db: Database | undefined;

export const WithItems: Story = {
  loaders: [
    async () => {
      if (!db) {
        db = await createDatabase({ ignoreDuplicate: true });
      }
      await insertDefaultData(db);
      return { db };
    },
  ],
};

export const Empty: Story = {
  loaders: [],
};
