import { authenticationService } from '@/services';
import { fireEvent, render, screen } from '@testing-library/react';
import * as nextNavigation from 'next/navigation';
import SideMenu from './SideMenu.component';

jest.mock('@/services', () => ({
  authenticationService: { logout: jest.fn() },
}));
jest.mock('next/navigation', () => ({ redirect: jest.fn() }));

describe('SideMenu', (): void => {
  const mockOnClose = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('renders all menu buttons', (): void => {
    render(<SideMenu onClose={mockOnClose} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('calls onClose and redirect when a navigation button is clicked', (): void => {
    render(<SideMenu onClose={mockOnClose} />);

    const homeButton: HTMLElement = screen.getByText('Home');
    fireEvent.click(homeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(nextNavigation.redirect).toHaveBeenCalledWith('/');
  });

  it('calls authenticationService.logout when Sign Out button is clicked', (): void => {
    render(<SideMenu onClose={mockOnClose} />);

    const signOutButton: HTMLElement = screen.getByText('Sign Out');

    fireEvent.click(signOutButton);
    expect(authenticationService.logout).toHaveBeenCalledTimes(1);
  });

  it('calls onClose and redirect correctly for other buttons', (): void => {
    render(<SideMenu onClose={mockOnClose} />);

    const analyticsButton: HTMLElement = screen.getByText('Analytics');
    fireEvent.click(analyticsButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(nextNavigation.redirect).toHaveBeenCalledWith('/analytics');

    const profileButton: HTMLElement = screen.getByText('Profile');
    fireEvent.click(profileButton);
    expect(mockOnClose).toHaveBeenCalledTimes(2);
    expect(nextNavigation.redirect).toHaveBeenCalledWith('/profile');

    const settingsButton: HTMLElement = screen.getByText('Settings');
    fireEvent.click(settingsButton);
    expect(mockOnClose).toHaveBeenCalledTimes(3);
    expect(nextNavigation.redirect).toHaveBeenCalledWith('/settings');
  });
});
