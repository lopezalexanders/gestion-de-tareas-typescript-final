module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier'
  ],
  rules: {
    'import/order': [
      'error',
      {
        'groups': [['builtin', 'external'], 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always'
      }
    ],
    '@typescript-eslint/explicit-function-return-type': 'off'
  }
};
