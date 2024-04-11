import type { Meta, StoryObj } from "@storybook/react";
import AddItemDialog from "@/components/AddItemDialog";

const meta = {
  title: "Components/AddItemDialog",
  component: AddItemDialog,
  argTypes: {
    onAdd: { action: "added" },
    onClose: { action: "closed" },
  },
} satisfies Meta<typeof AddItemDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    open: true,
    onClose: () => {},
    options: [
      { name: "Item A" },
      { name: "Bar" },
      { name: "Foo" },
      { name: "Baz" },
    ],
  },
};
