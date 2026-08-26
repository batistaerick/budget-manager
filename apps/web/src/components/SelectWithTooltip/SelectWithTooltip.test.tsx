import { fireEvent, render, screen } from '@testing-library/react';
import type { JSX, ReactNode } from 'react';
import SelectWithTooltip from './SelectWithTooltip.component';

jest.mock('@/components', () => ({
  Tooltip: ({
    tooltip,
    children,
  }: {
    tooltip: string;
    children: ReactNode;
  }): JSX.Element => (
    <div data-testid="tooltip" data-tooltip={tooltip}>
      {children}
    </div>
  ),
}));

describe('SelectWithTooltip', (): void => {
  const mockOnChange = jest.fn();
  const mockIcon: JSX.Element = <span data-testid="icon">🔥</span>;
  const options = [
    { label: 'Option 1', value: 'one' },
    { label: 'Option 2', value: 'two' },
  ];

  beforeEach(() => mockOnChange.mockClear());

  it('renders the component with provided props', (): void => {
    render(
      <SelectWithTooltip
        id="test-select"
        tooltip="Tooltip text"
        icon={mockIcon}
        options={options}
        value="one"
        onChange={mockOnChange}
      />
    );
    expect(screen.getByTestId('tooltip')).toHaveAttribute(
      'data-tooltip',
      'Tooltip text'
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('one');
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  it('calls onChange when a different option is selected', (): void => {
    render(
      <SelectWithTooltip
        id="test-select"
        tooltip="Tooltip text"
        icon={mockIcon}
        options={options}
        value="one"
        onChange={mockOnChange}
      />
    );

    const select: HTMLElement = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'two' } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('respects the disabled prop', (): void => {
    render(
      <SelectWithTooltip
        id="disabled-select"
        tooltip="Disabled tooltip"
        icon={mockIcon}
        options={options}
        onChange={mockOnChange}
        disabled
      />
    );

    const select: HTMLElement = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });

  it('renders correct option labels and values', (): void => {
    render(
      <SelectWithTooltip
        id="test-select"
        tooltip="Tooltip"
        icon={mockIcon}
        options={options}
        onChange={mockOnChange}
      />
    );

    const renderedOptions: HTMLElement[] = screen.getAllByRole('option');
    expect(renderedOptions[0]).toHaveTextContent('Option 1');
    expect(renderedOptions[0]).toHaveValue('one');
    expect(renderedOptions[1]).toHaveTextContent('Option 2');
    expect(renderedOptions[1]).toHaveValue('two');
  });
});
