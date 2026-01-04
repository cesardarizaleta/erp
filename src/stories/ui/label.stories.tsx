import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const meta: Meta<typeof Label> = {
  title: "UI/Label",
  component: Label,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: "Accept terms and conditions",
  },
};

export const WithInput: Story = {
  render: () => (
    <div>
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
    </div>
  ),
};
