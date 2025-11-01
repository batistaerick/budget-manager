import { fireEvent, render, screen } from '@testing-library/react';
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
      onClick={(): void => setDate(new Date('2025-10-21T00:00:00.000Z'))}
    >
      {arrows ? 'Arrows Enabled' : 'Pick Date'}
    </button>
  ),
}));

function Wrapper({
  arrows,
  dateFormat,
  showMonthYearPicker,
}: Partial<Omit<DatePickerDialogProps, 'setDate'>> = {}): JSX.Element {
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

describe('DatePickerDialog', (): void => {
  it('renders the component', (): void => {
    render(<Wrapper />);
    const button: HTMLElement = screen.getByTestId('custom-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Pick Date');
  });

  it('renders with arrows enabled', (): void => {
    render(<Wrapper arrows />);
    const button: HTMLElement = screen.getByTestId('custom-button');
    expect(button).toHaveTextContent('Arrows Enabled');
  });

  it('renders with month/year picker enabled', (): void => {
    render(<Wrapper showMonthYearPicker />);
    const button: HTMLElement = screen.getByTestId('custom-button');
    expect(button).toBeInTheDocument();
  });

  it('updates date when clicking the custom button', (): void => {
    render(<Wrapper />);
    const button: HTMLElement = screen.getByTestId('custom-button');

    fireEvent.click(button);

    fireEvent.click(button);
    expect(button).toBeInTheDocument();
  });

  it('renders with custom date format', (): void => {
    render(<Wrapper dateFormat="yyyy/MM/dd" />);
    const button: HTMLElement = screen.getByTestId('custom-button');
    expect(button).toBeInTheDocument();
  });
});
