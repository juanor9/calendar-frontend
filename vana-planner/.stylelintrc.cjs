module.exports = {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'selector-class-pattern': null,
    'no-descending-specificity': null,
    'no-empty-source': null,
    'scss/comment-no-empty': null,
  },
  ignoreFiles: [
    '**/*.js',
    '**/*.ts',
    '**/*.vue',
    '**/*.json',
    '**/*.md',
  ],
};
