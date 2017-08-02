const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const baseConfig = require('./base.config')
const packageConfig = require('../package.config')
const packageJSON = require(path.resolve('./package.json'))
const _distPath = path.resolve(packageConfig.distPath)
const _corePath = path.resolve(packageConfig.corePath)

const config = merge(baseConfig, {
  entry: {
    dll: Object.keys(packageJSON.dependencies)
  },
  output: {
    path: _distPath,
    publicPath: '/',
    filename: '[name]_[hash].js',
    library: '[name]_[hash]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(_distPath, '[name]-manifest.json'),
      name: '[name]_[hash]'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(_corePath, 'index.html'),
      filename: 'entry.html',
      inject: 'body'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      }
    }),
  ]
})

module.exports = config
