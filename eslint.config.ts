import jseslint from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import betterTailwind from 'eslint-plugin-better-tailwindcss';
import prettier from 'eslint-plugin-prettier/recommended';
import reactDoctor from 'eslint-plugin-react-doctor';
import reactHooks from 'eslint-plugin-react-hooks';
import reactYouMightNotNeedAnEffect from 'eslint-plugin-react-you-might-not-need-an-effect';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

const eslintConfig = defineConfig([
  globalIgnores([
    'dist/**',
    'output/**',
    '.tsbuild/**',
    'node_modules/**',
    '*.tsbuildinfo',
    'eslint.config.d.ts',
    'eslint.config.js',
    'prettier.config.d.mts',
    'prettier.config.mjs',
    'vite.config.d.ts',
    'vite.config.js',
  ]),
  {
    extends: [
      jseslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      eslintReact.configs['recommended-typescript'],
      reactDoctor.configs.recommended,
      reactHooks.configs.flat['recommended-latest'],
      reactYouMightNotNeedAnEffect.configs.strict,
      prettier,
      betterTailwind.configs['recommended-error'],
    ],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'no-alert': 'error',
      'no-console': ['error', { allow: ['error'] }],
      'prefer-const': 'error',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
      'react-doctor/react-compiler-no-manual-memoization': 'off',
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/styles.css',
      },
      react: {
        version: '19',
      },
    },
  },
]);

export default eslintConfig;
