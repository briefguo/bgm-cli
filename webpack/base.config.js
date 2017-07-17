const path = require('path');

var packageConfig = require('../package.config');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const __rootDirs = packageConfig.rootDirs;
const [assetsPath, assetsTargetPath] = packageConfig.assetsPath

let hasCommonImages = null

try {
  const _assetsPath = path.resolve(assetsPath);
  const fs = require('fs')
  fs.readdirSync(_assetsPath)
  hasCommonImages = true
} catch (err) {
  hasCommonImages = false
}

module.exports = {
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
      // include: [__commonPath],
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
    }]
  },
  resolve: {
    // options for resolving module requests
    // (does not apply to resolving to loaders)

    modules: __rootDirs,
    // directories where to look for modules

    extensions: ['.ts', '.tsx', ".js", ".json", ".md", ".html", ".css", ".less"],
    // extensions that are used

    alias: {
      'moment': path.resolve('node_modules/moment/'),
      'core-js': path.resolve('node_modules/core-js/'),
      'history': path.resolve('node_modules/history/'),
      // a list of module name aliases

      // "module": "new-module",
      // alias "module" -> "new-module" and "module/path/file" -> "new-module/path/file"

      // "only-module$": "new-module",
      // alias "only-module" -> "new-module", but not "module/path/file" -> "new-module/path/file"

      // "module": path.resolve(__dirname, "app/third/module.js"),
      // alias "module" -> "./app/third/module.js" and "module/file" results in error
      // modules aliases are imported relative to the current context
    },
  },
  plugins: hasCommonImages ? [
    new CopyWebpackPlugin([{
      from: assetsPath,
      to: assetsTargetPath
    }])
  ] : []
};
