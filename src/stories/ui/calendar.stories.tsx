import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

const meta: Meta<typeof Calendar> = {
  title: "UI/Calendar",
  component: Calendar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
      <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
    );
  },
};

export const Range: Story = {
  render: () => {
    const [date, setDate] = useState<any>({
      from: new Date(),
      to: new Date(new Date().setDate(new Date().getDate() + 7)),
    });

    return (
      <Calendar mode="range" selected={date} onSelect={setDate} className="rounded-md border" />
    );
  },
};
