module.exports = {
  'env': {
    'node': true,
    'commonjs': true,
    'es6': true
  },
  'extends': 'eslint:recommended',
  'parser': 'babel-eslint',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
      // lambda表达式 
      'arrowFunctions': true,
      // 解构赋值 
      'destructuring': true,
      // class 
      'classes': true,
      'defaultParams': true,
      // 块级作用域，允许使用let const
      'blockBindings': true,
      // 允许使用模块，模块内默认严格模式
      'modules': true,
      // 允许字面量定义对象时，用表达式做属性名
      'objectLiteralComputedProperties': true,
      // 允许对象字面量方法名简写
      'objectLiteralShorthandMethods': true,
      'objectLiteralShorthandProperties': true,
      'restParams': true,
      'spread': true,
      'forOf': true,
      'generators': true,
      'templateStrings': true,
      'superInFunctions': true,
      'experimentalObjectRestSpread': true,
    },
    'sourceType': 'module'
  },
  'rules': {
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'comma-dangle': ['error', 'only-multiline'],
    'semi': ['error', 'never']
  }
}