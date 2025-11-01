import { fireEvent, render, screen } from '@testing-library/react';
import type { SetStateAction } from 'react';
import DatePickerCustomButton from './DatePickerCustomButton.component';

describe('DatePickerCustomButton component', (): void => {
  const mockSetDate = jest.fn<void, [SetStateAction<Date>]>();

  it('should render correctly', (): void => {
    render(<DatePickerCustomButton arrows setDate={mockSetDate} />);

    const buttons: HTMLElement[] = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('should render without arrows', (): void => {
    render(<DatePickerCustomButton setDate={mockSetDate} />);

    const buttons: HTMLElement[] = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1);
  });

  it('should render with element', (): void => {
    render(
      <DatePickerCustomButton
        setDate={mockSetDate}
        value={<div data-testid="test">testing</div>}
      />
    );

    const button: HTMLElement = screen.getByTestId('test');
    expect(button).toBeInTheDocument();
  });

  it('calls setDate with previous month when clicking left arrow', (): void => {
    render(<DatePickerCustomButton arrows setDate={mockSetDate} />);

    const leftArrow: HTMLElement = screen.getAllByRole('button')[0];
    fireEvent.click(leftArrow);

    expect(mockSetDate).toHaveBeenCalledTimes(1);
    expect(typeof mockSetDate.mock.calls[0][0]).toBe('function');
  });
});
