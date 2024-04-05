import type { Meta, StoryObj } from "@storybook/react";
import { withRouter } from "storybook-addon-remix-react-router";

import ShoppingList from "@/pages/ShoppingList";
import { Database, createDatabase, insertDefaultData } from "@/db";
import { Provider } from "rxdb-hooks";
import { CssBaseline } from "@mui/material";

const meta = {
  title: "Pages/ShoppingList",
  component: ShoppingList,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    withRouter,
    (Story, { loaded: { db } }) => (
      <Provider db={db}>
        <CssBaseline />
        <Story />
      </Provider>
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
