import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: "Type your message here.",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Type your message here.",
    disabled: true,
  },
};

export const WithLabel: Story = {
  render: args => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea {...args} id="message" />
      <p className="text-sm text-muted-foreground">
        Your message will be sent to the support team.
      </p>
    </div>
  ),
  args: {
    placeholder: "Type your message here.",
  },
};

export const WithButton: Story = {
  render: args => (
    <div className="grid w-full gap-2">
      <Textarea {...args} />
      <Button>Send message</Button>
    </div>
  ),
  args: {
    placeholder: "Type your message here.",
  },
};
