import type { Meta, StoryObj } from "@storybook/react";
import { Bold } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

const meta: Meta<typeof Toggle> = {
  title: "UI/Toggle",
  component: Toggle,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    children: <Bold className="h-4 w-4" />,
    "aria-label": "Toggle bold",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: <Bold className="h-4 w-4" />,
    "aria-label": "Toggle bold",
  },
};

export const WithText: Story = {
  args: {
    children: (
      <>
        <Bold className="mr-2 h-4 w-4" />
        Bold
      </>
    ),
    "aria-label": "Toggle bold",
  },
};
