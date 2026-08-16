// @ts-check
const base = require('./base.js');

/** @type {import("eslint").Linter.Config[]} */
const nextConfig = [
  ...base,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks'),
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // React
      'react/react-in-jsx-scope': 'off', // Not needed in Next.js
      'react/prop-types': 'off', // TypeScript handles this
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Next.js specific
      '@next/next/no-html-link-for-pages': 'error',
    },
  },
];

module.exports = nextConfig;
