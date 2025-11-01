import { fireEvent, render, screen } from '@testing-library/react';
import MenuButton from './MenuButton.component';

describe('MenuButton', (): void => {
  const mockOnClick = jest.fn();

  beforeEach((): void => {
    jest.clearAllMocks();
  });

  it('should render children correctly', (): void => {
    render(<MenuButton onClick={mockOnClick}>Click Me</MenuButton>);

    const button: HTMLElement = screen.getByRole('button', {
      name: /click me/i,
    });
    expect(button).toBeInTheDocument();
  });

  it('should call onClick when the button is clicked', (): void => {
    render(<MenuButton onClick={mockOnClick}>Click Me</MenuButton>);

    const button: HTMLElement = screen.getByRole('button', {
      name: /click me/i,
    });
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should render multiple children correctly', (): void => {
    render(
      <MenuButton onClick={mockOnClick}>
        <span data-testid="icon">🔥</span>
        <span>Label</span>
      </MenuButton>
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Label')).toBeInTheDocument();
  });
});
