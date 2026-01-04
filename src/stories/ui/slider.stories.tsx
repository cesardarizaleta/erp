import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "@/components/ui/slider";

const meta: Meta<typeof Slider> = {
  title: "UI/Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {
    defaultValue: { control: "object" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
  },
  render: args => (
    <div className="w-[300px]">
      <Slider {...args} />
    </div>
  ),
};

export const Range: Story = {
  args: {
    defaultValue: [25, 75],
    max: 100,
    step: 1,
  },
  render: args => (
    <div className="w-[300px]">
      <Slider {...args} />
    </div>
  ),
};

export const Steps: Story = {
  args: {
    defaultValue: [20],
    max: 100,
    step: 20,
  },
  render: args => (
    <div className="w-[300px]">
      <Slider {...args} />
    </div>
  ),
};
