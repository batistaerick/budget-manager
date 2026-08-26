import type { Meta, StoryObj } from '@storybook/nextjs-vite';
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
  args: { value: 1234.56, className: 'text-lg text-[var(--ctp-green)]' },
};

export const LargeNumber: Story = {
  args: { value: 9876543.21, className: 'text-2xl text-[var(--ctp-blue)]' },
};

export const Empty: Story = {
  args: { value: undefined, className: 'text-[var(--ctp-subtext0)]' },
};
