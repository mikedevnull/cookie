import type { Meta, StoryObj } from "@storybook/react";
import {
  withRouter,
  reactRouterParameters,
} from "storybook-addon-remix-react-router";

import AddItem from "@/pages/AddItem";
import { createAddItemAction } from "@/pages/AddItem";
import { Database, createDatabase, insertDefaultData } from "@/db";
import { Provider } from "rxdb-hooks";

import { CssBaseline } from "@mui/material";

const meta = {
  title: "Pages/AddItem",
  component: AddItem,
  parameters: {
    layout: "fullscreen",
    reactRouter: reactRouterParameters({
      routing: { path: "/", action: createAddItemAction(null) },
    }),
  },
  decorators: [
    (Story, { loaded: { db } }) => {
      return (
        <Provider db={db}>
          <CssBaseline />
          <Story />
        </Provider>
      );
    },
    withRouter(),
  ],
} satisfies Meta<typeof AddItem>;

export default meta;
type Story = StoryObj<typeof meta>;

let db: Database | undefined;

export const Default: Story = {
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
