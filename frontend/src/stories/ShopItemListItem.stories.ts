import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, expect } from "@storybook/test";
import ShopItemListItem from "@/components/ShopItemListItem";

const meta = {
  title: "Components/ShopItemListItem",
  component: ShopItemListItem,
  tags: ["autodocs"],
} satisfies Meta<typeof ShopItemListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    name: "Item name",
    active: true,
  },
};
