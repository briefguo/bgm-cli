const webpack = require('webpack');
const chalk = require('chalk');

const dllConfig = require(`${__dirname}/../webpack/dll.config`);
const packageConfig = require('../package.config');
const options = require('./options');

// 生成dll
module.exports = function packDll(fn) {

  if (!options._.includes('server')) {
    dllConfig.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        }
      }),
      new webpack.optimize.UglifyJsPlugin(packageConfig.UglifyJsPlugin)
    );
  }

  webpack(dllConfig, function (err) {
    if (err) {
      throw new Error('webpack', err);
    }
    // stats
    (fn ? fn() : '');
    console.log(chalk.green(`dll has packed successfully!`));
  });
};
