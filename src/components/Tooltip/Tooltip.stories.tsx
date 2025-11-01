import type { Meta, StoryObj } from '@storybook/react';
import type { JSX } from 'react';
import Tooltip, { type TooltipProps } from './Tooltip.component';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    tooltip: { control: 'text' },
    placement: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'left', 'right'],
    },
    children: { control: false },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: { tooltip: 'This is a tooltip!' },
  render: (args: TooltipProps): JSX.Element => (
    <Tooltip {...args}>
      <div className="w-32 cursor-pointer rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Hover me
      </div>
    </Tooltip>
  ),
};

export const Bottom: Story = {
  args: { tooltip: 'Tooltip at the bottom', placement: 'bottom' },
  render: (args: TooltipProps): JSX.Element => (
    <Tooltip {...args}>
      <button className="w-32 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
        Hover me
      </button>
    </Tooltip>
  ),
};

export const Left: Story = {
  args: { tooltip: 'Tooltip on the left', placement: 'left' },
  render: (args: TooltipProps): JSX.Element => (
    <Tooltip {...args}>
      <button className="w-32 rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
        Hover me
      </button>
    </Tooltip>
  ),
};

export const Top: Story = {
  args: { tooltip: 'Tooltip on the top', placement: 'top' },
  render: (args: TooltipProps): JSX.Element => (
    <Tooltip {...args}>
      <button className="w-32 rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700">
        Hover me
      </button>
    </Tooltip>
  ),
};
