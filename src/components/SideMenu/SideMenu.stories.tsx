import '@/app/globals.css';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import SideMenu from './SideMenu.component';

const meta: Meta<typeof SideMenu> = {
  title: 'Components/SideMenu',
  component: SideMenu,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { onClose: fn() },
} satisfies Meta<typeof SideMenu>;

export default meta;
type Story = StoryObj<typeof SideMenu>;

export const Default: Story = {
  args: { onClose: () => console.log('Menu closed') },
};
