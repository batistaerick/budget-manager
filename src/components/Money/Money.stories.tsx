import '@/app/globals.css';
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

// Base story
export const Default: Story = {
  args: { value: 1234.56, className: 'text-lg text-green-500' },
};

// Large number
export const LargeNumber: Story = {
  args: { value: 9876543.21, className: 'text-2xl text-blue-600' },
};

// BigInt support
export const BigIntValue: Story = {
  args: { value: 1234567890123n, className: 'text-xl text-purple-500' },
};

// No value
export const Empty: Story = {
  args: { value: undefined, className: 'text-gray-400' },
};
