import { authenticationService } from '@/services';
import { fireEvent, render, screen } from '@testing-library/react';
import SideMenu from './SideMenu.component';

jest.mock('@/services', () => ({
  authenticationService: { logout: jest.fn() },
}));

const mockPush = jest.fn();
let mockPathname = '/';

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ push: mockPush }),
}));

describe('SideMenu', (): void => {
  const mockOnClose = jest.fn();

  beforeEach((): void => {
    mockPathname = '/';
    jest.clearAllMocks();
  });

  it('renders all menu buttons', (): void => {
    render(<SideMenu onClose={mockOnClose} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('calls onClose and pushes when a navigation button is clicked', (): void => {
    render(<SideMenu onClose={mockOnClose} />);

    const homeButton: HTMLElement = screen.getByText('Home');
    fireEvent.click(homeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('calls authenticationService.logout when Sign Out button is clicked', (): void => {
    render(<SideMenu onClose={mockOnClose} />);

    const signOutButton: HTMLElement = screen.getByText('Sign Out');

    fireEvent.click(signOutButton);
    expect(authenticationService.logout).toHaveBeenCalledTimes(1);
  });

  it('marks the current route as active', (): void => {
    mockPathname = '/savings';

    render(<SideMenu onClose={mockOnClose} />);

    expect(
      screen.getByRole('button', { name: /savings/i }).className
    ).toContain('bg-[var(--ctp-blue)]/20');
  });

  it('calls onClose and pushes correctly for other buttons', (): void => {
    render(<SideMenu onClose={mockOnClose} />);

    const analyticsButton: HTMLElement = screen.getByText('Analytics');
    fireEvent.click(analyticsButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/analytics');

    const profileButton: HTMLElement = screen.getByText('Profile');
    fireEvent.click(profileButton);
    expect(mockOnClose).toHaveBeenCalledTimes(2);
    expect(mockPush).toHaveBeenCalledWith('/profile');
  });
});
