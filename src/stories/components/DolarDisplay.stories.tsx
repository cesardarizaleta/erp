import type { Meta, StoryObj } from "@storybook/react";
import { DolarDisplay } from "@/components/DolarDisplay";

const meta: Meta<typeof DolarDisplay> = {
  title: "Components/DolarDisplay",
  component: DolarDisplay,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DolarDisplay>;

export const Default: Story = {
  render: () => (
    <div className="p-4 bg-slate-100 dark:bg-slate-900">
      <DolarDisplay />
    </div>
  ),
};
