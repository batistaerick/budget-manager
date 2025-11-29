import type { Meta, StoryObj } from '@storybook/react';
import Money from './Money.component';

const meta: Meta<typeof Money> = {
  title: 'Components/Money',
  component: Money,
  tags: ['autodocs'],
  argTypes: { value: { control: 'number' }, className: { control: 'text' } },
} satisfies Meta<typeof Money>;

export default meta;
type Story = StoryObj<typeof Money>;

export const Default: Story = {
  args: { value: 1234.56, className: 'text-lg text-green-500' },
};

export const LargeNumber: Story = {
  args: { value: 9876543.21, className: 'text-2xl text-blue-600' },
};

export const Empty: Story = {
  args: { value: undefined, className: 'text-gray-400' },
};
