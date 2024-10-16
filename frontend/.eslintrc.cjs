module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  overrides: [
    {
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react', 'react-refresh', 'prettier'],
  rules: {
    // Disallow the use of console, but allow the use of console.error
    'no-console': [
      'error',
      {
        allow: ['error'],
      },
    ],
    'react/prop-types': 'off',
    // Disable the rule that requires React to be in scope when using JSX
    'react/react-in-jsx-scope': 'off',
    // Disable the warning about missing displayName in React components
    'react/display-name': 'off',
    // Disable the rule that prefers default exports
    'import/prefer-default-export': 'off',
    // Enforce 2-space indentation
    indent: ['error', 2],
    // Enforce Unix line endings (LF)
    'linebreak-style': ['unix'],
    // Enforce the use of single quotes for strings
    quotes: ['error', 'single'],
    // Enforce the use of semicolons at the end of statements
    semi: ['error', 'always'],
    // Rules for defining functional components
    'react/function-component-definition': [
      'error',
      {
        // Require the use of function declaration for named components
        namedComponents: 'function-declaration',
        // Require the use of arrow functions for unnamed components
        unnamedComponents: 'arrow-function',
      },
    ],
    // Enforce newline at the end of file, with no multiple empty lines
    'eol-last': ['error', 'always'],
  },
};
