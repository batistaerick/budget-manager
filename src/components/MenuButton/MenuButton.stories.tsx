import type { Meta, StoryObj } from '@storybook/react';
import type { ButtonHTMLAttributes, JSX } from 'react';
import { FiLogOut, FiSettings, FiUser } from 'react-icons/fi';
import MenuButton from './MenuButton.component';

const meta: Meta<typeof MenuButton> = {
  title: 'Components/MenuButton',
  component: MenuButton,
  tags: ['autodocs'],
  argTypes: { onClick: { action: 'clicked' }, children: { control: false } },
} satisfies Meta<typeof MenuButton>;

export default meta;
type Story = StoryObj<typeof MenuButton>;

export const Default: Story = {
  render: (
    args: Readonly<ButtonHTMLAttributes<HTMLButtonElement>>
  ): JSX.Element => <MenuButton {...args}>Default Button</MenuButton>,
};

export const WithIcon: Story = {
  render: (
    args: Readonly<ButtonHTMLAttributes<HTMLButtonElement>>
  ): JSX.Element => (
    <MenuButton {...args}>
      <FiSettings size={20} />
      Settings
    </MenuButton>
  ),
};

export const Profile: Story = {
  render: (
    args: Readonly<ButtonHTMLAttributes<HTMLButtonElement>>
  ): JSX.Element => (
    <MenuButton {...args}>
      <FiUser size={20} />
      Profile
    </MenuButton>
  ),
};

export const Logout: Story = {
  render: (
    args: Readonly<ButtonHTMLAttributes<HTMLButtonElement>>
  ): JSX.Element => (
    <MenuButton {...args}>
      <FiLogOut size={20} />
      Logout
    </MenuButton>
  ),
};
