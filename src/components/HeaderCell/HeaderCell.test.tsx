import { fireEvent, render, screen } from '@testing-library/react';
import HeaderCell from './HeaderCell.component';

describe('HeaderCell', () => {
  const mockToggleSort = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('renders the label correctly', (): void => {
    render(
      <HeaderCell
        label="Category"
        keyName="category"
        sortKey="notes"
        sortOrder="asc"
        toggleSort={mockToggleSort}
      />
    );

    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('calls toggleSort with the correct key when clicked', (): void => {
    render(
      <HeaderCell
        label="Category"
        keyName="category"
        sortKey="notes"
        sortOrder="asc"
        toggleSort={mockToggleSort}
      />
    );

    const button: HTMLElement = screen.getByRole('button', {
      name: /sort by category/i,
    });
    fireEvent.click(button);

    expect(mockToggleSort).toHaveBeenCalledTimes(1);
    expect(mockToggleSort).toHaveBeenCalledWith('category');
  });

  it('shows the correct icon when active (descending)', (): void => {
    render(
      <HeaderCell
        label="Category"
        keyName="category"
        sortKey="category"
        sortOrder="desc"
        toggleSort={mockToggleSort}
      />
    );

    const button: HTMLElement = screen.getByRole('button', {
      name: /sort by category/i,
    });
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('does not show icon when not active', (): void => {
    render(
      <HeaderCell
        label="Category"
        keyName="category"
        sortKey="notes"
        sortOrder="asc"
        toggleSort={mockToggleSort}
      />
    );

    const button: HTMLElement = screen.getByRole('button', {
      name: /sort by category/i,
    });
    expect(button.querySelector('svg')).toBeNull();
  });

  it('applies aria-pressed correctly', (): void => {
    const { rerender } = render(
      <HeaderCell
        label="Category"
        keyName="category"
        sortKey="category"
        sortOrder="asc"
        toggleSort={mockToggleSort}
      />
    );

    let button: HTMLElement = screen.getByRole('button', {
      name: /sort by category/i,
    });
    expect(button).toHaveAttribute('aria-pressed', 'true');

    rerender(
      <HeaderCell
        label="Category"
        keyName="category"
        sortKey="notes"
        sortOrder="asc"
        toggleSort={mockToggleSort}
      />
    );

    button = screen.getByRole('button', { name: /sort by category/i });
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });
});
