import type { Meta, StoryObj } from '@storybook/react';
import {{Name}}Page from '@/features/{{name}}/pages/{{Name}}';

const meta: Meta<typeof {{Name}}Page> = {
  title: 'Features/{{Name}}',
  component: {{Name}}Page,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof {{Name}}Page>;

export const Default: Story = {
  args: {},
};
