import { useColorScheme } from 'react-native';

export const darkColors = {
  background: '#1e1e2e',
  mantle: '#181825',
  crust: '#11111b',
  surface: '#313244',
  surfaceStrong: '#45475a',
  foreground: '#cdd6f4',
  muted: '#a6adc8',
  subtle: '#bac2de',
  border: '#45475a',
  accent: '#89b4fa',
  income: '#a6e3a1',
  expense: '#f38ba8',
  warning: '#f9e2af',
  white: '#ffffff',
} as const;

export const lightColors = {
  background: '#eff1f5',
  mantle: '#e6e9ef',
  crust: '#dce0e8',
  surface: '#ccd0da',
  surfaceStrong: '#bcc0cc',
  foreground: '#4c4f69',
  muted: '#6c6f85',
  subtle: '#5c5f77',
  border: '#bcc0cc',
  accent: '#1e66f5',
  income: '#40a02b',
  expense: '#d20f39',
  warning: '#df8e1d',
  white: '#ffffff',
} as const;

export type ThemeColors = typeof darkColors | typeof lightColors;

export function useTheme(): ThemeColors {
  return useColorScheme() === 'light' ? lightColors : darkColors;
}
