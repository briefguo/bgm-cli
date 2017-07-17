const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseConfig = require('./base.config');
const packageConfig = require('../package.config');
const __clientPath = path.resolve(packageConfig.clientPath);
const __commonPath = path.resolve(packageConfig.commonPath);
const __distPath = path.resolve(packageConfig.distPath);
const __corePath = path.resolve(packageConfig.corePath);
const [__assetsPath, __assetsTargetPath] = packageConfig.assetsPath

module.exports = merge(baseConfig, {
  entry: [__corePath],
  output: {
    path: __distPath,
    publicPath: '/',
    chunkFilename: '[name]_[chunkhash].js',
    filename: '[name]_[hash].js',
  },
  module: {
    rules: [ /**** common和src下的css和less都做cssModule ****/ {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          publicPath: __distPath,
          use: [{
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
        }),
        include: [__clientPath, __commonPath]
      }, {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          publicPath: __distPath,
          use: [{
            loader: 'css-loader',
            options: {
              minimize: true,
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]-[local]-[hash:base64:5]'
            }
          }, {
            loader: 'less-loader'
          }],
        }),
        include: [__clientPath, __commonPath]
      },
      /**** assets下的css和less不做cssModule ****/
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          publicPath: __distPath,
          use: [{
            loader: 'css-loader',
            options: {
              minimize: true
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
        }),
        include: [__assetsPath]
      }, {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          publicPath: __distPath,
          use: [{
            loader: 'css-loader',
            options: {
              minimize: true
            }
          }, {
            loader: 'less-loader'
          }],
        }),
        include: [__assetsPath]
      }, {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [{
          loader: "babel-loader",
        }, {
          loader: 'ts-loader'
        }]
      }, {
        test: /\.js$/,
        use: [{
          loader: "babel-loader",
        }],
        include: [__clientPath, __commonPath],
        exclude: /node_modules/
      }
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
      // context: path.resolve(__dirname, 'dist'),
      manifest: require(path.resolve(__distPath, 'dll-manifest.json')),
    }),
    //CommonChunksPlugin will now extract all the common modules from vendor and main bundles
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest' //But since there are no more common modules between them we end up with just the runtime code included in the manifest file
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__distPath, 'entry.html'),
      filename: 'index.html',
      inject: 'body'
    }),
  ]
});
