import type { Meta, StoryObj } from '@storybook/react';
import type { JSX } from 'react';
import { fn } from 'storybook/test';
import DatePickerCustomButton, {
  type DatePickerCustomButtonProps,
} from './DatePickerCustomButton.component';

const meta: Meta<typeof DatePickerCustomButton> = {
  title: 'Components/DatePickerCustomButton',
  component: DatePickerCustomButton,
  tags: ['autodocs'],
  args: {
    arrows: true,
    onClick: fn(),
    setDate: undefined,
    value: <div></div>,
  },
  argTypes: {
    arrows: {
      control: { type: 'boolean' },
      description: 'If true, shows navigation arrows for changing the date',
      table: {
        category: 'Props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onClick: {
      action: 'setDate',
      description: 'SetStateAction to change the selected date',
    },
  },
} satisfies Meta<typeof DatePickerCustomButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DisabledArrows: Story = {
  args: { arrows: false },
  render: (args: DatePickerCustomButtonProps): JSX.Element => (
    <DatePickerCustomButton {...args}>
      <div>test</div>
    </DatePickerCustomButton>
  ),
};
