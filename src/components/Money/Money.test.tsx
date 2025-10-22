import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Money from './Money.component';

jest.mock('@/utils/globalFormats.util', () => ({
  formatCurrency: jest.fn((value: number | bigint, locale: string): string => {
    if (value === undefined || value === null) return '$0.00';
    return `${locale === 'en' ? '$' : ''}${Number(value).toFixed(2)}`;
  }),
}));

describe('Money component', (): void => {
  it('renders formatted currency with default locale', (): void => {
    render(<Money value={123.45} />);
    expect(screen.getByText('$123.45')).toBeInTheDocument();
  });

  it('renders with a custom className', (): void => {
    render(<Money className="test-class" value={99.99} />);
    const element: HTMLElement = screen.getByText('$99.99');
    expect(element).toHaveClass('test-class');
  });

  it('renders $0.00 when value is undefined', (): void => {
    render(<Money />);
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('calls formatCurrency with correct arguments', (): void => {
    const { formatCurrency } = jest.requireMock('@/utils/globalFormats.util');
    render(<Money value={500} />);
    expect(formatCurrency).toHaveBeenCalledWith(500, 'en');
  });
});
