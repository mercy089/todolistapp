import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] }, // Ignore 'dist' directory
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest', // Use the latest ECMAScript version
      globals: { ...globals.browser, ...globals.node }, // Add globals for both browser and node environments if needed
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: { version: 'detect' }, // Automatically detect React version
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off', // Allow target="_blank" without rel="noreferrer"
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }, // Allow constant exports in React Refresh
      ],
      'react/prop-types': 'off', // Disable prop-types validation
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^React$', // Ignore warnings for unused React import
          argsIgnorePattern: '^_', // Ignore warnings for unused function arguments starting with '_'
          ignoreRestSiblings: true, // Ignore rest siblings in destructuring assignments
        },
      ],
      'react/react-in-jsx-scope': 'off', // Disable rule requiring React to be in scope for JSX
    },
  },
];
