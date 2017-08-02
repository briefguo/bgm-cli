const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { styleMatch } = require('../utils')
const baseConfig = require('./base.config')
const packageConfig = require('../package.config')

const _clientPath = path.resolve(packageConfig.clientPath)
const _commonPath = path.resolve(packageConfig.commonPath)
const _distPath = path.resolve(packageConfig.distPath)
const _corePath = path.resolve(packageConfig.corePath)

const config = merge(baseConfig, {
  entry: [_corePath],
  output: {
    path: _distPath,
    publicPath: '/',
    chunkFilename: '[name]_[chunkhash].js',
    filename: '[name]_[hash].js',
  },
  module: {
    rules: [
      /**** common和src下的css和less都做cssModule ****/
      styleMatch('css', {
        include: [_clientPath, _commonPath],
        cssModules: true,
        isProd: true
      }),
      styleMatch('less', {
        include: [_clientPath, _commonPath],
        cssModules: true,
        isProd: true
      }),
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      }
    }),
    new ExtractTextPlugin('styles_[chunkhash].css'),
    new webpack.DllReferencePlugin({
      // context: path.resolve(_dirname, 'dist'),
      manifest: require(path.resolve(_distPath, 'dll-manifest.json')),
    }),
    // CommonChunksPlugin will now extract all the common modules from vendor and main bundles
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
      // But since there are no more common modules between them
      // we end up with just the runtime code included in the manifest file
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(_distPath, 'entry.html'),
      filename: 'index.html',
      inject: 'body'
    }),
  ]
})

module.exports = config
