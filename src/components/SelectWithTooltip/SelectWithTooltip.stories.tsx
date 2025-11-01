import type { Meta, StoryObj } from '@storybook/react';
import type { ChangeEvent } from 'react';
import { LuDroplet, LuUsers } from 'react-icons/lu';
import SelectWithTooltip from './SelectWithTooltip.component';

interface Option {
  label: string;
  value: string | number;
}

const mockOptions: Option[] = [
  { label: 'Option 1', value: 'one' },
  { label: 'Option 2', value: 'two' },
  { label: 'Option 3', value: 'three' },
  { label: 'Option 4', value: 4 },
];

const mockOnChange = ({
  target: { value },
}: ChangeEvent<HTMLSelectElement>): void => {
  console.log('Selected value:', value);
};

const meta: Meta<typeof SelectWithTooltip> = {
  title: 'Components/Select With Tooltip',
  component: SelectWithTooltip,
  tags: ['autodocs'],
  args: {
    id: 'story-select-id',
    options: mockOptions,
    tooltip: 'Choose an option from the list.',
    icon: <LuDroplet className="size-5 text-zinc-400" />,
    onChange: mockOnChange,
    value: 'one',
    disabled: false,
  },
  argTypes: {
    onChange: { action: 'changed', table: { disable: true } },
    icon: {
      control: false,
      description: 'A React Node to display as an icon above the select field.',
    },
    options: {
      control: 'object',
      description: 'An array of options for the select element.',
    },
    value: {
      control: 'select',
      options: mockOptions.map(({ value }: Option): string | number => value),
      description: 'The currently selected value.',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, the select is disabled.',
    },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof SelectWithTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DifferentIconAndValue: Story = {
  args: {
    icon: <LuUsers className="size-5 text-zinc-400" />,
    value: 4,
    tooltip: 'Select the number of users to include.',
  },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'two' },
};

export const LongTooltip: Story = {
  args: {
    tooltip:
      'This is a very long tooltip message that should demonstrate how the tooltip behaves when it contains a lot of text, ensuring it wraps or handles overflow gracefully based on the Tooltip component implementation.',
  },
};
