module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'solid'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'plugin:solid/typescript',
    'prettier',
  ],
  rules: {
    'max-len': ['error', { code: 80 }],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        endOfLine: 'auto',
        trailingComma: 'all',
        tabWidth: 2,
        bracketSpacing: true,
        semi: false,
        printWidth: 80,
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': [
      2,
      {
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-var-requires': 'off',
    'import/no-unresolved': 'off',
    'import/order': [
      'error',
      {
        groups: ['external', 'internal'],
        'newlines-between': 'always-and-inside-groups',
        alphabetize: {
          order: 'asc',
        },
      },
    ],
    'sort-imports': [
      'warn',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
      },
    ],
    'solid/no-destructure': 'off',
  },
  ignorePatterns: ['CHANGELOG.md', 'build', 'dist', 'node_modules'],
  env: {
    browser: true,
    amd: true,
    node: true,
  },
}
