import { FlatCompat } from '@eslint/eslintrc';
import storybook from 'eslint-plugin-storybook';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'next/typescript',
      'plugin:@typescript-eslint/recommended',
    ],
    parserOptions: {
      project: './tsconfig.json',
    },
    plugins: ['@typescript-eslint'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/max-params': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/require-await': 'warn',
      'import/no-unresolved': 'error',
      'no-console': ['warn', { allow: ['error'] }],
      'no-else-return': 'warn',
      'no-nested-ternary': 'warn',
      'no-unused-vars': 'warn',
      'no-useless-return': 'warn',
    },
  }),
  ...storybook.configs['flat/recommended'],
];

export default eslintConfig;
