// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ['plugin:vue/essential'],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['error', {
      props: false
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'semi': 2,
		'no-extra-semi': 2,
		'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
		'indent': ['error', 'tab', {'SwitchCase': 1}],
		'keyword-spacing': ['error', { 'after': true }],
		'space-before-blocks': 'error',
		'key-spacing': ['error', {'beforeColon': false, 'afterColon': true}],
		'space-in-parens': ['error', 'never'],
		'space-before-function-paren': ['error', 'never'],
		'array-bracket-spacing': ['error', 'never'],
		'object-curly-spacing': ['error', 'never'],
		'semi-spacing': ['error', {'before': false, 'after': true}],
		'no-multi-spaces': 'error',
		'no-trailing-spaces': 'error',
		'space-infix-ops': 'error',
		'comma-spacing': ['error', { 'before': false, 'after': true }],
		'arrow-parens': ['error', 'always'],
		'no-dupe-args': 'error',
		'yoda': 'error',
    'comma-dangle': ['error', 'never']
  }
}
