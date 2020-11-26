module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    '@bankai/eslint-config/vue',
  ],

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
  },
}
