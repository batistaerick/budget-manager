import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import Input from './Input.component';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    id: 'story-input-id',
    label: 'Email Address',
    type: 'text',
    onChange: fn(),
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'number', 'email', 'tel'],
      description: 'The HTML type attribute for the input.',
    },
    value: {
      control: 'text',
      description: 'The current value of the input field.',
    },
    onChange: {
      action: 'changed',
      description: 'Callback function when the input value changes.',
    },
    onKeyDown: {
      action: 'key pressed',
      description: 'Callback function for key down events.',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, the input field is disabled.',
    },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultText: Story = {
  args: { label: 'Full Name', type: 'text' },
};

export const Password: Story = {
  args: { label: 'Password', id: 'password-input-id', type: 'password' },
};

export const WithDefaultValue: Story = {
  args: { label: 'Email Address', value: 'user@example.com', type: 'email' },
};

export const Disabled: Story = {
  args: { label: 'Username', value: 'johndoe', disabled: true },
};

export const NumberInput: Story = {
  args: { label: 'Age', type: 'number', value: 30 },
};
