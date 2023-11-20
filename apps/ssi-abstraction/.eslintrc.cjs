module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2021,
  },
  env: {
    node: true,
  },
  plugins: ['prettier', '@typescript-eslint/eslint-plugin', 'jest'],
  extends: [
    'prettier',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
  ],
  ignorePatterns: ['.eslintrc.cjs', 'dist'],
  overrides: [],
  settings: {
    jest: {
      version: '29',
    },
  },
  rules: {
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': [1, { argsIgnorePattern: '^_' }],
  },
  overrides: [
    {
      files: [
        '*.spec.ts',
        '*.e2e-spec.ts',
        '__mocks__/*.ts',
        '__mocks__/**/*.ts',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-empty-function': 0,
        '@typescript-eslint/ban-ts-comment': 0,
        '@typescript-eslint/no-unused-vars': 0,
        'jest/no-mocks-import': 0,
        'jest/expect-expect': 0,
      },
    },
  ],
};
