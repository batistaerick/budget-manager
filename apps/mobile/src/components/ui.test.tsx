import { fireEvent, render } from '@testing-library/react-native';

import { Button, EmptyState } from './ui';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
  usePathname: () => '/',
}));

jest.mock('@/features/auth/auth-context', () => ({
  useAuth: () => ({
    signOut: jest.fn().mockResolvedValue(undefined),
  }),
}));

describe('shared mobile UI', () => {
  it('invokes button actions', async () => {
    const onPress = jest.fn();
    const screen = await render(<Button label="Save" onPress={onPress} />);

    fireEvent.press(screen.getByRole('button', { name: 'Save' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders an accessible empty state', async () => {
    const screen = await render(
      <EmptyState title="Nothing here" description="Add your first item." />
    );

    expect(screen.getByText('Nothing here')).toBeTruthy();
    expect(screen.getByText('Add your first item.')).toBeTruthy();
  });
});
