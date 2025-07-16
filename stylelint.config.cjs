module.exports = {
  extends: ['stylelint-config-standard-scss'],
  plugins: ['stylelint-scss'],
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
  rules: {
    'selector-class-pattern': '^[a-z0-9]+(?:__[a-z0-9]+)?(?:--[a-z0-9]+)?$',
    'scss/at-rule-no-unknown': true,
    'scss/at-use-no-unnamespaced': null,
    'no-descending-specificity': null,
    'scss/dollar-variable-empty-line-before': 'never',
    'rule-empty-line-before': 'always-multi-line',
    'color-function-notation': 'legacy',
    'alpha-value-notation': 'percentage',
    'color-function-alias-notation': 'none',
  },
}
