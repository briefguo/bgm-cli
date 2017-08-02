const path = require('path')
const packageConfig = require('../package.config')
const _clientPath = path.resolve(packageConfig.clientPath)
const _commonPath = path.resolve(packageConfig.commonPath)

const config = {
  module: {
    rules: [{
      test: /\.md$/,
      use: [{
        loader: 'html-loader',
        options: {
          attrs: false
        }
      }, {
        loader: 'markdown-loader'
      }],
      exclude: /node_modules/
    }, {
      test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 5000,
          name: '[path][name].[ext]',
        }
      }],
      exclude: /node_modules/
    }, {
      test: /\.html$/,
      use: [{
        loader: 'html-loader',
        options: {
          attrs: false
        }
      }],
      exclude: /node_modules/
    }, {
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      use: [
        { loader: 'react-hot-loader' },
        { loader: 'babel-loader' },
        {
          loader: 'ts-loader',
          options: {
            configFileName: 'tsconfig.json',
            transpileOnly: true
          }
        }
      ]
    }, {
      test: /\.js$/,
      use: [
        { loader: 'react-hot-loader' }, { loader: 'babel-loader' }
      ],
      include: [_clientPath, _commonPath],
      exclude: /node_modules/
    }]
  },
  resolve: {
    // options for resolving module requests
    // (does not apply to resolving to loaders)

    modules: packageConfig.rootDirs,
    // directories where to look for modules

    extensions: ['.ts', '.tsx', '.js', '.json', '.md', '.html', '.css', '.less'],
    // extensions that are used

    alias: packageConfig.resolveAlias,
  },
  plugins: []
}

module.exports = config
