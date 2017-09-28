const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const path = require('path')

const baseConfig = require('./base.config')
const { styleMatch } = require('../utils')
const packageConfig = require('../package.config')

const _clientPath = path.resolve(packageConfig.clientPath)
const _commonPath = path.resolve(packageConfig.commonPath)
const _distPath = path.resolve(packageConfig.distPath)
const _corePath = path.resolve(packageConfig.corePath)

const config = merge(baseConfig, {
  devtool: 'source-map',
  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client?reload=true',
    _corePath
  ],
  output: {
    filename: '[name].js',
    publicPath: '/',
    path: _distPath
  },
  module: {
    rules: [
      /**** common和src下的css和less都做cssModule ****/
      styleMatch('css', {
        include: [_clientPath, _commonPath],
        cssModules: true,
      }),
      styleMatch('less', {
        include: [_clientPath, _commonPath],
        cssModules: true,
      }),
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      }
    }),
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve(_distPath, 'dll-manifest.json')),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(_distPath, 'entry.html'),
      filename: 'index.html',
      inject: 'body'
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
})

module.exports = config
