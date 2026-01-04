import type { Meta, StoryObj } from "@storybook/react";
import { QuickAccess } from "@/components/QuickAccess";

const meta: Meta<typeof QuickAccess> = {
  title: "Components/QuickAccess",
  component: QuickAccess,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof QuickAccess>;

export const Default: Story = {};
