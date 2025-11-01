import type { Meta, StoryObj } from '@storybook/react';
import { useState, type JSX } from 'react';
import DatePickerDialog, {
  DatePickerDialogProps,
} from './DatePickerDialog.component';

jest.mock('@/components', () => ({
  DatePickerCustomButton: ({
    arrows,
    setDate,
  }: {
    arrows?: boolean;
    setDate: (date: Date) => void;
  }): JSX.Element => (
    <button
      data-testid="custom-button"
      onClick={(): void => setDate(new Date())}
    >
      {arrows ? 'Arrows Enabled' : 'Pick Date'}
    </button>
  ),
}));

const meta: Meta<typeof DatePickerDialog> = {
  title: 'Components/DatePickerDialog',
  component: DatePickerDialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof DatePickerDialog>;

function InteractiveWrapper({
  arrows,
  dateFormat,
  showMonthYearPicker,
}: Partial<Omit<DatePickerDialogProps, 'setDate' | 'date'>> = {}): JSX.Element {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <DatePickerDialog
      date={date}
      setDate={setDate}
      arrows={arrows}
      dateFormat={dateFormat}
      showMonthYearPicker={showMonthYearPicker}
    />
  );
}

export const Default: Story = {
  render: (): JSX.Element => <InteractiveWrapper arrows={false} />,
};

export const WithArrows: Story = {
  render: (): JSX.Element => <InteractiveWrapper arrows={true} />,
};

export const MonthYearPicker: Story = {
  render: (): JSX.Element => (
    <InteractiveWrapper showMonthYearPicker={true} arrows={true} />
  ),
};

export const CustomDateFormat: Story = {
  render: (): JSX.Element => <InteractiveWrapper dateFormat="yyyy/MM/dd" />,
};
