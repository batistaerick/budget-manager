import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  useState,
  type ChangeEvent,
  type JSX,
  type KeyboardEvent,
} from 'react';
import Input from './Input.component';

function Wrapper(): JSX.Element {
  const [value, setValue] = useState('');
  return (
    <Input
      id="password-input"
      label="Password"
      type="password"
      value={value}
      onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>): void =>
        setValue(value)
      }
    />
  );
}

describe('Input component', (): void => {
  const mockOnChange = jest.fn<void, [ChangeEvent<HTMLInputElement>]>();
  const mockOnKeyDown = jest.fn<void, [KeyboardEvent<HTMLInputElement>]>();

  beforeEach((): void => {
    mockOnChange.mockClear();
    mockOnKeyDown.mockClear();
  });

  it('should render input and label correctly', (): void => {
    render(
      <Input
        id="test-input"
        label="Test Label"
        type="text"
        value=""
        onChange={mockOnChange}
        onKeyDown={mockOnKeyDown}
      />
    );

    const input: HTMLElement = screen.getByLabelText('Test Label');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveValue('');
  });

  it('should call onChange when typing', (): void => {
    render(
      <Input
        id="test-input"
        label="Test Label"
        type="text"
        value=""
        onChange={mockOnChange}
      />
    );

    const input: HTMLElement = screen.getByLabelText('Test Label');
    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('should call onKeyDown when key is pressed', (): void => {
    render(
      <Input
        id="test-input"
        label="Test Label"
        type="text"
        value=""
        onChange={mockOnChange}
        onKeyDown={mockOnKeyDown}
      />
    );

    const input: HTMLElement = screen.getByLabelText('Test Label');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(mockOnKeyDown).toHaveBeenCalledTimes(1);
  });

  it('should render password input with toggle icon', (): void => {
    render(
      <Input
        id="password-input"
        label="Password"
        type="password"
        value=""
        onChange={mockOnChange}
      />
    );

    const input: HTMLElement = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
    const icon: HTMLElement = screen.getByTestId('eye-icon');
    expect(icon).toBeInTheDocument();
  });

  it('should toggle password visibility when clicking eye icon', (): void => {
    render(<Wrapper />);

    const input: HTMLInputElement = screen.getByLabelText('Password');
    const icon: HTMLElement = screen.getByTestId('eye-icon');

    expect(input.type).toBe('password');
    fireEvent.click(icon);
    expect(input.type).toBe('text');
    fireEvent.click(icon);
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
  });
});
