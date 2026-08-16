// @ts-check
const base = require('./base.js');

/** @type {import("eslint").Linter.Config[]} */
const nestConfig = [
  ...base,
  {
    files: ['**/*.ts'],
    rules: {
      // NestJS uses decorators and class patterns that need these relaxed
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'off', // NestJS Logger handles this via injection
    },
  },
];

module.exports = nestConfig;
