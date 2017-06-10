const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');
const autoprefixer = require('autoprefixer');

var baseConfig = require('./base.config');
var packageConfig = require('../package.config');
const __clientPath = path.resolve(packageConfig.clientPath);
const __commonPath = path.resolve(packageConfig.commonPath);
const __distPath = path.resolve(packageConfig.distPath);
const __corePath = path.resolve(packageConfig.corePath);
const __devJSloader = packageConfig.devJSloader;

module.exports = merge(baseConfig, {
  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client?reload=true',
    // 'react-hot-loader/patch',
    __corePath
  ],
  output: {
    filename: '[name].js',
    publicPath: '/',
    path: __distPath
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader',
        options: {
          minimize: true,
          modules: true,
          importLoaders: 1,
          localIdentName: '[name]-[local]-[hash:base64:5]'
        }
      }, {
        loader: 'postcss-loader',
        options: {
          plugins: () => [
            autoprefixer({
              browsers: ['> 5%']
            })
          ]
        }
      }],
      include: [__clientPath, __commonPath]
    }, {
      test: /\.less$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader',
        options: {
          minimize: true
        }
      }, {
        loader: 'less-loader'
      }],
      include: [__commonPath]
    }, {
      test: /\.js$/,
      use: __devJSloader ? __devJSloader : [{
        loader: "babel-loader",
      }],
      include: [__clientPath, __commonPath],
      exclude: /node_modules/
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      }
    }),
    new webpack.DllReferencePlugin({
      // context: path.resolve(__dirname, 'dist'),
      manifest: require(path.resolve(__distPath, 'dll-manifest.json')),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__distPath, 'entry.html'),
      filename: 'index.html',
      inject: 'body'
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
