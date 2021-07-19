module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    '@bankai/eslint-config/vue',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
  },
}
