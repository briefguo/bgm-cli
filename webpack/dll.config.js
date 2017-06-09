
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

const packageJSON = require(path.resolve('./package.json'));
const baseConfig = require('./base.config');
const packageConfig = require('../package.config');
const __dependencies = Object.keys(packageJSON.dependencies);
const __distPath = path.resolve(packageConfig.distPath);
const __corePath = path.resolve(packageConfig.corePath);

console.log(__dependencies);

module.exports = merge(baseConfig, {
  entry: {
    dll: __dependencies
  },
  output: {
    path: __distPath,
    publicPath: '/',
    filename: '[name]_[hash].js',
    library: '[name]_[hash]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__distPath, "[name]-manifest.json"),
      name: "[name]_[hash]"
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__corePath, 'index.html'),
      filename: 'entry.html',
      inject: 'body'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      }
    }),
  ]
});
