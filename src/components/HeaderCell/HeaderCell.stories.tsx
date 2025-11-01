import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ComponentProps, type JSX } from 'react';
import HeaderCell from './HeaderCell.component';

const meta: Meta<typeof HeaderCell> = {
  title: 'Components/HeaderCell',
  component: HeaderCell,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof HeaderCell>;

function InteractiveHeaderCell(
  props: Readonly<
    Omit<
      ComponentProps<typeof HeaderCell>,
      'sortKey' | 'sortOrder' | 'toggleSort'
    >
  >
): JSX.Element {
  const [sortKey, setSortKey] = useState<
    'category' | 'notes' | 'date' | 'value'
  >('category');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  function toggleSort(key: typeof sortKey): void {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  }

  return (
    <HeaderCell
      {...props}
      sortKey={sortKey}
      sortOrder={sortOrder}
      toggleSort={toggleSort}
    />
  );
}

export const Default: Story = {
  render: (): JSX.Element => (
    <InteractiveHeaderCell label="Category" keyName="category" />
  ),
};

export const Inactive: Story = {
  render: (): JSX.Element => (
    <HeaderCell
      label="Category"
      keyName="category"
      sortKey="notes"
      sortOrder="asc"
      toggleSort={(): void => {}}
    />
  ),
};
