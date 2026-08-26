import type { StorybookConfig } from '@storybook/nextjs-vite';
import { mergeConfig, type InlineConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: { name: '@storybook/nextjs-vite', options: {} },
  viteFinal(baseConfig: InlineConfig) {
    return mergeConfig(baseConfig, {
      resolve: {
        alias: {
          'next/navigation': '/src/storybook-mocks/next-navigation.ts',
          '@/services': '/src/storybook-mocks/services.ts',
        },
      },
    });
  },
};
export default config;
