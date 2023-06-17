module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['dist'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-mixed-spaces-and-tabs': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-dupe-class-members': 'off',
      },
    },
  ],
};
