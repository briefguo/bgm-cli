const _ = require('lodash')
const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const STYLE_LOADER = {
  loader: 'style-loader'
}

const CSS_MODULES_LOADER = {
  loader: 'css-loader',
  options: {
    minimize: true,
    modules: true,
    importLoaders: 1,
    localIdentName: '[name]-[local]-[hash:base64:5]'
  }
}

const CSS_NORMAL_LOADER = {
  loader: 'css-loader',
  options: {
    minimize: true
  }
}

const POSTCSS_LOADER = {
  loader: 'postcss-loader',
  options: {
    plugins: () => [
      autoprefixer({
        browsers: ['> 5%']
      })
    ]
  }
}

const LESS_LOADER = {
  loader: 'less-loader'
}

module.exports = function styleMatch(match, opts) {
  const { cssModules, isProd } = opts
  delete opts.cssModules
  delete opts.isProd
  const restOpts = opts

  if (isProd) {
    let loaderList = [
      cssModules ? CSS_MODULES_LOADER : CSS_NORMAL_LOADER,
      POSTCSS_LOADER,
      LESS_LOADER
    ]
    return _.assign(restOpts, {
      test: { css: /\.css$/, less: /\.less$/ }[match],
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: { css: _.slice(loaderList, 0, 2), less: loaderList }[match]
      }),
    })
  } else {
    let loaderList = [
      STYLE_LOADER,
      cssModules ? CSS_MODULES_LOADER : CSS_NORMAL_LOADER,
      POSTCSS_LOADER,
      LESS_LOADER
    ]
    return _.assign(restOpts, {
      test: { css: /\.css$/, less: /\.less$/ }[match],
      use: { css: _.slice(loaderList, 0, 3), less: loaderList }[match],
    })
  }

}
