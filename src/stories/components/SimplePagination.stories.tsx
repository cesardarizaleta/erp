import type { Meta, StoryObj } from "@storybook/react";
import { SimplePagination } from "@/components/SimplePagination";

const meta: Meta<typeof SimplePagination> = {
  title: "Components/SimplePagination",
  component: SimplePagination,
  tags: ["autodocs"],
  argTypes: {
    currentPage: { control: "number" },
    totalPages: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof SimplePagination>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page: number) => console.log(`Page changed to ${page}`),
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    onPageChange: (page: number) => console.log(`Page changed to ${page}`),
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
    onPageChange: (page: number) => console.log(`Page changed to ${page}`),
  },
};
