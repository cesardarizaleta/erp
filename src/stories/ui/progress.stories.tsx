import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

const meta: Meta<typeof Progress> = {
  title: "UI/Progress",
  component: Progress,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    value: 33,
  },
  render: args => (
    <div className="w-[300px]">
      <Progress {...args} />
    </div>
  ),
};

export const Animated: Story = {
  render: () => {
    const [progress, setProgress] = useState(13);

    useEffect(() => {
      const timer = setTimeout(() => setProgress(66), 500);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="w-[300px]">
        <Progress value={progress} />
      </div>
    );
  },
};
