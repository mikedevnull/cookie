import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, expect } from "@storybook/test";
import ShopItemListItem from "@/components/ShopItemListItem";

const meta = {
  title: "Components/ShopItemListItem",
  component: ShopItemListItem,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ShopItemListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    name: "ItemName",
    active: true,
  },
};
