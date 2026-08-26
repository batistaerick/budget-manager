import { useColorScheme } from 'react-native';

export const darkColors = {
  background: '#111827',
  surface: '#1f2937',
  surfaceStrong: '#374151',
  foreground: '#f9fafb',
  muted: '#9ca3af',
  border: '#374151',
  accent: '#22c55e',
  income: '#4ade80',
  expense: '#fb7185',
  warning: '#fbbf24',
  white: '#ffffff',
} as const;

export const lightColors = {
  background: '#f3f4f6',
  surface: '#ffffff',
  surfaceStrong: '#e5e7eb',
  foreground: '#111827',
  muted: '#6b7280',
  border: '#d1d5db',
  accent: '#15803d',
  income: '#15803d',
  expense: '#be123c',
  warning: '#a16207',
  white: '#ffffff',
} as const;

export type ThemeColors = typeof darkColors | typeof lightColors;

export function useTheme(): ThemeColors {
  return useColorScheme() === 'light' ? lightColors : darkColors;
}
